from django.conf.urls.defaults import *
from django.core.urlresolvers import reverse
from django.contrib import admin
from django.conf import settings

admin.autodiscover()

def get_default_route():
    if settings.VENCLAVE_ENABLED:
        return '/video'
    elif settings.AENCLAVE_ENABLED:
        return '/audio'
    # TODO(XXX) return a default picker page
    return '/log'

urlpatterns = patterns(
    '',

    (r'^$', 'django.views.generic.simple.redirect_to', {'url': get_default_route()}),
    (r'^log/', include('menclave.log.urls')),

    # Login/logout
    url(r'^login/$',
        'menclave.login.login',
        name='menclave-login'),

    url(r'^logout/$',
        'menclave.login.logout',
        name='menclave-logout'),

    (r'^admin/', include(admin.site.urls)),
)

if settings.AENCLAVE_ENABLED:
    urlpatterns += patterns('', (r'^audio/', include('menclave.aenclave.urls')))

if settings.VENCLAVE_ENABLED:
    urlpatterns += patterns('', (r'^video/', include('menclave.venclave.urls')))

if settings.DEBUG:
    urlpatterns += patterns(
        '',
        (r'^media/(?P<path>.*)$',
         'django.views.static.serve',
         {'document_root': settings.MEDIA_ROOT}),
    )
