# menclave/aenclave/channel.py

"""Channel related views and functions."""

from django.http import HttpResponseRedirect, Http404
from django.core.urlresolvers import reverse
from django.template import RequestContext

from menclave.login import (permission_required_json,
                            permission_required,
                            permission_required_xml)
from menclave.aenclave.utils import get_int_list, get_song_list, get_integer
from menclave.aenclave.xml import (simple_xml_response, xml_error,
                                   render_xml_to_response)
from menclave.aenclave.html import html_error
from menclave.aenclave.json_response import (render_json_response, json_error,
                                             json_channel_info)
from menclave.aenclave.recommendations import good_recommendations
from menclave.aenclave.html import render_html_template
from menclave.aenclave.control import ControlError
from menclave.aenclave.models import Channel, Song, PlayHistory

import urlparse

#--------------------------------- Channels ----------------------------------#

def channel_detail(request, channel_id=1):
    try:
        channel = Channel.objects.get(pk=channel_id)
    except Channel.DoesNotExist:
        raise Http404
    try:
        snapshot = request.get_channel_snapshot(channel)
    except ControlError, e:
        msg = "Error while connecting to player: %s" % e.message
        return html_error(request, msg)
    songs = Song.annotate_favorited(snapshot.song_queue, request.user)
    return render_html_template('aenclave/channels.html', request,
                                {'channel': channel,
                                 'current_song': snapshot.current_song,
                                 'song_list': songs,
                                 'force_actions_bar': True,
                                 'elapsed_time': snapshot.time_elapsed,
                                 'playing': snapshot.status == 'playing',
                                 'no_queuing': True,
                                 'allow_dragging': True},
                                context_instance=RequestContext(request))

def channel_history(request, channel_id=1):
    try:
        channel = Channel.objects.get(pk=channel_id)
    except Channel.DoesNotExist:
        raise Http404
    try:
        snapshot = request.get_channel_snapshot(channel)
    except ControlError, e:
        msg = "Error while connecting to player: %s" % e.message
        return html_error(request, msg)
    songs = Song.annotate_favorited(snapshot.song_history, request.user)
    return render_html_template("aenclave/list_songs.html", request,
                                {'song_list': songs,
                                 'title': 'Channel History'},
                                context_instance=RequestContext(request))

def xml_update(request):
    # TODO(rnk): This code is dead and untested.
    form = request.POST
    channel_id = get_integer(form, 'channel', 1)
    try: channel = Channel.objects.get(pk=channel_id)
    except Channel.DoesNotExist:
        return xml_error('invalid channel id: ' + repr(channel_id))
    timestamp = get_integer(form, 'timestamp', None)
    if timestamp is None: return xml_error('invalid timestamp')
    elif timestamp >= channel.last_touched_timestamp():  # up-to-date timestamp
        try:
            snapshot = request.get_channel_snapshot(channel)
            if snapshot.status != "playing":
                return simple_xml_response('continue')
            elapsed_time = snapshot.time_elapsed
            total_time = snapshot.current_song.time
            return render_xml_to_response('aenclave/update.xml',
                                          {'elapsed_time':elapsed_time,
                                           'total_time':total_time})
        except ControlError, err: return xml_error(str(err))
    else:
        return simple_xml_response('reload')  # old timestamp

#---------------------------------- Control ----------------------------------#

# @permission_required_json('aenclave.can_control')
def json_control(request):
    action = request.POST.get('action','')
    channel = Channel.default()
    ctrl = channel.controller()
    try:
        if action == 'play': ctrl.unpause()
        elif action == 'pause': ctrl.pause()
        elif action == 'skip': ctrl.skip()
        elif action == 'shuffle': ctrl.shuffle()
        else: return json_error('invalid action: ' + action)
    except ControlError, err:
        return json_error(str(err))
    else:
        # Control succeeded, get the current playlist state and send that back.
        return _json_control_update(request, channel)

@permission_required_json('aenclave.can_control')
def channel_reorder(request, channel_id=1):
    try: channel = Channel.objects.get(pk=channel_id)
    except Channel.DoesNotExist: raise Http404
    ctrl = channel.controller()
    form = request.GET
    ctrl.move_song(int(form['playid']), int(form['after_playid']))
    return _json_control_update(request, channel)

def json_control_update(request, channel_id=1):
    """View handler that serves the JSON API request."""
    try: channel = Channel.objects.get(pk=channel_id)
    except Channel.DoesNotExist: raise Http404
    return _json_control_update(request, channel)

def _json_control_update(request, channel):
    """Utility for returning JSON with updated channel status."""
    try:
        channel_info = json_channel_info(request, channel)
    except ControlError, err:
        return json_error(str(err))
    else:
        return render_json_response(channel_info)


# @permission_required('aenclave.can_queue', 'Queue Song')
def queue_to_front(request):
    form = request.REQUEST
    songs = get_song_list(form)
    if len(songs) != 1:
        raise json_error("Can only queue one song to front")

    song = songs[0]
    channel = Channel.default()
    ctrl = channel.controller()

    try:
        ctrl.queue_to_front(song)

    except ControlError, err:
        if 'getupdate' in form:
            return json_error(str(err))
        else:
            return html_error(request, str(err))

    history_entry = PlayHistory(song=song)
    history_entry.save()

    if 'getupdate' in form:
        # Send back an updated playlist status.
        return _json_control_update(request, channel)
    else:
        # Redirect to the channels page.
        return HttpResponseRedirect(reverse('aenclave-default-channel'))


# @permission_required('aenclave.can_queue', 'Queue Song')
def queue_songs(request):
    form = request.REQUEST
    # Get the selected songs.
    songs = get_song_list(form)
    # Queue the songs.
    channel = Channel.default()
    ctrl = channel.controller()
    referrer = request.META.get('HTTP_REFERER', '')
    referrer_path = urlparse.urlparse(referrer).path
    if 'recommendations' in referrer_path:
        good_recommendations(request)
    try:
        ctrl.add_songs(songs)
    except ControlError, err:
        if 'getupdate' in form:
            return json_error(str(err))
        else:
            return html_error(request, str(err))
    for song in songs:
        history_entry = PlayHistory(song=song)
        history_entry.save()
    if 'getupdate' in form:
        # Send back an updated playlist status.
        return _json_control_update(request, channel)
    else:
        # Redirect to the channels page.
        return HttpResponseRedirect(reverse('aenclave-default-channel'))

# @permission_required('aenclave.can_queue', 'Dequeue Song')
def dequeue_songs(request):
    form = request.POST
    # Get the selected playids.
    playids = get_int_list(form, 'playids')
    # Dequeue the songs.
    channel = Channel.default()
    ctrl = channel.controller()
    try:
        ctrl.remove_songs(playids)
    except ControlError, err:
        return html_error(request, str(err))
    # Redirect to the channels page.
    return HttpResponseRedirect(reverse('aenclave-default-channel'))

@permission_required_xml('aenclave.can_queue')
def xml_queue(request):
    form = request.POST
    # Get the selected songs.
    songs = get_song_list(form)
    # Queue the songs.
    channel = Channel.default()
    ctrl = channel.controller()
    try: ctrl.add_songs(songs)
    except ControlError, err: return xml_error(str(err))
    else: return simple_xml_response('success')

@permission_required_xml('aenclave.can_queue')
def xml_dequeue(request):
    form = request.POST
    # Get the selected songs.
    playids = get_int_list(form, 'playids')
    # Dequeue the songs.
    channel = Channel.default()
    ctrl = channel.controller()
    try: ctrl.remove_songs(playids)
    except ControlError, err: return xml_error(str(err))
    else: return simple_xml_response('success')

@permission_required_xml('aenclave.can_control')
def xml_control(request):
    form = request.POST
    action = form.get('action','')
    channel = Channel.default()
    ctrl = channel.controller()
    try:
        if action == 'play': ctrl.unpause()
        elif action == 'pause': ctrl.pause()
        elif action == 'skip': ctrl.skip()
        elif action == 'shuffle': ctrl.shuffle()
        else: return xml_error('invalid action: ' + action)
    except ControlError, err: return xml_error(str(err))
    else: return simple_xml_response('success')
