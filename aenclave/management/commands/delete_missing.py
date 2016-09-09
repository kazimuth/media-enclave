import os

from django.core.management.base import NoArgsCommand
from optparse import make_option

from menclave.aenclave.models import Song

class Command(NoArgsCommand):
    """
    """

    option_list = NoArgsCommand.option_list + ( make_option('--verbose', action='store_true', dest='verbose', help='Lists missing files verbosely.'),
                                                make_option('--delete', action='store_true', dest='delete', help='Really delete database records for missing files.'), 
                                                )
    help = 'Checks through the Song database for missing files.'

    def handle_noargs(self, **options):
        verbose = options.get('verbose', False)
        delete = options.get('delete', False)

        if delete:
            print "Actually going to delete the database entry of every missing file."
        else:
            print "Dry-run mode -- no database entries will be deleted."

        missing = 0
        total = 0
        for song in Song.objects.all():
            filename = song.audio.path

            total +=1
            if not os.path.exists(filename):
                print "Song #%d is missing. (%s)" % (song.pk, filename)
                missing += 1
                if delete:
                    song.delete()
            elif verbose:
                print "Song #%d is present. (%s)" % (song.pk, filename)
                
        print 'Done -- %d files missing of %d' % (missing, total)
