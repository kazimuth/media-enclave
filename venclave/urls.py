# menclave/venclave/urls.py

from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',

    url(r'^$',
        'menclave.venclave.views.home',
        name='venclave-home'),

    url(r'^browse/$',
        'menclave.venclave.views.browse',
        name='venclave-browse' ),

    url(r'^upload/$',
        'menclave.venclave.views.upload',
        name='venclave-upload'),

    url(r'^detail/(\d+)$',
        'menclave.venclave.views.detail',
        name='venclave-detail'),

    url(r'^update_list/$',
        'menclave.venclave.views.update_list'),

    url(r'^load_pane/',
        'menclave.venclave.views.get_pane',
        name="venclave-pane"),

    url(r'logout/',
        'django.contrib.auth.views.logout_then_login',
        name='venclave-logout'),

    # Static content -- These exist only for the test server.  In production,
    # they should not be served using Django, but with appropriate server
    # voodoo.

    url(r'^scripts/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': 'venclave/scripts/'},
        name='venclave-scripts'),

    url(r'^styles/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': 'venclave/styles/'},
        name='venclave-styles'),

    url(r'^images/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': 'venclave/images/'},
        name='venclave-images')
)
