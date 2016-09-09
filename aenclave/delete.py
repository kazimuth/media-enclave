import logging
import os
import shutil

from django.http import Http404
from django.conf import settings
from django.core.mail import mail_admins
from django.core.urlresolvers import reverse
from django.template import RequestContext

from menclave.login import permission_required
from menclave.aenclave.utils import get_song_list
from menclave.aenclave.html import render_html_template
from menclave.log.util import enable_logging

def delete_songs_by_policy(songs):
    for song in songs:
        try:
            path = song.audio.path
            # Set audio to None so that Django does not automatically
            # delete the file.
            song.audio = None
            logging.info("Deleting %s" % song)
            if settings.ACTUALLY_DELETE_FILES:
                logging.info("Actually deleting file %s" % path)
                os.remove(path)
            elif settings.DELETED_FILES_DIRECTORY != "":
                _,filename = os.path.split(path)
                new_path = os.path.join(settings.DELETED_FILES_DIRECTORY,
                                    filename)
                logging.info("Moving %s to %s" % (path, new_path))
                # Use shutil.move instead of os.rename to move across filesystems.
                shutil.move(path, new_path)
            song.delete()
        except Exception, e:
            logging.error("Failed to delete song: %s" % e)

@enable_logging
@permission_required('aenclave.delete_song', 'Delete Song')
def delete_songs(request):
    form = request.POST

    # The person must be authenticated
    if not request.user.is_authenticated():
        raise Http404()

    if not request.user.is_staff:
        return submit_delete_requests(request)

    subject = 'Song Deletion by ' + request.user.username
    message = 'The following files were deleted by ' + request.user.username + ':\n'

    song_list = []

    songs = get_song_list(form)
    for song in songs:
        song_string = (' * %(id)s - %(artist)s - %(album)s - %(title)s\n' %
                       {'id': str(song.id),
                        'artist': song.artist,
                        'album': song.album,
                        'title': song.title})
        message += song_string
        song_list.append(song)

    try:
        mail_admins(subject,message,False)
    except Exception, e:
        logging.error("Could not send deletion mail: %s" % e)

    # Do the dirty deed.
    delete_songs_by_policy(songs)

    return render_html_template('aenclave/delete_performed.html', request, {},
                                context_instance=RequestContext(request))

@permission_required('aenclave.request_delete_song', 'Request Delete')
def submit_delete_requests(request):
    form = request.POST
    # Add the songs and redirect to the detail page for this playlist.

    message = 'The following delete request(s) were filed'
    if request.user.is_authenticated():
        subject = 'Delete Request from ' + request.user.username
        message += ' by ' + request.user.username + ':\n'
    else:
        subject = 'Delete Request from Anonymous'
        message += ' by an unregistered user:\n'

    song_list = []

    songs = get_song_list(form)
    for song in songs:
        song_string = (' * %(id)s - %(artist)s - %(album)s - %(title)s\n' %
                       {'id': str(song.id),
                        'artist': song.artist,
                        'album': song.album,
                        'title': song.title})
        message += song_string
        song_list.append(song)

    uri = "%s?ids=%s" % (request.build_absolute_uri(reverse("aenclave-list")), '+'.join([str(song.id) for song in songs]))
    message += '\nView these songs here: %s\n' % uri

    mail_admins(subject,message,False)

    return render_html_template('aenclave/delete_requested.html', request,
                                {'song_list': song_list},
                                context_instance=RequestContext(request))
