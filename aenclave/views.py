# menclave/aenclave/views.py

import re

from django.core.mail import send_mail
from django.http import Http404
from django.template import RequestContext

from menclave import settings
from menclave.aenclave import json_response
from menclave.aenclave import wami_grammar
from menclave.aenclave.html import render_html_template
from menclave.aenclave.models import Channel, Song, Playlist, PlaylistEntry
from menclave.aenclave.utils import get_song_list
import json

#--------------------------------- Misc --------------------------------------#

def home(request):
    channel = Channel.objects.get(pk=1)  # 1 is the default channel.
    playlist_info = json_response.json_channel_info(request, channel)
    return render_html_template('aenclave/index.html', request,
                                {'total_song_count': Song.visibles.count(),
                                 'playlist_info': playlist_info},
                                context_instance=RequestContext(request))

def help(request):
    channel = Channel.objects.get(pk=1)  # 1 is the default channel.
    playlist_info = json_response.json_channel_info(request, channel)
    return render_html_template('aenclave/help.html', request,
                                {'playlist_info': playlist_info},
                                context_instance=RequestContext(request))

def roulette(request):
    # Choose six songs randomly.
    queryset = Song.visibles.order_by('?')[:6]
    queryset = Song.annotate_favorited(queryset, request.user)
    return render_html_template('aenclave/roulette.html', request,
                                {'song_list': queryset},
                                context_instance=RequestContext(request))

def json_email_song_link(request):
    form = request.POST
    email_address = form.get('email', '')
    if not re.match("^[-_a-zA-Z0-9.]+@[-_a-zA-Z0-9.]+$", email_address):
        return json_response.json_error("Invalid email address.")
    songs = get_song_list(form)
    if songs:
        message = ["From: Audio Enclave <%s>\r\n" %
                   settings.DEFAULT_FROM_EMAIL,
                   "To: %s\r\n\r\n" % email_address,
                   "Someone sent you a link to the following "]
        if len(songs) == 1:
            message.append("song:\n\n")
            subject = songs[0].title
        else:
            message.append("songs:\n\n")
            subject = "%d songs" % len(songs)
        for song in songs:
            message.extend((song.title, "\n",
                            song.artist, "\n",
                            song.album, "\n",
                            settings.HOST_NAME +
                            song.get_absolute_url(), "\n\n"))
        # Ship it!
        send_mail("Link to " + subject, "".join(message),
                  settings.DEFAULT_FROM_EMAIL, (email_address,))
        msg = "An email has been sent to %s." % email_address
        return json_response.json_success(msg)
    else: return json_response.json_error("No matching songs were found.")

def favorite_song(request, song_id):
    if not request.user.is_authenticated():
        return json_response.json_error('User not authenticated.')
    favorited = request.POST['favorited'] == 'true'
    try:
        song = Song.objects.get(pk=int(song_id))
    except Song.DoesNotExist:
        raise Http404
    pl = Playlist.get_favorites(request.user, create=True)
    try:
        fav = PlaylistEntry.objects.get(song=song, playlist=pl)
    except PlaylistEntry.DoesNotExist:
        fav = None
    if favorited and not fav:
        pl.append_songs([song])
    elif not favorited and fav:
        fav.delete()
    return json_response.json_success("%s favorited: %r" % (song_id, favorited))

def speech_page(request):
    grammar = wami_grammar.generate()
    return render_html_template(
        'aenclave/speech_page.html', request,
        {
            'WAMI_KEY' : settings.WAMI_API_KEY[request.META['HTTP_HOST']],
            'grammar' : grammar
        },
        context_instance=RequestContext(request))



#=============================================================================#
