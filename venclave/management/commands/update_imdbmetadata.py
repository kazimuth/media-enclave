#!/usr/bin/env python

"""
A Django management command to load IMDB metadata into the database.

Run this command after downloading new IMDB metadata.
"""

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from menclave.venclave import imdb
from menclave.venclave import models


class Command(BaseCommand):

    """Updates and creates IMDBMetadata nodes."""

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

        # The number of ContentNodes should be much smaller than all the movies
        # in IMDB, so we throw these in a dict and stream over IMDB instead of
        # the other way around.
        videos = models.ContentNode.objects.all()
        self.title_to_video = dict((v.title, v) for v in videos)
        self.title_to_imdb = {}
        self.parser = imdb.ImdbParser(imdb_path)

        self.create_imdbmetadata()
        self.add_plots()
        self.add_times()
        self.add_ratings()
        self.add_genres()
        self.add_directors()
        self.add_actors()
        self.save_imdbmetadata()

    def create_imdbmetadata(self):
        print 'create_imdbmetadata...'
        for title in self.parser.generate_movie_titles():
            # TODO(rnk): Do something to try to guess which title is best, for
            # example using find_content_title.
            if title in self.title_to_video:
                (meta, _) = models.IMDBMetadata.objects.get_or_create(
                        imdb_canonical_title=title)
                info = self.parser.parse_title(title)
                date = info.get('date', None)
                year = info.get('year', None)
                if date:
                    meta.release_date = date
                    meta.release_year = date.year
                elif year:
                    meta.release_year = year
                meta.genres.clear()
                meta.actors.clear()
                meta.directors.clear()
                self.title_to_imdb[title] = meta
        print 'finished create_imdbmetadata.'

    def _metadata_adder(gen_meth_name):
        def decorator(func):
            def adder(self):
                print "%s..." % func.__name__
                generator = getattr(self.parser, gen_meth_name)
                for tup in generator():
                    title = tup[0]
                    args = tup[1:]
                    meta = self.title_to_imdb.get(title, None)
                    if meta:
                        func(self, meta, *args)
                print "finished %s." % func.__name__
            return adder
        return decorator

    @_metadata_adder('generate_plots')
    def add_plots(self, meta, plots):
        if plots:
            # TODO(rnk): Come up with a better way to pick the plot summary.
            # Perhaps pick the one with the best target size?  Not too long
            # or short?
            (author, summary) = plots[0]
            meta.plot_summary = summary

    @_metadata_adder('generate_running_times')
    def add_times(self, meta, time):
        meta.length = time

    @_metadata_adder('generate_ratings')
    def add_ratings(self, meta, rating):
        meta.rating = float(rating) / 10 / 2

    @_metadata_adder('generate_genres')
    def add_genres(self, meta, genre):
        (gnode, _) = models.Genre.objects.get_or_create(name=genre)
        meta.genres.add(gnode)

    @_metadata_adder('generate_directors')
    def add_directors(self, meta, director):
        (dnode, _) = models.Director.objects.get_or_create(name=director)
        meta.directors.add(dnode)

    @_metadata_adder('generate_actors')
    def add_actors(self, meta, actor, sex, role, bill_pos):
        (actor_node, _) = models.Actor.objects.get_or_create(name=actor)
        actor_node.sex = sex
        actor_node.save()
        (role_node, _) = models.Role.objects.get_or_create(actor=actor_node,
                                                           imdb=meta)
        role_node.role = role
        role_node.bill_pos = bill_pos
        role_node.save()

    def save_imdbmetadata(self):
        print 'save_imdbmetadata...'
        for (title, node) in self.title_to_video.iteritems():
            if title not in self.title_to_imdb:
                continue
            meta = self.title_to_imdb[title]
            meta.save()
            node.metadata.imdb = meta
            node.metadata.save()
        print 'finished save_imdbmetadata.'
