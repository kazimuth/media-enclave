
# Workaround for different versions of mutagen.
try:
    from mutagen.mp3 import EasyMP3
except ImportError:
    from mutagen.mp3 import MP3
    from mutagen.easyid3 import EasyID3
    def EasyMP3(*args, **kwargs):
        return MP3(*args, ID3=EasyID3, **kwargs)

from menclave.aenclave.login import permission_required_xml, permission_required_json
from menclave.aenclave.xml import xml_error, render_xml_to_response
from menclave.aenclave.json_response import json_error, render_json_template
from menclave.aenclave.utils import get_unicode, get_integer
from menclave.aenclave.models import Song

@permission_required_xml('aenclave.change_song')
def xml_edit(request):
    if not request.user.is_authenticated():
        return xml_error('user not logged in')
    form = request.POST
    try: song = Song.objects.get(pk=int(form.get('id','')))
    except (ValueError, TypeError, Song.DoesNotExist), err:
        return xml_error(str(err))
    audio = EasyMP3(song.audio.path)
    # Update title.
    title = get_unicode(form, 'title')
    if title:  # Disallow empty titles.
        song.title = title
        audio['title'] = title
    # Update album.
    album = get_unicode(form, 'album')
    if album is not None:
        song.album = album
        audio['album'] = album
    # Update artist.
    artist = get_unicode(form, 'artist')
    if artist is not None:
        song.artist = artist
        audio['artist'] = artist
    # Update track number.
    if form.get('track', None) == '': song.track = 0
    else:
        track = get_integer(form, 'track')
        if track is not None and 0 <= track < 999:
            song.track = track
            audio['tracknumber'] = unicode(track)
    # Save and report success.
    song.save()
    audio.save()
    return render_xml_to_response('done_editing.xml', {'song':song})

@permission_required_json('aenclave.change_song')
def json_edit(request):
    if not request.user.is_authenticated():
        return json_error('user not logged in')
    form = request.POST

    try: song = Song.objects.get(pk=int(form.get('id','')))
    except (ValueError, TypeError, Song.DoesNotExist), err:
        return json_error(str(err))
    audio = EasyMP3(song.audio.path)
    # Update title.
    title = get_unicode(form, 'title')
    if title:  # Disallow empty titles.
        song.title = title
        audio['title'] = title
    # Update album.
    album = get_unicode(form, 'album')
    if album is not None:
        song.album = album
        audio['album'] = album
    # Update artist.
    artist = get_unicode(form, 'artist')
    if artist is not None:
        song.artist = artist
        audio['artist'] = artist
    # Update track number.
    if form.get('track', None) == '':
        song.track = 0
    else:
        track = get_integer(form, 'track')
        if track is not None and 0 <= track < 999:
            song.track = track
            audio['tracknumber'] = unicode(track)
    # Save and report success.
    song.save()
    audio.save()
    return render_json_template('aenclave/done_editing.json', {'song':song})
