#!/usr/bin/env python

"""
A Django management command to update metadata for content in the database.

Run this command periodically to lookup metadata for new content and update
existing metadata.
"""
import logging
from optparse import make_option

from django.core.management.base import BaseCommand, CommandError
from django.conf import settings

from menclave.venclave import models
from menclave.venclave import metadata

class Command(BaseCommand):
    """Updates metadata for ContentNodes"""

    option_list = BaseCommand.option_list + (
        make_option('--force',
            action='store_true',
            dest='force',
            default=False,
            help='Force update of all metadata sources.'),
        make_option('--force-imdb',
            action='store_true',
            dest='force_imdb',
            default=False,
            help='Force update of IMDb metadata.'),
        make_option('--force-rottentomatoes',
            action='store_true',
            dest='force_rt',
            default=False,
            help='Force update of RottenTomatoes metadata.'),
        make_option('--force-metacritic',
            action='store_true',
            dest='force_mc',
            default=False,
            help='Force update of metacritic metadata.'),
        make_option('--force-nyt',
            action='store_true',
            dest='force_nyt',
            default=False,
            help='Force update of NYT metadata.'),
        make_option('--clean',
            action='store_true',
            dest='clean',
            default=False,
            help='Clean up unreferenced metadata.'),
        )

    def handle(self, *args, **options):
        # For now, only deal w/ movies.
        movies = models.ContentNode.objects.filter(kind=models.KIND_MOVIE)

        metadata.update_contentnodes_metadata(movies,
                                              force=options['force'],
                                              force_imdb=options['force_imdb'],
                                              force_rt=options['force_rt'],
                                              force_mc=options['force_mc'],
                                              force_nyt=options['force_nyt'])

        # Clean up any un-referenced metadata nodes.
        if options['clean']:
            logging.info("Deleting unreferenced metadata records...")
            def delete_ids_not_in_set(model_cls, ids):
                # This clever SQL doesn't work with large datasets and SQLite.
                # It doesn't like long lists of ids in its queries.
                #q = model_cls.objects.exclude(id__in=metadata_ids)
                #logging.info("Deleting %d %s models.", q.count(),
                             #model_cls.__name__)
                #q.delete()

                ids = set(ids)
                to_delete = [model for model in model_cls.objects.all()
                             if model.id not in ids]
                logging.info("Deleting %d %s models.", len(to_delete),
                             model_cls.__name__)
                for model in to_delete:
                    model.delete()


            live_nodes = models.ContentNode.objects.all()

            metadata_ids = [d['metadata_id'] for d in
                            live_nodes.values('metadata_id')]
            delete_ids_not_in_set(models.ContentMetadata, metadata_ids)
            live_metadata = models.ContentMetadata.objects.all()

            imdb_ids = [m.imdb_id for m in live_metadata]
            delete_ids_not_in_set(models.IMDBMetadata, imdb_ids)

            rt_ids = [m.rotten_tomatoes_id for m in live_metadata]
            delete_ids_not_in_set(models.RottenTomatoesMetadata, rt_ids)

            mc_ids = [m.metacritic_id for m in live_metadata]
            delete_ids_not_in_set(models.MetaCriticMetadata, mc_ids)
