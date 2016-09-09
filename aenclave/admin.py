# menclave/aenclave/admin.py

from django.contrib import admin
from models import Song, Playlist, Channel

class SongAdmin(admin.ModelAdmin):
    date_hierarchy = 'date_added'
    list_display = ('track','title', 'time_string', 'album', 'artist',
                    'date_added', 'adjusted_score', 'visible')
    list_display_links = ('title','track')
    list_filter = ('visible', 'date_added')
    search_fields = ('title', 'album', 'artist')

class PlaylistAdmin(admin.ModelAdmin):
    date_hierarchy = 'date_created'
    list_display = ('name', 'owner', 'group', 'last_modified',
                    'date_created')
    list_filter = ('owner', 'last_modified', 'date_created')
    search_fields = ('name',)

class ChannelAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'last_touched')
    list_display_links = ('name',)

admin.site.register(Channel,ChannelAdmin)
admin.site.register(Playlist,PlaylistAdmin)
admin.site.register(Song,SongAdmin)
