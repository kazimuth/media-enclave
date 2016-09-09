# menclave/aenclave/json_response.py

"""JSON rendering functions."""

import json

from django.template import loader
from django.http import HttpResponse
from django.conf import settings

from menclave.aenclave import control
from menclave.aenclave.models import Channel

def render_json_template(*args, **kwargs):
    """
    Renders a JSON template, and then calls render_json_response().

    Deprecated.  Don't use Django templates to send JSON, just use
    json.dumps().  It's faster and easier.
    """
    data = loader.render_to_string(*args, **kwargs)
    return render_json_response(data)

def render_json_response(data):
    """Sends an HttpResponse with the X-JSON header and the right mimetype."""
    resp = HttpResponse(data, mimetype=("application/json; charset=" +
                                        settings.DEFAULT_CHARSET))
    return resp

def json_success(message=""):
    return render_json_response(json.dumps({'success': message}))

def json_error(message):
    return render_json_response(json.dumps({'error': message}))

def json_channel_info(request, channel):
    """Return a JSON blob with the channel info.

    We do this on every page load, so it makes sense to put it here.  Also, we
    need to in order to avoid circular dependencies.
    """
    data = {}
    ctrl = channel.controller()
    try:
        snapshot = request.get_channel_snapshot(channel)
    except control.ControlError, e:
        return json.dumps({'error': e.message})
    songs = snapshot.song_queue
    current_song = snapshot.current_song
    queue_length = len(songs) + int(bool(current_song))
    # Take the first three songs.
    if current_song:
        songs = [current_song] + songs[:min(2, len(songs))]
    else:
        songs = songs[:min(3, len(songs))]
    data['songs'] = []
    for song in songs:
        if song.noise:
            info_str = 'Dequeing...'
        else:
            # Strip the metadata of extra spaces, or we'll truncate too much.
            info_str = '%s - %s' % (song.title.strip(), song.artist.strip())
            if len(info_str) > 30:
                info_str = info_str[:27] + '...'
        data['songs'].append(info_str)
    data['elapsed_time'] = snapshot.time_elapsed
    data['song_duration'] = current_song.time if current_song else 0
    data['playlist_length'] = queue_length
    data['playlist_duration'] = snapshot.queue_duration
    data['playing'] = snapshot.status == 'playing'
    return json.dumps(data)
