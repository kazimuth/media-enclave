# menclave/aenclave/urls.py

from django.conf import settings
from django.conf.urls.defaults import url, patterns

from menclave.aenclave.models import Song

urlpatterns = patterns(
    '',

    url(r'^$',
        'menclave.aenclave.views.home',
        name='aenclave-home'),

    # Static content -- These exist only for the test server.  In production,
    # they should not be served using Django, but with appropriate server
    # voodoo.

    url(r'^scripts/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings._MENCLAVE_ROOT + 'aenclave/scripts/'},
        name='aenclave-scripts'),

    url(r'^styles/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings._MENCLAVE_ROOT + 'aenclave/styles/'},
        name='aenclave-styles'),

    url(r'^images/(?P<path>.*)$',
        'django.views.static.serve',
        {'document_root': settings._MENCLAVE_ROOT + 'aenclave/images/'},
        name='aenclave-images'),

    # Login/logout

    url(r'^login/$',
        'menclave.aenclave.login.login',
        name='aenclave-login'),

    url(r'^logout/$',
        'menclave.aenclave.login.logout',
        name='aenclave-logout'),

    url(r'^user/$',  # DEBUG remove this eventually
        'menclave.aenclave.login.user_debug',
        name="aenclave-user-debug"),

    # Queuing

    url(r'^queue/$',
        'menclave.aenclave.channel.queue_songs',
        name='aenclave-queue-songs'),

    url(r'^queue_to_front/$',
        'menclave.aenclave.channel.queue_to_front',
        name='aenclave-queue-to-front'),

    url(r'^dequeue/$',
        'menclave.aenclave.channel.dequeue_songs',
        name='aenclave-dequeue-songs'),

    # Searching

    url(r'^search/$',
        'menclave.aenclave.search.normal_search',
        name='aenclave-normal-search'),

    url(r'^filter/$',
        'django.views.generic.simple.direct_to_template',
        {'template': 'aenclave/filter.html'},
        name='aenclave-filter-home'),

    url(r'^filter/search/$',
        'menclave.aenclave.search.filter_search',
        name='aenclave-filter-search'),

    # Browsing

    url(r'^browse/$',
        'menclave.aenclave.browse.browse_index',
        name='aenclave-browse-index'),

    (r'^browse/albums/(?P<letter>[a-zA-Z~#@])/$',
     'menclave.aenclave.browse.browse_albums'),

    (r'^browse/artists/(?P<letter>[a-zA-Z~#@])/$',
     'menclave.aenclave.browse.browse_artists'),

    url(r'^songs/(?P<object_id>\d+)/$',
        'django.views.generic.list_detail.object_detail',
        {'queryset': Song.objects, 'template_name': 'song_detail.html'},
        name='aenclave-song'),

    url(r'^albums/(?P<album_name>.+)/$',
        'menclave.aenclave.browse.view_album',
        name='aenclave-album'),

    url(r'^artists/(?P<artist_name>.+)/$',
        'menclave.aenclave.browse.view_artist',
        name='aenclave-artist'),

    url(r'^songs/$',
        'menclave.aenclave.browse.list_songs',
        name='aenclave-list'),

    # Channels

    url(r'^channels/$',
        'menclave.aenclave.channel.channel_detail',
        name='aenclave-default-channel'),

    url(r'^channels/(?P<channel_id>\d+)/$',
        'menclave.aenclave.channel.channel_detail',
        name='aenclave-channel'),

    url(r'^channels/(?P<channel_id>\d+)/history/$',
        'menclave.aenclave.channel.channel_history',
        name='aenclave-channel-history'),

    url(r'^channels/(?P<channel_id>\d+)/reorder/$',
        'menclave.aenclave.channel.channel_reorder',
        name='aenclave-channel-reorder'),

    # Playlists

    url(r'^playlists/$',
        'menclave.aenclave.playlist.all_playlists',
        name='aenclave-playlists-home'),

    url(r'^playlists/favorites/$',
        'menclave.aenclave.playlist.favorites',
        name='aenclave-playlists-favorites'),

    url(r'^playlists/normal/(?P<playlist_id>\d+)/$',
        'menclave.aenclave.playlist.playlist_detail',
        name='aenclave-playlist'),

    url(r'^playlists/user/(?P<username>.+)/$',
        'menclave.aenclave.playlist.user_playlists',
        name='aenclave-user-playlist'),

    url(r'^playlists/create/$',
        'menclave.aenclave.playlist.create_playlist',
        name='aenclave-playlist-create'),

    url(r'^playlists/add/$',
        'menclave.aenclave.playlist.add_to_playlist',
        name='aenclave-playlist-add'),

    url(r'^playlists/remove/$',
        'menclave.aenclave.playlist.remove_from_playlist',
        name='aenclave-playlist-remove'),

    url(r'^playlists/delete/$',
        'menclave.aenclave.playlist.delete_playlist',
        name='aenclave-playlist-delete'),

    url(r'^playlists/edit/(?P<playlist_id>\d+)/$',
        'menclave.aenclave.playlist.edit_playlist',
        name='aenclave-playlist-edit'),

    url(r'^playlists/edit_group/(?P<playlist_id>\d+)/$',
        'menclave.aenclave.playlist.edit_group_playlist',
        name='aenclave-playlist-edit-group'),

    # Uploading

    url(r'^upload/$',
        'django.views.generic.simple.direct_to_template',
        {'template': 'aenclave/upload.html'},
        name='aenclave-upload-home'),

    url(r'^upload/http/$',
        'menclave.aenclave.upload.upload_http',
        name='aenclave-http-upload'),

    url(r'^upload/fancy/$',
        'menclave.aenclave.upload.upload_http_fancy',
        name='aenclave-http-upload-fancy'),

    url(r'^upload/youtube/receive/$',
        'menclave.aenclave.upload.upload_youtube_receiver',
        name='aenclave-youtube-receiver'),

    url(r'^upload/fancy/receive/$',
        'menclave.aenclave.upload.upload_http_fancy_receiver',
        name='aenclave-http-upload-fancy-receiver'),


    url(r'^upload/sftp/$',
        'menclave.aenclave.upload.upload_sftp',
        name='aenclave-sftp-upload'),

    url(r'^upload/sftp-info/$',
        'menclave.aenclave.upload.sftp_info',
        name='aenclave-sftp-info'),

    # DL

    url(r'^dl/$',
        'menclave.aenclave.download.dl',
        name='aenclave-dl'),

    # Roulette

    url(r'^roulette/$',
        'menclave.aenclave.views.roulette',
        name='aenclave-roulette'),

    url(r'^help/$',
        'menclave.aenclave.views.help',
        name='aenclave-help'),

    # Recommendations
    url(r'^recommendations/$',
        'menclave.aenclave.recommendations.view_recommendations',
        name='aenclave-recommendations'),

    # Deletion and Delete Requests

    url(r'^delete-songs/$',
        'menclave.aenclave.delete.delete_songs',
        name='aenclave-delete-songs'),

    # XML hooks

    (r'^xml/queue/$',
     'menclave.aenclave.channel.xml_queue'),

    (r'^xml/dequeue/$',
     'menclave.aenclave.channel.xml_dequeue'),

    (r'^xml/control/$',
     'menclave.aenclave.channel.xml_control'),

    (r'^xml/update/$',
     'menclave.aenclave.channel.xml_update'),

    (r'^xml/edit/$',
     'menclave.aenclave.edit.xml_edit'),

    (r'^xml/playlists/user/$',
     'menclave.aenclave.playlist.xml_user_playlists'),

    # JSON hooks

    (r'^json/control/$',
     'menclave.aenclave.channel.json_control'),

    (r'^json/edit/$',
     'menclave.aenclave.edit.json_edit'),

    (r'^json/playlists/user/$',
     'menclave.aenclave.playlist.json_user_playlists'),

    (r'^json/email/$',
     'menclave.aenclave.views.json_email_song_link'),

    (r'^json/controls_update/$',
     'menclave.aenclave.channel.json_control_update'),

    (r'^json/controls_update/(?P<channel_id>\d+)/$',
     'menclave.aenclave.channel.json_control_update'),

    (r'^json/favorite_song/(?P<song_id>\d+)/$',
     'menclave.aenclave.views.favorite_song'),

    (r'^json/search/$',
     'menclave.aenclave.search.json_search'),

    # Speech recognition parts

    (r'^speech_page/$',
     'menclave.aenclave.views.speech_page'),

    # For Recommendations (6.867)

    (r'^recommendations/feedback/$',
     'menclave.aenclave.recommendations.bad_recommendations'),



)
