
import zipfile
import tempfile
import datetime
import os

from django.core.servers.basehttp import FileWrapper
from django.http import HttpResponse

from menclave.aenclave.utils import get_song_list

#-------------------------------- DL Requests --------------------------------#

def dl(request):
    """Serve songs to the user, either as a zip archive or a single file."""
    # Use REQUEST to allow GET and POST selections.
    songs = get_song_list(request.REQUEST)
    if not songs:
        # TODO(rnk): Better error handling.
        raise Exception("No ids were provided to dl.")
    elif len(songs) == 1:
        return send_song(songs[0])
    else:
        return send_songs(songs)

class StreamingHttpResponse(HttpResponse):

    """This class exists to bypass middleware that uses .content.

    See Django bug #6027: http://code.djangoproject.com/ticket/6027

    We override content to be a no-op, so that GzipMiddleware doesn't exhaust
    the FileWrapper generator, which reads the file incrementally.
    """

    def _get_content(self):
        return ""

    def _set_content(self, value):
        pass

    content = property(_get_content, _set_content)

def send_song(song):
    """Return an HttpResponse that will serve an MP3 from disk.

    This happens without reading the whole MP3 in as a string.
    """
    fd = file(song.audio.path)
    wrapper = FileWrapper(fd)
    response = StreamingHttpResponse(wrapper, content_type='audio/mpeg')
    # BTW nice_filename is guaranteed not to have any backslashes or quotes in
    #     it, so we don't need to escape anything.
    response['Content-Disposition'] = ('attachment; filename="%s"' %
                                       song.nice_filename())
    response['Content-Length'] = os.path.getsize(song.audio.path)
    return response

def send_songs(songs):
    """Serve a zip archive of the chosen songs."""
    # Make an archive name with a timestamp of the form YYYY-MM-DD_HH-MM-SS.
    timestamp = '%i-%i-%i_%i-%i-%i' % datetime.datetime.today().timetuple()[:6]
    archive_name = 'nr_dl_%s.zip' % timestamp
    filenames = []
    for song in songs:
        # WTF Use str() here because the filename apparently *cannot* be a
        #     unicode string, or zipfile flips out.
        filenames.append((song.audio.path, str(song.nice_filename())))
    return render_zip(archive_name, filenames)

def render_zip(archive_name, filenames):
    """Serve a zip archive containing all of the named files.

    archive_name -- The name to give the zip archive when it is served.
    filenames -- A list of tuples of the form (path, newname).

    This creates a temporary zip archive on disk which is cleaned up after its
    references are garbage collected.

    TODO(rnk): What would be really hot (lapnap does this) would be to find a
               way to write the zip archive to the HTTP stream instead of a
               temp file.  This would prevent us from having a usable download
               progress bar, but the download would start right away.
    """
    # Make a temporary zip archive.
    tmp_file = tempfile.TemporaryFile(mode='w+b')
    # Use ZIP_STORED to disable compression because mp3s are already well
    # compressed.
    archive = zipfile.ZipFile(tmp_file, 'w', zipfile.ZIP_STORED)
    # Write songs to zip archive.
    for (path, newname) in filenames:
        archive.write(path, newname)
    archive.close()
    filesize = tmp_file.tell()
    # Serve zip archive.
    wrapper = FileWrapper(tmp_file)
    # Using StreamingHttpResponse tries to avoid gzip middleware from fucking
    # everything up.
    response = StreamingHttpResponse(wrapper, content_type='application/zip')
    response['Content-Disposition'] = 'attachment; filename=%s' % archive_name
    response['Content-Length'] = filesize
    tmp_file.seek(0)
    return response
