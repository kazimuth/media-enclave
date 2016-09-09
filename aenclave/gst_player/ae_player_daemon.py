#!/usr/bin/env python

"""
A simple daemonizer script using the python-daemon module.

This is useful on platforms that don't have start-stop-daemon, like Mac OS X,
but do have the daemon module.  We still have the init script so that we don't
introduce yet another dependency.
"""

import daemon
from menclave.aenclave.gst_player import gst_server


if __name__ == '__main__':
    with daemon.DaemonContext():
        gst_server.main()
