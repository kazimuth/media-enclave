
from django.contrib import admin

from menclave.venclave import models

class ContentNodeAdmin(admin.ModelAdmin):
    date_hierarchy = 'created'
#     fields = (('General Information',
#                {'fields': ('title', 'path', 'content', 'kind',
#                            'cover_art')}),
#               ('Searching Metadata',
#                {'fields': ('tags', 'visible')}))
    list_display = ('title', 'created')
    list_display_links = ('title',)
    list_filter = ('created',)
    search_fields = ('title',)

class ContentMetadataAdmin(admin.ModelAdmin):
    pass

admin.site.register(models.ContentNode, ContentNodeAdmin)
admin.site.register(models.ContentMetadata, ContentMetadataAdmin)
admin.site.register(models.IMDBMetadata)
admin.site.register(models.RottenTomatoesMetadata)
admin.site.register(models.ManualMetadata)
admin.site.register(models.FileMetadata)
admin.site.register(models.Genre)
admin.site.register(models.Director)
admin.site.register(models.Actor)

