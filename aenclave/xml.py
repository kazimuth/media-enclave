from django.http import HttpResponse
from django.template import loader

from menclave import settings

def render_xml_to_response(*args, **kwargs):
    return HttpResponse(loader.render_to_string(*args, **kwargs),
                        mimetype=("text/xml; charset=" +
                                  settings.DEFAULT_CHARSET))

def simple_xml_response(tagname):
    """simple_xml_response(tagname) -> single-tag XML HTTP-response"""
    return HttpResponse('<%s/>' % tagname,
                        mimetype=("text/xml; charset=" +
                                  settings.DEFAULT_CHARSET))

def xml_error(message):
    return render_xml_to_response('aenclave/error.xml',
                                  {'error_message':message})
