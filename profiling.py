#!/usr/bin/env python

"""Tool based on http://code.djangoproject.com/wiki/ProfilingDjango .

To profile a view method, do something like this:

from menclave.profiling import profile
...
@profile('exhibit.prof')
def exhibit_content(request):
    ...

And reload the page that calls the view.  You should now have a
exhibit-NNN.prof file in your current directory.  You can run this script on it
to get some statistics.  You can modify the main method to play with them as
you like.

$ ./profiling.py exhibt-NNN.prof
         1160625 function calls (683149 primitive calls) in 1.782 CPU seconds

   Ordered by: internal time, call count
   List reduced from 264 to 20 due to restriction <20>

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
440658/118380    0.294    0.000    0.579    0.000 encoder.py:284(_iterencode)
     5135    0.198    0.000    0.307    0.000 base.py:272(__init__)

...

"""

import hotshot
import hotshot.stats
import os
import sys
import time

try:
    from django.conf import settings
    PROFILE_LOG_BASE = settings.PROFILE_LOG_BASE
except:
    PROFILE_LOG_BASE = "."


def instrument_model_init(func):
    """Counts calls to the base model __init__ method by class.

    Decorate your relevant view with this method to see which models are
    getting built the most.
    """
    from django.db.models import base
    def new_func(*args, **kwargs):
        inits = {}
        old_init = base.Model.__dict__['__init__']

        def new_init(self, *args, **kwargs):
            """Add one to the inits dict for this instance's class."""
            cls = self.__class__
            key = cls.__module__ + '.' + cls.__name__
            inits.setdefault(key, 0)
            inits[key] += 1
            return old_init(self, *args, **kwargs)

        base.Model.__init__ = new_init
        try:
            ret = func(*args, **kwargs)
        finally:
            base.Model.__init__ = old_init

        print 'Django models initialized sorted most first:'
        print '\n'.join('%s %d' % (k.ljust(60), v) for (k, v) in
                        sorted(inits.items(), key=lambda t: -t[1]))

        return ret
    return new_func


def profile(log_file):
    """Profile some callable.

    This decorator uses the hotshot profiler to profile some callable (like a
    view function or method) and dumps the profile data somewhere sensible for
    later processing and examination.

    Supposedly hotshot is deprecated and we should all be using cProfile, but I
    haven't been able to figure out how to use cProfile with a callable and not
    some exec'able string from which I cannot get a return value.  This makes
    it difficult to drop as a decorator on some Django view.

    This decorator takes one argument, the profile log name. If it's a relative
    path, it places it under the PROFILE_LOG_BASE. It also inserts a time stamp
    into the file name, such that 'my_view.prof' become
    'my_view-20100211T170321.prof', where the time stamp is in UTC. This makes
    it easy to run and compare multiple trials.

    """

    if not os.path.isabs(log_file):
        log_file = os.path.join(PROFILE_LOG_BASE, log_file)

    def decorator(func):
        def new_func(*args, **kwargs):
            # Add a timestamp to the profile output when the callable
            # is actually called.
            (base, ext) = os.path.splitext(log_file)
            base = base + "-" + time.strftime("%Y%m%dT%H%M%S", time.gmtime())
            final_log_file = base + ext

            prof = hotshot.Profile(final_log_file)
            try:
                ret = prof.runcall(func, *args, **kwargs)
            finally:
                prof.close()
            return ret

        return new_func
    return decorator


def main(argv):
    stats = hotshot.stats.load(sys.argv[1])
    #stats.strip_dirs()
    stats.sort_stats('time', 'calls')
    stats.print_stats(20)


if __name__ == '__main__':
    main(sys.argv)
