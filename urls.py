from django.conf.urls.defaults import *
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

urlpatterns = patterns(
    '',
    (r'^$', 'django.views.generic.simple.redirect_to', {'url': '/audio'}),
    (r'^audio/', include('menclave.aenclave.urls')),
    (r'^log/', include('menclave.log.urls')),
    (r'^admin/(.*)', admin.site.urls),
)

if settings.DEBUG:
    urlpatterns += patterns(
        '',
        (r'^media/(?P<path>.*)$',
         'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT}),
    )
