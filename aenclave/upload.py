import logging
import os

from django.conf import settings
from django.core.files import File
from django.http import Http404, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.template import RequestContext

from menclave.log.util import enable_logging
from menclave.login import permission_required_redirect
from menclave.aenclave.html import html_error, render_html_template
from menclave.aenclave import processing
from menclave.aenclave import youtuberip

#---------------------------------- Upload -----------------------------------#

@enable_logging
@permission_required_redirect('aenclave.add_song', 'goto')
def upload_http(request):
    # Nab the file and make sure it's legit.
    audio = request.FILES.get('audio', None)
    if audio is None:
        return html_error(request, 'No file was uploaded.', 'HTTP Upload')

    try:
        song, audio = processing.process_song(audio.name, audio)
    except processing.BadContent:
        return html_error(request, "You may only upload audio files.",
                          "HTTP Upload")

    return render_html_template('aenclave/upload_http.html', request,
                                {'song_list': [song],
                                 'sketchy_upload': audio.info.sketchy},
                                context_instance=RequestContext(request))

def sftp_info(request):
    return render_html_template('aenclave/sftp_info.html', request,
                                {'GST_PLAYER_HOST': settings.GST_PLAYER_HOST},
                                context_instance=RequestContext(request))

@permission_required_redirect('aenclave.add_song', 'goto')
def upload_sftp(request):
    song_list = []
    sketchy = False
    sftp_upload_dir = settings.AENCLAVE_SFTP_UPLOAD_DIR

    # Figure out available MP3's in SFTP upload DIR
    for root, dirs, files in os.walk(sftp_upload_dir):
        for filename in files:
            if processing.valid_song(filename):
                full_path = root + '/' + filename

                content = File(open(full_path, 'r'))

                song, audio = processing.process_song(full_path, content)

                song_list.append(song)

                if audio.info.sketchy:
                    sketchy = True

                #remove the file from the sftp-upload directory
                os.unlink(full_path)

    return render_html_template('aenclave/upload_sftp.html', request,
                                {'song_list': song_list,
                                 'sketchy_upload': sketchy},
                                context_instance=RequestContext(request))

@permission_required_redirect('aenclave.add_song', 'goto')
def upload_http_fancy(request):
    # HTTPS is way slowed down..
    if request.is_secure():
        return HttpResponseRedirect("http://" + request.get_host() +
                                    reverse("aenclave-http-upload-fancy"))

    file_types = map(lambda s: "*.%s" % s, settings.SUPPORTED_AUDIO)
    return render_html_template('aenclave/upload_http_fancy.html', request,
                                {'song_list': [],
                                 'show_songlist': True,
                                 'file_types': file_types,
                                 'force_actions_bar':True},
                                context_instance=RequestContext(request))

def load_session_from_request(handler):
    """Read the session key from the GET/POST vars instead of the cookie.

    Centipedes, in my request headers?
    Yes! We sometimes receive the session key in the POST, because the
    multiple-file-uploader uses Flash to send the request, and the best Flash
    can do is grab our cookies from javascript and send them in the POST.
    """
    def func(request, *args, **kwargs):
        session_key = request.REQUEST.get(settings.SESSION_COOKIE_NAME, None)
        if not session_key:
            # TODO(rnk): Do something more sane like ask the user if their
            #            session is expired or some other weirdness.
            raise Http404()
        # This is how SessionMiddleware does it.
        session_engine = __import__(settings.SESSION_ENGINE, {}, {}, [''])
        try:
            request.session = session_engine.SessionStore(session_key)
        except Exception, e:
            return html_error(e)
        return handler(request, *args, **kwargs)
    return func

@enable_logging
@load_session_from_request
@permission_required_redirect('aenclave.add_song', 'goto')
def upload_http_fancy_receiver(request):
    logging.info("Got fancy receiver request.")
    audio = None
    # The key is generally 'Filedata' but this is just easier.
    for k,f in request.FILES.items():
        audio = f

    # SWFUpload does not properly fill out the song's mimetype, so
    # just use the extension.
    if audio is None:
        logging.error("Did not find any file uploaded.")
        return html_error(request, 'No file was uploaded.', 'HTTP Upload')

    logging.info("Received upload of %s" % audio.name)

    if not processing.valid_song(audio.name):
        logging.error("Rejecting upload due to unsupported filetype")
        return html_error(request, 'This filetype is unsupported.',
                          'HTTP Upload')

    # Save the song into the database -- we'll fix the tags in a moment.
    song, audio = processing.process_song(audio.name, audio)

    return render_html_template('aenclave/songlist_song_row.html', request,
                                {'song': song},
                                context_instance=RequestContext(request))

@permission_required_redirect('aenclave.add_song', 'goto')
def upload_youtube_receiver(request):
    url = request.POST.get('youtube-url', '')
    if not url:
        return html_error(request, "URL required.")
    #try:
        #audio_pp = youtuberip.rip_video(url, path="/tmp/")
    #except Exception, e:
        #return html_error(request, e.message)
    audio_pp = youtuberip.rip_video(url, path="/tmp/")
    audio_file = audio_pp.audio_file
    song, audio = processing.process_song(audio_file, File(open(audio_file)))
    try:
        sketchy = audio.info.sketchy
    except AttributeError:
        sketchy = True

    # Fill in these defaults on the tags.  It would be better to tag the file
    # as we rip it, but then we'd have to deal with teaching gstreamer to tag
    # MP3 and M4As.
    song.title = audio_pp.title
    song.artist = audio_pp.uploader
    song.album = 'YouTube'
    song.save()

    return render_html_template('aenclave/upload_http.html', request,
                                {'song_list': [song],
                                 'sketchy_upload': sketchy},
                                context_instance=RequestContext(request))
