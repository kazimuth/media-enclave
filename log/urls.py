from django.conf.urls.defaults import patterns, url

from models import RequestLog

log_list = {
    'queryset': RequestLog.objects.all().order_by('-timestamp'),
    'paginate_by': 100,
    }
log_item = {
    'queryset': RequestLog.objects.all(),
    }
log_detail = {
    'queryset': RequestLog.objects.all(),
    }

urlpatterns = patterns(
    '',

    url(r'^detail/$',
        'menclave.log.views.log_json_detail',
        name="log-json-detail-noarg"),

    url(r'^detail/(?P<log_id>\d+)$',
        'menclave.log.views.log_json_detail',
        name="log-json-detail"),

    url(r'^$',
        'django.views.generic.list_detail.object_list',
        log_list,
        name="log-view"),

    url(r'^(?P<object_id>\d+)$',
        'django.views.generic.list_detail.object_detail',
        log_item,
        name="log-item-view"),    
)
