import os

from django.core.management.base import NoArgsCommand
from optparse import make_option

from menclave.aenclave.models import Song

class Command(NoArgsCommand):
    """
    """

    option_list = NoArgsCommand.option_list + ( make_option('--verbose', action='store_true', dest='verbose', help='Lists missing files verbosely.'),)
    help = 'Checks through the Song database for missing files.'

    def handle_noargs(self, **options):
        verbose = options.get('verbose', False)
        missing = 0
        total = 0
        for song in Song.objects.all():
            filename = song.audio.path

            total +=1
            if not os.path.exists(filename):
                print "Song #%d is missing. (%s)" % (song.pk, filename)
                missing += 1
            elif verbose:
                print "Song #%d is present. (%s)" % (song.pk, filename)
                
        print 'Done -- %d files missing of %d' % (missing, total)
