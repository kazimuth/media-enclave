
try:
    import json
except ImportError:
    import simplejson as json

from django.http import HttpResponse 

from models import RequestLog

def log_json_detail(request, log_id):
    log = RequestLog.objects.get(pk=log_id)
    
    message = {'id': log_id,
               'data': json.loads(log.message)}

    return HttpResponse(json.dumps(message))
