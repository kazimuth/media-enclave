# Monkey-patch before we import the scrapers, so they don't import stale stuff.
import eventlet
#eventlet.monkey_patch()

from common import *
from imdb import *
from rottentomatoes import *
from metacritic import *
from nyt import *


class FakePool(object):

    """Like eventlet.GreenPool, but without any green thread parallelism."""

    def spawn(self, func, *args, **kwargs):
        func(*args, **kwargs)


def update_contentnodes_metadata(nodes, force=False, force_imdb=False,
                                 force_rt=False, force_mc=False,
                                 force_nyt=False):
    sources = [
        (force_imdb, 'metadata__imdb__imdb_id',          update_imdb_metadata),
        (force_rt,   'metadata__rotten_tomatoes__rt_id', update_rottentomatoes_metadata),
        (force_mc,   'metadata__metacritic__mc_id',      update_metacritic_metadata),
        (force_nyt,  'metadata__nyt_review',             update_nyt_metadata),
        ]

    #pool = eventlet.GreenPool(size=6)
    pool = FakePool()
    for (force_source, filter_attr, update_source_metadata) in sources:
        # If we didn't force updating of this source (or all sources), only
        # update those that don't have metadata from this source.
        if not (force or force_source):
            source_nodes = nodes.filter(**{filter_attr: None})
        else:
            source_nodes = nodes

        for node in source_nodes:
            pool.spawn(update_source_metadata, node,
                       force=(force or force_source))


def update_metadata(node, force=False, force_imdb=False, force_rt=False,
                    force_mc=False, force_nyt=False):
    update_imdb_metadata(node, force=force or force_imdb)
    update_rottentomatoes_metadata(node, force=force or force_rt)
    update_metacritic_metadata(node, force=force or force_mc)
    update_nyt_metadata(node, force=force or force_nyt)
