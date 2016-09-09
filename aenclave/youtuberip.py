#!/usr/bin/env python

"""This module rips YouTube into MP3s with Gstreamer and youtube-dl."""

import logging
import os
import time
import threading
import sys
sys.path.append("/Users/reid/")  # TODO(rnk): Delete before committing.

import gobject
gobject.threads_init()
import pygst
pygst.require("0.10")
import gst

from menclave.aenclave import youtubedl


event_thread_lock = threading.Lock()
event_thread = None


def init_gobject_mainloop():
    """Initialize the gobject event loop thread if it hasn't been already."""
    global event_thread
    with event_thread_lock:
        if event_thread is None:
            event_thread = threading.Thread(target=gobject.MainLoop().run)
            event_thread.daemon = True
            event_thread.start()


def make_bin_pads(bin, input, output):
    # Connect the source and sink pads of the bin to the appropriate elements.
    # I'm also not sure why these inputs and outputs seem logically reversed,
    # but this works.
    binsrc = gst.GhostPad("binsrc", output.get_pad("src"))
    bin.add_pad(binsrc)
    binsink = gst.GhostPad("binsink", input.get_pad("sink"))
    bin.add_pad(binsink)


def build_mp4_remux_bin():
    """This bin will rip audio from video by demuxing an MP4.

    This method is fast and high quality, but it only works on MP4s.
    """
    bin = gst.Bin("mp4_remux")

    # Make elements.
    demux = gst.element_factory_make("qtdemux")
    queue = gst.element_factory_make("queue")
    mux = gst.element_factory_make("qtmux")

    # Link and add elements.
    bin.add(demux, queue, mux)
    def demux_callback(demux, new_pad):
        if new_pad.get_name() == "audio_00":
            demux.link(queue)
    demux.connect("pad-added", demux_callback)
    queue.link(mux)

    make_bin_pads(bin, demux, mux)

    return bin


def build_flv_demux_bin():
    """This bin will rip audio from video by demuxing an MP4.

    This method is fast and high quality, but it only works on MP4s.
    
    TODO(rnk): This method is totally broken and needs work.
    """
    bin = gst.Bin("flv_demux")

    # Make elements.
    demux = gst.element_factory_make("flvdemux")

    # Link and add elements.
    bin.add(demux)
    def demux_callback(demux, new_pad):
        print new_pad
        if new_pad.get_name() in ("audio_00", "src"):
            bin.add_pad(new_pad)
    demux.connect("pad-added", demux_callback)

    bin.add_pad(gst.GhostPad("binsrc", demux.get_static_pad("sink")))

    return bin


def build_reencode_bin():
    """This bin will rip audio from video by reencoding it to MP3.

    This method is slow and low quality, but it will always work.  We keep it
    around here in case we need it again eventually, because it's really tricky
    to get right.
    """
    bin = gst.Bin("reencode")

    # Set up reencoder.
    decode = gst.element_factory_make("decodebin")
    ripaudio = gst.element_factory_make("audioconvert")
    encode = gst.element_factory_make("lamemp3enc")

    # Do crazy gstreamer linking.  Note that we have to link decodebin to
    # audioconvert from the context of a dynamic pad added callback, which is
    # pretty weird.
    bin.add(decode, ripaudio, encode)
    decode.connect("pad-added", lambda *args: decode.link(ripaudio))
    ripaudio.link(encode)

    make_bin_pads(bin, decode, encode)

    return bin


def rip_video_audio(video_file):
    init_gobject_mainloop()

    # Set up pipe.
    pipe = gst.Pipeline("sound")

    # Set up file source.
    src = gst.element_factory_make("filesrc")
    src.set_property("location", video_file)

    if video_file.endswith(".mp4"):
        audio_file = video_file[:-4] + ".m4a"
        bin = build_mp4_remux_bin()
    # TODO(rnk): Make this work for FLVs.  For now we just reencode.
    #elif video_file.endswith(".flv"):
        #bin = build_flv_demux_bin()
    else:
        audio_file = video_file + ".mp3"
        bin = build_reencode_bin()

    # Set up file sink.
    sink = gst.element_factory_make("filesink")
    sink.set_property("location", audio_file)

    # Link source, bin, and sink.
    pipe.add(src, bin, sink)
    src.link(bin)
    bin.link(sink)

    # Register the finished callback and start the reencoding.
    finished_event = threading.Event()
    bus = pipe.get_bus()
    bus.add_signal_watch()
    error_message = None
    def on_message(bus, message):
        t = message.type
        if t == gst.MESSAGE_EOS:
            finished_event.set()
        elif t == gst.MESSAGE_ERROR:
            logging.exception(message)
            error_message = str(message)
            finished_event.set()
    bus.connect("message", on_message)

    pipe.set_state(gst.STATE_PAUSED)
    pipe.set_state(gst.STATE_PLAYING)

    # Wait until the reencoding is done, and then return.  We use the timeout
    # plus the busy loop to be able to respond to KeyboardInterrupts.  Python
    # threading sucks.
    while not finished_event.is_set():
        finished_event.wait(timeout=120)
    pipe.set_state(gst.STATE_NULL)
    if error_message:
        raise youtubedl.PostProcessingError(error_message)
    return audio_file


class RipAudioPP(youtubedl.PostProcessor):

    def __init__(self):
        self.audio_file = None
        self.title = None
        self.uploader = None

    def run(self, info):
        self.audio_file = rip_video_audio(info['filepath'])
        # Replace the pluses with spaces, the most common thing we want.  The
        # title will suck anyway, there's nothing we can do.
        self.title = info['title'].replace('+', ' ')
        self.uploader = info['uploader']
        return info


class MyFileDownloader(youtubedl.FileDownloader):

    def report_progress(self, percent_str, data_len_str, speed_str, eta_str):
        # TODO(rnk): If anyone ever wants to implement a progress bar, do so
        # here.
        pass


def rip_video(url, path="."):
    """Download a video from a URL and convert it to an MP3."""
    # Information extractors
    youtube_ie = youtubedl.YoutubeIE()

    # File downloader
    outtmpl = os.path.join(path, u'%(stitle)s-%(id)s.%(ext)s')
    fd = MyFileDownloader({
        'usenetrc': False,
        'username': None,
        'password': None,
        'quiet': True,
        'forceurl': None,
        'forcetitle': None,
        'simulate': False,
        'format': '0',  # Means best quality possible.
        'outtmpl': outtmpl,
        'ignoreerrors': False,
        'ratelimit': None,
        'nooverwrites': False,
        'continuedl': False,
        })
    fd.add_info_extractor(youtube_ie)
    audio_pp = RipAudioPP()
    fd.add_post_processor(audio_pp)
    retcode = fd.download([url])
    assert retcode == 0
    return audio_pp


if __name__ == "__main__":
    #rip_video(sys.argv[1])
    rip_video_audio(sys.argv[1])
