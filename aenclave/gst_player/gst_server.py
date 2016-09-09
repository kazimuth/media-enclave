#!/usr/bin/env python

"""
The server that allows communication with a GstPlayer via Pyro.
"""

import gobject
gobject.threads_init()
import logging
import os
os.environ["DJANGO_SETTINGS_MODULE"] = "menclave.settings"
from menclave import settings

# Pyro needs this variable before we import it, so we add it to the environment
# like this.
os.environ["PYRO_STORAGE"] = "/tmp/"
os.environ["PYRO_STDLOGGING"] = "1"
os.environ["PYRO_TRACELEVEL"] = "2"

# Ignore warnings before importing Pyro; it uses deprecated modules.
import warnings
warnings.simplefilter("ignore")

import Pyro.core
import threading
from menclave.aenclave.gst_player import gst_backend
from django.core import management


class RemotePlayer(Pyro.core.ObjBase, gst_backend.GstPlayer):

    """
    A Pyro remote object that wraps a GstPlayer.
    """

    def __init__(self):
        # WTF(rnk): Pyro.core.ObjBase is an old-style class, so we can't use
        # super.
        gst_backend.GstPlayer.__init__(self)
        Pyro.core.ObjBase.__init__(self)


def main():
    # Setup the Pyro daemon.
    Pyro.core.initServer()
    daemon = Pyro.core.Daemon(port=settings.GST_PLAYER_PORT)
    # Setup Django.
    management.setup_environ(settings)
    # Create the player and register it with the Pyro name server.
    player = RemotePlayer()
    # TODO(rnk): Change the naming to make one remote object per channel.
    uri = daemon.connect(player, "gst_player")
    logging.info("The object URI: %s" % uri)
    # Run the event loop in another daemon thread.  Marking it as a daemon
    # allows us to respond to SIGTERM properly.
    event_thread = threading.Thread(target=gobject.MainLoop().run)
    event_thread.setDaemon(True)  # TODO(rnk): For 2.6+ switch to the below.
    #event_thread.daemon = True
    event_thread.start()
    # Run the Pyro request loop.
    try:
        daemon.requestLoop()
    finally:
        logging.info("exiting main thread.")
        daemon.shutdown()


if __name__ == "__main__":
    main()
