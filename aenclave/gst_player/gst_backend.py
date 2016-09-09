#!/usr/bin/env python

from __future__ import with_statement

"""
A simple playlist audio player that wraps GStreamer.

Example API Usage:
    # Start the gobject main loop so that event listeners work.  This may happen
    # for you automatically if you use GTK.
    import gobject
    import threading
    event_loop = gobject.MainLoop()
    threading.Thread(target=event_loop.run).start()
    # Create the player.
    player = GstPlayer()
    # Queue some songs.
    song = Song("~/mp3/Jerk It Out.mp3")
    player.add_song(song)
    # Start, stop, pause and queue as much as you like.
    player.start()
    ...
    player.pause()
    ...
    player.start()
    ...
    player.stop()
"""

import os
os.environ["DJANGO_SETTINGS_MODULE"] = "menclave.settings"
import os.path
import pygst
pygst.require("0.10")
import gst
from collections import deque
import logging
import threading
import random
from django.db import transaction
from menclave import settings
from menclave.aenclave.models import Song


GST_STATES = {
    # See http://pygstdocs.berlios.de/pygst-reference/gst-constants.html
    gst.STATE_PLAYING: "playing",
    gst.STATE_PAUSED: "paused",
    gst.STATE_NULL: "stopped",
    gst.STATE_READY: "stopped",
    gst.STATE_VOID_PENDING: "stopped",
}


class Object(object):

    """
    An object with arbitrary attributes.
    """

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)


class Noise(object):

    """
    A fake stand-in for a song model for dequeue noises.
    """

    def __init__(self, path):
        self.audio = Object(path=path)
        self.noise = True
        self.playid = None
        self.time = 0


class ChannelSnapshot(object):

    """
    A snapshot of a channel's state at a given time.

    status -- The status of the channel: "playing", "paused", or "stopped".
    current_song -- The currently playing song, or None if stopped.
    song_queue -- The queue of songs to play.
    song_history -- The last 20 or less songs that have been played.
    time_elapsed -- The time elapsed playing the current song, or 0 if stopped.
    queue_duration -- The total duration in seconds of the queue.
    """

    def __init__(self, status, current_song, song_queue, song_history,
                 time_elapsed, queue_duration):
        self.status = status
        self.current_song = current_song
        self.song_queue = song_queue
        self.song_history = song_history
        self.time_elapsed = time_elapsed
        self.queue_duration = queue_duration


def synchronized(func):
    """A decorator for synchronizing methods of an instance on self.lock."""
    def new_func(self, *args, **kwargs):
        with self.lock:
            return func(self, *args, **kwargs)
    return new_func


def logged(func):
    def new_func(*args, **kwargs):
        logging.info("Entering function %r." % func.__name__)
        try:
            value = func(*args, **kwargs)
        except Exception, e:
            logging.exception(e.message)
            raise e
        finally:
            logging.info("Exiting function %r." % func.__name__)
        return value
    return new_func


class GstPlayer(object):

    """
    A simple playlist audio player that wraps GStreamer.

    NOTE: All public methods of this class should be synchronized on this
    instance with a re-entrant lock.

    NOTE: All methods that save data to the db need to be wrapped in Django
    transactions and make sure that their model is the most current.

    TODO(rnk): Use Python magic to synchronize all method calls with the
    synchronized decorator.

    Properties:
    song_queue -- A deque of songs that will be played.
    song_history -- A deque of the last 20 songs played.  The head is the most
                    recently played song.
    player -- The gst player object that does the dirty work.
    """

    def __init__(self):
        super(GstPlayer, self).__init__()
        self.song_queue = deque()
        self.song_history = deque([])  # TODO(rnk): For 2.6 we can use maxlen.
        self.current_song = None
        # Initialize the gst playbin.
        self.player = gst.element_factory_make("playbin", "player")
        fakesink = gst.element_factory_make("fakesink", "fakesink")
        self.player.set_property("video-sink", fakesink)
        # Register our message listener.
        # TODO(rnk): This code is cargo culted.  There might be a more
        # elegant/efficient way to do it where we don't catch all messages ever.
        bus = self.player.get_bus()
        bus.add_signal_watch()
        bus.connect("message", self.on_message)
        # The lock for the instance.
        self.lock = threading.RLock()
        self.next_playid = 0

    MAX_PLAYID = 2 ** 32

    def _get_next_playid(self):
        playid = self.next_playid
        self.next_playid += 1
        if self.next_playid > self.MAX_PLAYID:
            self.next_playid = 0
        return playid

    @synchronized
    def on_message(self, bus, message):
        """Handle messages from GStreamer."""
        t = message.type
        # Ignore these messages, there are too many.
        if t == gst.MESSAGE_STATE_CHANGED: return
        logging.info("Message type: %r" % t)
        if t == gst.MESSAGE_ERROR:
            # When there's an error playing a track, log it, and play the next
            # song.
            logging.info(message)
            self.start()
        elif t == gst.MESSAGE_EOS:
            self._song_transition()

    @transaction.autocommit
    def _song_transition(self):
        """Transition from one completed song to the next."""
        # Play the next song by stopping and starting playback.
        last_song = self.current_song
        self._stop()
        if self.song_queue:
            self.start()
        if last_song and not last_song.noise:
            try:
                # We refetch the song from the db in case its tags have been
                # editted while the song has been on the playlist.
                last_song = Song.objects.get(pk=last_song.pk)
                last_song.play_touch()
            except Exception:
                # Not worth propagating error, especially if it stops the main
                # loop.
                logging.exception("Unable to save song model to db.")

    #---------------------------- STATUS METHODS -----------------------------#

    @synchronized
    @logged
    def get_channel_snapshot(self):
        """Get a snapshot of the channel state."""
        song_queue = list(self.song_queue)
        duration = sum(song.time for song in song_queue)
        status = self._get_status()
        logging.info(status)
        if status == "stopped":
            current_song = None
            time_elapsed = 0
            song_history = list(self.song_history)
        else:
            current_song = self.current_song
            time_elapsed = self._get_elapsed_time()
            song_history = list(self.song_history)
            duration += current_song.time - time_elapsed
        return ChannelSnapshot(status, current_song, song_queue, song_history,
                               time_elapsed, duration)

    def _get_status(self):
        """
        Return a string telling if the player is playing, paused, or stopped.
        """
        # WTF(rnk): The get_state() value is a tuple of the element states,
        # apparently.  However, it seems we basically always want the second
        # element, so we index it.
        return GST_STATES[self.player.get_state()[1]]

    def _get_elapsed_time(self):
        """Return the elapsed time for the current song in seconds."""
        if self._get_status() == "stopped": return 0
        format = gst.Format(gst.FORMAT_TIME)
        try:
            nanos = self.player.query_position(format, None)[0]
        except gst.QueryError:
            # Sometimes we get this error around transitions, so we usually want
            # to return 0.
            return 0
        return float(nanos) / (1000 ** 3)

    #--------------------------- PLAYBACK CONTROL ----------------------------#

    @synchronized
    @logged
    def start(self):
        """
        Start playback.

        If the player is paused, it resumes playback.  If the player is playing,
        nothing happens.  If the player is stopped, it plays the next song and
        moves it from song_queue to song_history.
        """
        status = self._get_status()
        if status == "paused":
            self.player.set_state(gst.STATE_PLAYING)
        elif status != "playing":
            logging.info("Starting playback.")
            song = self.song_queue.popleft()
            self.current_song = song
            while len(self.song_history) > 20:
                self.song_history.pop()
            # TODO(rnk): Does the path need to be escaped?
            self.player.set_property("uri", "file://" + song.audio.path)
            self.player.set_state(gst.STATE_PLAYING)

    @logged
    def _stop(self):
        """Stop the player."""
        if self.current_song and not self.current_song.noise:
            self.song_history.appendleft(self.current_song)
        self.player.set_state(gst.STATE_NULL)

    @synchronized
    @logged
    def stop(self):
        """Stop the player and clear the queue."""
        self._stop()
        self.song_queue.clear()
        
    @synchronized
    @logged
    def pause(self):
        """Pause the player."""
        self.player.set_state(gst.STATE_PAUSED)

    @synchronized
    @logged
    def unpause(self):
        """Unpause the player."""
        if self._get_status() == "paused":
            self.start()

    def _pick_noise(self):
        """Return a fake song model annotated as a noise."""
        dir_list = os.listdir(settings.AENCLAVE_DEQUEUE_NOISES_DIR)
        if len(dir_list) == 0:
            raise OSError("No deque files")
        deq = random.choice(dir_list)
        return Noise(os.path.join(settings.AENCLAVE_DEQUEUE_NOISES_DIR, deq))

    @synchronized
    @logged
    @transaction.autocommit
    def skip(self):
        """Skip the current song and play a dequeue noise."""
        last_song = self.current_song
        self._stop()
        try:
            noise = self._pick_noise()
        except OSError:
            pass  # If there are errors finding the dequeue noises, do nothing.
        else:
            self.song_queue.appendleft(noise)
        if self.song_queue:
            self.start()
        if last_song and not last_song.noise:
            try:
                # We refetch the song from the db in case its tags have been
                # editted while the song has been on the playlist.
                last_song = Song.objects.get(pk=last_song.pk)
                last_song.skip_touch()
            except Exception:
                # Not worth propagating error.
                logging.exception("Unable to save song model to db.")

    #----------------------------- QUEUE CONTROL -----------------------------#

    @synchronized
    def add_song(self, song):
        """Add a song to the queue."""
        self.add_songs([song])

    @synchronized
    @logged
    def add_songs(self, songs):
        """Add some songs to the queue."""
        logging.info("Queuing songs: %r" % songs)
        for song in songs:
            song.playid = self._get_next_playid()
            song.noise = False
        self.song_queue.extend(songs)
        self.start()
        # We don't refetch the songs from the db because we should be inside
        # a transaction on the other side of the RPC.
        for song in songs:
            try:
                song.queue_touch()
            except Exception:
                # Not worth propagating error.
                logging.exception("Unable to save song model to db.")

    @synchronized
    def queue_to_front(self, song):
        """Dequeue the current song and start playing the new song."""
        self._stop()
        song.noise = False
        song.playid = self._get_next_playid()
        self.song_queue.appendleft(song)
        self.start()

    @synchronized
    def remove_song(self, playid):
        """Remove the song with playid from the queue."""
        self.remove_songs([playid])

    @synchronized
    @logged
    def remove_songs(self, playids):
        """Remove the songs with playids in playids from the queue."""
        playids = set(playids)
        logging.info(playids)
        self.song_queue = deque(song for song in self.song_queue
                                if song.playid not in playids)

    @synchronized
    @logged
    def move_song(self, playid, after_playid):
        """Move the first song to after the second song in the queue."""
        logging.info('playid: %i, after_playid: %i', playid, after_playid)
        # TODO(rnk): Clean this shit up.
        songs = list(self.song_queue)
        for (start_index, song) in enumerate(songs):
            if song.playid == playid:
                break  # Can't mutate the deque during iteration.
        else:
            return  # If we can't find the playid, cancel.
        the_song = song
        del songs[start_index]
        if after_playid == -1:
            after_index = -1  # Put the song at the beginning of the queue.
        else:
            for (after_index, song) in enumerate(songs):
                if song.playid == after_playid:
                    break  # Can't mutate the deque during iteration.
            else:
                return  # If we can't find the playid, cancel.
        songs.insert(after_index + 1, the_song)
        self.song_queue = deque(songs)

    @synchronized
    @logged
    def shuffle(self):
        """Shuffle the songs in the queue."""
        random.shuffle(self.song_queue)
