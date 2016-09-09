import os
from os.path import join

from django.core.management.base import NoArgsCommand
from optparse import make_option


from menclave.aenclave.models import Song, SONGS_ROOT
from menclave import settings

class Command(NoArgsCommand):
    """
    """

    option_list = NoArgsCommand.option_list + ( make_option('--verbose', action='store_true', dest='verbose', help='List orphans verbosely.'),)
    help = 'Checks through the Song database for orphaned files.'

    def handle_noargs(self, **options):
        verbose = options.get('verbose', False)
        
        orphans = 0
        total = 0

        SONGS_PATH = settings.MEDIA_ROOT + SONGS_ROOT
        for root,dirs,files in os.walk(SONGS_PATH):
            for f in files:
                filename = join(root,f).replace(settings.MEDIA_ROOT, '')

                total += 1
                try:
                    song = Song.objects.get(audio=filename)
                    if verbose:
                        print "Song #%d => %s" % (song.pk, filename)
                except Song.DoesNotExist, e:
                    orphans += 1
                    print "Orphan: %s" % (filename)
                
        print 'Done -- %d files orphaned of %d' % (orphans, total)
