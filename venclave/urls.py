# menclave/venclave/urls.py

from django.conf.urls.defaults import *

urlpatterns = patterns(
    '',

    url(r'^$',
        'menclave.venclave.views.home',
        name='venclave-home'),

    url(r'^browse/$',
        'menclave.venclave.browse.browse',
        name='venclave-browse'),

    url(r'^browse/movies/$',
        'menclave.venclave.browse.movies',
        name='venclave-browse-movies'),

    url(r'^browse/movies/(?P<title>[^/]+)/$',
        'menclave.venclave.browse.movie_detail',
        name='venclave-movie-detail'),

    url(r'^browse/tv/$',
        'menclave.venclave.browse.tv',
        name='venclave-browse-tv'),

    url(r'^browse/tv/(?P<series>[^/]+)/$',
        'menclave.venclave.browse.series',
        name='venclave-browse-series'),

    url(r'^browse/tv/(?P<series>[^/]+)/(?P<season>[^/]+)/$',
        'menclave.venclave.browse.season',
        name='venclave-browse-season'),

    url(r'^browse/tv/(?P<series>[^/]+)/(?P<season>[^/]+)/(?P<episode>[^/]+)/$',
        'menclave.venclave.browse.episode_detail',
        name='venclave-episode-detail'),

    url(r'^browse/other/$',
        'menclave.venclave.browse.other',
        name='venclave-browse-other'),

    url(r'^exhibit/$',
        'menclave.venclave.views.exhibit',
        name='venclave-exhibit'),

    url(r'^exhibit/content/$',
        'menclave.venclave.views.exhibit_content',
        name='venclave-exhibit-content'),

    url(r'^exhibit/__history__.html',
        'menclave.venclave.views.exhibit_history',
        name='venclave-exhibit-history'),

    url(r'^detail/(?P<id>\d+)/$',
        'menclave.venclave.browse.detail',
        name='venclave-detail'),

    url(r'request/$',
        'menclave.venclave.views.request',
        name='venclave-request'),

    url(r'request/upvote/$',
        'menclave.venclave.views.upvote',
        name='venclave-upvote'),

    url(r'^update_list/$',
        'menclave.venclave.views.update_list'),

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
