# menclave/aenclave/html.py

"""HTML rendering functions."""

from django.shortcuts import render_to_response
from django.template import RequestContext

from menclave.aenclave.json_response import json_channel_info
from menclave.aenclave.models import Channel

def render_html_template(template, request, options=None, *args, **kwargs):
    """Render a template response with some extra parameters."""
    # This exists so that if we need to, we can hook all of our template
    # rendering calls very easily.
    if options is None: options = {}
    options['dl'] = 'dl' in request.REQUEST
    options['playlist_info'] = json_channel_info(request, Channel.default())
    return render_to_response(template, options, *args, **kwargs)

def html_error(request, message=None, title=None):
    return render_html_template('aenclave/error.html', request,
                                {'error_message':message, 'error_title':title},
                                context_instance=RequestContext(request))
