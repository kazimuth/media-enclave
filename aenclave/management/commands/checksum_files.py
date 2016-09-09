import os

from django.core.management.base import NoArgsCommand
from optparse import make_option

from menclave.aenclave.models import Song
from menclave.aenclave import processing

class Command(NoArgsCommand):
    """
    """

    option_list = NoArgsCommand.option_list + ( make_option('--verbose', action='store_true', dest='verbose', help='Lists each file processed.'),)
    help = 'Re-checksums every file in the database.'

    def handle_noargs(self, **options):
        verbose = options.get('verbose', False)
        songs = Song.objects.all();
        total_songs = len(songs)
        log_every_n = 1000
        last_log = 0
        done = 0
        for song in songs:
            filename = song.audio.path
            processing.annotate_checksum(song)
            song.save()
            if verbose:
                print "Checksummed song #%d. (%s)" % (song.pk, song.filechecksum)
            done += 1
            if last_log == 0:
                print "Processed %d/%d" % (done, total_songs)
                last_log = log_every_n
            last_log -= 1
        print 'Done'
