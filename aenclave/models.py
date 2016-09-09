# menclave/aenclave/models.py

from calendar import timegm
import datetime
from math import exp
import os
import re

from django.db import models
from django.db import transaction
from django.contrib.auth.models import Group, User

#================================= UTILITIES =================================#

def datetime_string(dt):
    date, today = dt.date(), datetime.date.today()
    if date == today: return dt.strftime('Today %H:%M:%S')
    elif date == today - datetime.timedelta(1):
        return dt.strftime('Yesterday %H:%M:%S')
    else: return dt.strftime('%d %b %Y %H:%M:%S')

#================================== MODELS ===================================#

class VisibleManager(models.Manager):

    """VisibleManager -- manager for getting only visible songs"""

    def get_query_set(self):
        return super(VisibleManager, self).get_query_set().filter(visible=True)

#-----------------------------------------------------------------------------#

SONGS_ROOT = 'aenclave/songs'
SONG_AUDIO_UPLOAD_TO = os.path.join(SONGS_ROOT, '%Y/%m/%d/')

class Song(models.Model):

    """The database model for music files."""

    def __unicode__(self): return self.title

    #--------------------------------- Title ---------------------------------#

    title = models.CharField(max_length=255, db_index=True)

    #--------------------------------- Album ---------------------------------#

    album = models.CharField(max_length=255, db_index=True)

    #-------------------------------- Artist ---------------------------------#

    artist = models.CharField(max_length=255, db_index=True)

    #--------------------------------- Track ---------------------------------#

    track = models.PositiveSmallIntegerField()
    def track_string(self):
        if self.track == 0: return ''
        else: return str(self.track)
    track_string.short_description = 'track'

    #--------------------------------- Time ----------------------------------#

    time = models.PositiveIntegerField(help_text="The duration of the song,"
                                       " in seconds.")
    def time_string(self):
        string = str(datetime.timedelta(0, self.time))
        if self.time < 600: return string[3:]
        elif self.time < 3600: return string[2:]
        else: return string
    time_string.short_description = 'time'

    #------------------------------ Date Added -------------------------------#

    # Switch the following commented lines to run the migration script so that
    # we can backdate the dates added.
    date_added = models.DateTimeField(auto_now_add=True, editable=False)
    #date_added = models.DateTimeField(auto_now_add=False, editable=False)
    def date_added_string(self): return datetime_string(self.date_added)
    date_added_string.short_description = 'date added'

    #------------------------------ Last Queued ------------------------------#

    # This property is useful to have in conjunction with the "is_recent" filter
    # to style recently queued songs as purple or "visited".

    last_queued = models.DateTimeField(default=None, blank=True, null=True,
                                       editable=False)
    def last_queued_string(self): return datetime_string(self.last_queued)
    last_queued_string.short_description = 'last queued'

    #------------------------------ Last Played ------------------------------#

    last_played = models.DateTimeField(default=None, blank=True, null=True,
                                       editable=False)
    def last_played_string(self): return datetime_string(self.last_played)
    last_played_string.short_description = 'last played'

    #-------------------------------- Counts ---------------------------------#

    play_count = models.PositiveIntegerField(default=0, editable=False)

    skip_count = models.PositiveIntegerField(default=0, editable=False)

    #------------------------------ Audio Path -------------------------------#

    audio = models.FileField(max_length=255, upload_to=SONG_AUDIO_UPLOAD_TO)

    def nice_filename(self):
        """Make a filename of the form 'artist - album - track - title.mp3'."""
        components = (self.artist, self.album, '%02d' % self.track, self.title)
        nice_filename = ' - '.join(components) + '.mp3'
        nice_filename = re.sub(r'[^a-zA-Z0-9_.,\- ]', '', nice_filename)
        return nice_filename

    #------------------------------- Album Art -------------------------------#

    album_art = models.ImageField(upload_to='aenclave/songs/%Y/%m/%d/',
                                  blank=True, null=True)

    #--------------------------------- Score ---------------------------------#

    score = models.PositiveIntegerField(default=0, editable=False)
    def adjusted_score(self):
        if self.last_played is None: return 0
        delta = datetime.datetime.now() - self.last_played
        # 1.1574074074074073e-05 == 1.0 / (60 * 60 * 24)
        days = delta.days + delta.seconds * 1.1574074074074073e-05
        return int(self.score * exp(-0.05 * days))
    adjusted_score.short_description = 'score'

    #-------------------------------- Visible --------------------------------#

    visible = models.BooleanField(default=True, help_text="Non-visible songs"
                                  " do not appear in search results.")

    #----------------------------- File Checksum -----------------------------#

    filechecksum = models.TextField(help_text="A checksum for the file.")

    #------------------------------ Other Stuff ------------------------------#

    @staticmethod
    def annotate_favorited(songs, user):
        """Add a boolean attr for if the song is a favorite of the user."""
        if user.is_authenticated():
            pl = Playlist.get_favorites(user)
            if pl:
                favs = set(song.pk for song in pl.songs.all())
                for song in songs:
                    if song.pk in favs:
                        song.favorited = True
        return songs

    class Meta:
        get_latest_by = 'date_added'
        ordering = ('artist', 'album', 'track')
        permissions = ( ('can_queue', 'Can Queue'),
                        ('can_control', 'Can Control Playback'),
                        ('request_delete_song', 'Can Request Delete'))

    @models.permalink
    def get_absolute_url(self):
        return ('aenclave-song', (str(self.id),))

    def queue_touch(self):
        self.last_queued = datetime.datetime.now()
        self.save()

    def play_touch(self):
        self.last_played = datetime.datetime.now()
        self.score = self.adjusted_score() + 100
        self.play_count += 1
        self.save()

    def skip_touch(self):
        self.skip_count += 1
        self.save()

    objects = models.Manager()
    visibles = VisibleManager()

#-----------------------------------------------------------------------------#

class Playlist(models.Model):

    """The database model for users' playlists."""

    def __unicode__(self): return self.name

    #-------------------------------- Fields ---------------------------------#

    name = models.CharField(max_length=255)

    owner = models.ForeignKey(User)

    group = models.ForeignKey(Group, blank=True, null=True)

    songs = models.ManyToManyField(Song, blank=True, through='PlaylistEntry')

    def _append_songs(self, songs, start_pos):
        """A helper for append_songs and set_songs.

        Note that the caller should open a transaction before calling this
        helper because we make many queries and they should be atomic.
        """
        index = start_pos
        for song in songs:
            try:
                entry = PlaylistEntry(playlist=self, song=song, position=index)
                entry.save()
                index += 1
            except Exception, e:
                # Most likely the song is already in this playlist. Ignore the
                # exception, and use the index on the next song since it won't
                # be incremented.
                pass

    @transaction.commit_on_success
    def append_songs(self, songs):
        """Append songs to the playlist without erasing existing ones."""
        entries = PlaylistEntry.objects.filter(playlist=self)
        last_entries = entries.order_by('position').reverse()[:1]
        start_pos = 0
        for entry in last_entries:
            start_pos = entry.position + 1
        self._append_songs(songs, start_pos)

    @transaction.commit_on_success
    def set_songs(self, songs):
        """Clear the playlist and replace it with these songs in this order."""
        self.songs.clear()
        self._append_songs(songs, 0)

    last_modified = models.DateTimeField(auto_now=True, editable=False)
    def last_modified_string(self): return datetime_string(self.last_modified)
    last_modified_string.short_description = 'Last modified'

    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    def date_created_string(self): return datetime_string(self.date_created)
    date_created_string.short_description = 'Date created'

    #------------------------------ Other Stuff ------------------------------#

    class Meta:
        get_latest_by = 'last_modified'
        ordering = ('owner', 'name')
        unique_together = (('name', 'owner'),)

    @models.permalink
    def get_absolute_url(self):
        return ('aenclave-playlist', (str(self.id),))

    def can_cede(self, user):
        if user.is_staff:
            return True
        return (user.id == self.owner_id)

    def can_edit(self, user):
        if user.is_staff:
            return True
        if self.group_id is None:
            return (user.id == self.owner_id)
        try:
            self.group.user_set.get(id=user.id)
        except User.DoesNotExist:
            return (user == self.owner)
        else: return True

    @staticmethod
    def get_favorites(user, create=False):
        """Return a user's favorites playlist or None, or create it."""
        errmsg = "User must be authenticated to have favorites."
        assert user.is_authenticated(), errmsg
        pl_name = "%s's favorites" % user.username
        try:
            pl = Playlist.objects.get(name=pl_name, owner=user)
        except Playlist.DoesNotExist:
            if create:
                pl = Playlist(name=pl_name, owner=user)
                pl.save()
            else:
                pl = None
        return pl

#-----------------------------------------------------------------------------#

class PlaylistEntry(models.Model):

    """The database model that links playlists to songs and orders them."""

    playlist = models.ForeignKey(Playlist)

    song = models.ForeignKey(Song)

    position = models.IntegerField()

    class Meta:
        ordering = ('playlist', 'position', 'song')

#-----------------------------------------------------------------------------#

class Channel(models.Model):

    """The database model of an audio output channel."""

    def __unicode__(self): return self.name

    #-------------------------------- Fields ---------------------------------#

    # For channels, we want the id to be editable, because the channel with
    # id=1 is the default channel.
    id = models.PositiveSmallIntegerField('ID', primary_key=True, help_text=
                                          "The channel with ID=1 will be the"
                                          " default channel.")

    name = models.CharField(max_length=32, unique=True)

    last_touched = models.DateTimeField(auto_now=True, editable=False)
    def last_touched_timestamp(self):
        return timegm(self.last_touched.timetuple())

    #------------------------------ Other Stuff ------------------------------#

    class Meta:
        get_latest_by = 'last_touched'
        ordering = ('id',)

    @models.permalink
    def get_absolute_url(self):
        return ('aenclave-channel', (str(self.id),))

    @classmethod
    def default(cls): return cls.objects.get(pk=1)

    def touch(self):
        self.save()  # `self.last_touched` will auto-update.

    def controller(self):
        # TODO(rnk): This import goes here to avoid circularity.  We should
        # avoid this.
        from menclave.aenclave.control import Controller
        return Controller(self)

#---------------------------- For 6.867 --------------------------------

class PlayHistory(models.Model):

    song = models.ForeignKey(Song)
    queued_time = models.DateTimeField(auto_now_add=True, editable=False)

class Cluster(models.Model):

    weight = models.FloatField(editable=True)
    songs = models.ManyToManyField(Song)

# just a count of recommendation songs that were selected for queueing.
class GoodRecs(models.Model):

    good_recs = models.IntegerField(editable=False)

# just a count of recommendation songs that were reported as bad.
class BadRecs(models.Model):

    bad_recs = models.IntegerField(editable=False)

#=============================================================================#
