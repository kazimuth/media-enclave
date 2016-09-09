#!/usr/bin/env python

"""
A Django management command to look for new video files.

Run this command when there are new video files to add to the database.
"""

import logging
import os

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings
from django.contrib.auth.models import User

from menclave.venclave.models import (ContentNode, ContentMetadata, KIND_MOVIE,
                                      KIND_TV, KIND_UNKNOWN, KIND_SERIES,
                                      KIND_SEASON)


VIDEO_EXTENSIONS = ('avi', 'mpeg', 'mpg', 'mov', 'mkv', 'iso')


def listdir(dirpath):
    """Wraps os.listdir and prepends dirpath to the results."""
    for path in os.listdir(dirpath):
        yield os.path.join(dirpath, path)


class Command(BaseCommand):

    """Updates and creates ContentNodes."""

    def handle(self, *args, **options):
        if args:
            assert len(args) == 1
            (video_path,) = args
        elif hasattr(settings, 'VIDEO_PATH'):
            video_path = settings.VIDEO_PATH
        else:
            raise CommandError("Unable to find path to video files.  Either "
                               "set VIDEO_PATH in settings.py or pass it on "
                               "the command line.")
        # TODO(rnk): Maybe have a default user setting and an option to
        # override?
        self.owner = User.objects.all()[:1][0]
        self.nodes = set()
        for path in listdir(video_path):
            if path.endswith("Movies"):
                self.do_movies(path)
            elif path.endswith("TV"):
                self.do_series(path)
            else:
                self.do_unknown(path)
        # Clear any ContentNodes that we didn't find files for.
        for node in ContentNode.objects.all():
            if node not in self.nodes:
                node.delete()

    def do_movies(self, movies_path):
        for movdir in listdir(movies_path):
            movdir = os.path.join(movies_path, movdir)
            node = self.make_content_node(movdir, KIND_MOVIE)
            node.save()

    def do_series(self, tv_path):
        for series_dir in listdir(tv_path):
            if not os.path.isdir(series_dir):
                print os.path.isdir(series_dir), os.path.islink(series_dir)
                logging.info('Skipping unexpected file %r.', series_dir)
                continue
            series_node = self.make_content_node(series_dir, KIND_SERIES)
            series_node.save()
            found_dir = False
            for season_dir in listdir(series_dir):
                if not os.path.isdir(season_dir):
                    # Only log if we have reason to believe this is a problem.
                    if found_dir:
                        logging.info('Skipping unexpected file %r.', season_dir)
                    continue
                found_dir = True
                self.do_season(season_dir, series_node)
            if not found_dir:
                # Try doing a single season.
                self.do_season(series_dir, series_node)

    def do_season(self, season_dir, series_node):
        season_node = self.make_content_node(season_dir, KIND_SEASON)
        season_node.parent = series_node
        season_node.save()
        for ep_file in listdir(season_dir):
            if not os.path.isfile(ep_file):
                logging.info('Skipping unexpected dir %r.', ep_file)
                continue
            if not any(ep_file.endswith(ext) for ext in VIDEO_EXTENSIONS):
                continue
            ep_node = self.make_content_node(ep_file, KIND_TV)
            ep_node.parent = season_node
            ep_node.save()

    def do_unknown(self, path):
        for (root, dirs, files) in os.walk(path):
            # Only create nodes for leaf dirs, ie dirs that contain no other
            # dirs.
            if dirs: continue
            node = self.make_content_node(root, KIND_UNKNOWN)
            node.save()

    def make_content_node(self, path, kind):
        title = os.path.basename(path)
        try:
            node = ContentNode.objects.get(path=path)
        except ContentNode.DoesNotExist:
            node = ContentNode(path=path)
        node.title = title
        node.owner = self.owner
        node.kind = kind
        if not node.metadata:
            meta = ContentMetadata()
            meta.save()
            node.metadata = meta
        node.save()
        self.nodes.add(node)
        print 'created node: %r; path %r' % (node, node.path)
        return node
