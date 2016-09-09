#!/usr/bin/env python

"""
The client that communicates with the gst_server via Pyro.
"""

import time
# Ignore warnings before importing Pyro; it uses deprecated modules.
import warnings
warnings.simplefilter("ignore")
import Pyro.core
import os
os.environ["DJANGO_SETTINGS_MODULE"] = "menclave.settings"
from menclave.aenclave.models import Song

class Object(object):

    def __init__(self, **kwargs):
        self.__dict__.update(kwargs)

def main():
    # Test some commands via Pyro.
    client = Pyro.core.getProxyForURI("PYROLOC://localhost:7890/gst_player")
    noise_dir = "/home/reid/menclave/media/aenclave/dequeue/"
    #songs = [Object(path=path) for path in [
        #r"aw_fuck_pawnch_edited.wav",
        #r"dalorted.mp3",
        #r"freshman.mp3",
        #r"go-back-to-west-campus.mp3",
        #r"i-just-hate-you-so-much.mp3",
        #r"set-yourself-on-fire.mp3",
        #r"that-is-a-disgusting-song.mp3",
        #r"the-good-times-are-over.mp3",
        #r"the-worst-song-i-ever-heard.mp3",
        #r"we-made-this-terrible-song.mp3",
        #r"women-can't-drive.mp3",
    #]]
    songs = Song.objects.in_bulk([1, 2, 3]).values()
    try:
        client.add_songs(songs[0:2])
        client.start()
        time.sleep(1)
        logging.debug("gst_client elapsed time %d" % client.get_elapsed_time())
        time.sleep(1)
        logging.debug("gst_client elapsed time %d" % client.get_elapsed_time())
        time.sleep(1)
        logging.debug("gst_client elapsed time %d" % client.get_elapsed_time())
    except Exception, e:
        logging.error("gst_client exception: %s" % ''.join(e.remote_stacktrace))
    #time.sleep(10)
    #logging.debug(client.get_status())
    #client.add_songs(songs[2:])
    #client.start()


if __name__ == "__main__":
    main()
