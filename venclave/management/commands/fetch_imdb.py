#!/usr/bin/env python

"""
A Django management command to fetch the IMDB .list files.

Run this command before updating the IMDB metadata in the database.
"""

import os
import urllib
import subprocess

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from menclave.venclave import imdb


class Command(BaseCommand):

    """Fetches the IMDB .list files."""

    def handle(self, *args, **options):
        if args:
            assert len(args) == 1
            (imdb_path,) = args
        elif hasattr(settings, 'IMDB_PATH'):
            imdb_path = settings.IMDB_PATH
        else:
            raise CommandError("Unable to find path to video files.  Either "
                               "set IMDB_PATH in settings.py or pass it on "
                               "the command line.")
        # TODO(rnk): Fetch and apply diffs if the files already exist.
        paths = []
        for db_file in imdb.DB_FILES:
            url = imdb.DB_URL + db_file + '.gz'
            path = os.path.join(imdb_path, db_file) + '.gz'
            urllib.urlretrieve(url, path)
            paths.append(path)
        subprocess.check_call(['gunzip'] + paths)
