#!/usr/bin/python

from django.conf import settings

from django.template import RequestContext
from django.shortcuts import render_to_response as django_render_to_response


def render_to_response(template, request, data=None, *args, **kwargs):
    # This exists so that if we need to, we can hook all of our template
    # rendering calls very easily.
    if data is None:
        data = {}
    data.setdefault('settings', settings)
    # Using a RequestContext instead of just a Context fires all of the context
    # preprocessors in settings.  Importantly, this adds the 'request' variable
    # to the template context.
    if 'context_instance' not in kwargs:
        kwargs['context_instance'] = RequestContext(request)
    return django_render_to_response(template, data, *args, **kwargs)
