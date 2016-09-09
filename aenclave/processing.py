from __future__ import with_statement

import hashlib
import logging

from models import Song
from mutagen.mp3 import MP3
from mutagen.easyid3 import EasyID3
from mutagen.mp4 import MP4
from math import ceil as ceiling
from menclave.settings import SUPPORTED_AUDIO

class BadContent(Exception):
    def __init__(self, extension):
        self.extension = extension

def md5sum(filename):
    """Takes the md5sum of a given file."""
    m = hashlib.md5()
    with open(filename, "r") as f:
        bytes = f.read(4096)
        while bytes != "":
            m.update(bytes)
            bytes = f.read(4096)
    return m.hexdigest()

def valid_song(name):
    """
    Tests whether a song is supported or not based on extension
    and the configuration settings in menclave.settings
    """
    ext = name.lower()[len(name)-3:]
    return ext in SUPPORTED_AUDIO

def annotate_metadata(song):
    path = song.audio.path
    audio = None
    info = {}
    ext = path.lower()[len(path)-3:]

    # Mutagen doesn't like unicode 
    path_latin1 = path.encode('latin1')

    # TODO(XXX) Once mutagen 1.17 makes it everywhere we can do away
    # with this bother with extensions and figuring out the file
    # format. We can use mutagen.File(filename) and it will hand us
    # the correct Mutagen tag parse for it. We could do this today,
    # but it's awkward because you can't specify you want EasyTags,
    # it'll hand you the raw MP3 tags, which are butts. 1.17 is much
    # much nicer, but not yet released.

    if ext == "mp3":
        # Now, open up the MP3 file and save the tag data into the database.
        try:
            audio = MP3(path_latin1, ID3=EasyID3)
        except Exception, e:
            logging.exception(e.message)
            audio = {}
        try: info['title'] = audio['title'][0]
        except (KeyError, IndexError): info['title'] = 'Unnamed Song'
        try: info['album'] = audio['album'][0]
        except (KeyError, IndexError): info['album'] = ''
        try: info['artist'] = audio['artist'][0]
        except (KeyError, IndexError): info['artist'] = ''
        try: info['track'] = int(audio['tracknumber'][0].split('/')[0])
        except (KeyError, IndexError, ValueError): info['track'] = 0
        try: info['time'] = int(ceiling(audio.info.length))
        except AttributeError:
            info['time'] = 0

    # omfg: iTunes tags... hate. hate. hate.
    # http://atomicparsley.sourceforge.net/mpeg-4files.html
    elif ext == "m4a":
        # Now, open up the MP3 file and save the tag data into the database.
        try:
            audio = MP4(path_latin1)
        except Exception, e:
            logging.exception(e.message)
            audio = {}
        try: 
            info['title'] = audio['\xa9nam'][0]
        except (KeyError, IndexError): 
            try: 
                info['title'] = audio['\xa9NAM'][0]
            except (KeyError, IndexError):
                info['title'] = 'Unnamed Song'
        try: 
            info['album'] = audio['\xa9alb'][0]
        except (KeyError, IndexError):
            try: 
                info['album'] = audio['\xa9ALB'][0]
            except (KeyError, IndexError): 
                info['album'] = ''
        try: 
            info['artist'] = audio['\xa9art'][0]
        except (KeyError, IndexError): 
            try: 
                info['artist'] = audio['\xa9ART'][0]
            except (KeyError, IndexError):
                info['artist'] = ''
        try: info['track'] = int(audio['trkn'][0][0])
        except (KeyError, IndexError, ValueError, TypeError): 
            info['track'] = 0
        try: info['time'] = int(ceiling(audio.info.length))
        except AttributeError:
            info['time'] = 0
    else:
        raise BadContent(ext)

    song.title = info['title']
    song.album = info['album']
    song.artist = info['artist']
    song.track = info['track']
    song.time = info['time']

    if hasattr(audio, 'info') and not hasattr(audio.info, 'sketchy'):
        # Mutagen only checks mp3s for sketchiness
        audio.info.sketchy = False

    if audio == {}:
        audio = None

    return audio

def annotate_checksum(song):
    try:
        song.filechecksum = md5sum(song.audio.path)
    except Exception, e: 
        # This happens if the file doesn't exist, or some such.
        song.filechecksum = ""

def process_song(name, content):
    """
    Processes a song upload: saving it and reading the meta information
    returns the song object and mutagen audio object, or None if it couldn't
    parse the file.
    """

    if not valid_song(name):
        raise BadContent(name)

    # Save the song into the database -- we'll fix the tags in a moment.
    song = Song(track=0, time=0)
    song.audio.save(name, content)
    audio = annotate_metadata(song)
    annotate_checksum(song)
    song.save()

    return (song, audio)
