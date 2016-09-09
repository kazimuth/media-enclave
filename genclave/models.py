# menclave/genclave/models.py

from calendar import timegm
import datetime

from django.db import models
from django.contrib.auth.models import User

#================================= UTILITIES =================================#

def datetime_string(dt):
    date, today = dt.date(), datetime.date.today()
    if date == today: return dt.strftime('Today %H:%M:%S')
    elif date == today - datetime.timedelta(1):
        return dt.strftime('Yesterday %H:%M:%S')
    else: return dt.strftime('%d %b %Y %H:%M:%S')

#================================== MODELS ===================================#

class Emulator(models.Model):
    def __unicode__(self): return self.name

    name = models.CharField(max_length=50, unique=True)

    system = models.CharField(max_length=50)

    executable = models.FilePathField(path='/tmp', match="xmms.*",
                                      recursive=True,
                                      help_text="The path to the executable.")

    class Admin:
        list_display = ('name', 'system', 'executable')
        list_display_links = ('name',)
        search_fields = ('name', 'system')

    class Meta:
        ordering = ('system', 'name',)

    @models.permalink
    def get_absolute_url(self):
        return ('genclave-emulator', (str(self.id),))

#-----------------------------------------------------------------------------#

class Tag(models.Model):
    def __unicode__(self): return self.name

    name = models.CharField(max_length=50, primary_key=True)

    class Admin:
        list_display = ('name',)
        list_display_links = ('name',)
        search_fields = ('name',)

    class Meta:
        ordering = ('name',)

#-----------------------------------------------------------------------------#

class VisibleManager(models.Manager):
    """VisibleManager -- manager for getting only visible videos"""
    def get_query_set(self):
        return super(VisibleManager, self).get_query_set().filter(visible=True)


class Game(models.Model):
    def __unicode__(self): return self.title

    #--------------------------------- Title ---------------------------------#

    title = models.CharField(max_length=255)

    #-------------------------------- Emulator -------------------------------#

    emulator = models.ForeignKey(Emulator)

    #------------------------------ Date Added -------------------------------#

    date_added = models.DateTimeField(auto_now_add=True, editable=False)
    def date_added_string(self): return datetime_string(self.date_added)
    date_added_string.short_description = 'date added'

    #------------------------------ Last Played ------------------------------#

    last_played = models.DateTimeField(default=None, null=True, editable=False)
    def last_played_string(self): return datetime_string(self.last_played)
    last_played_string.short_description = 'last played'

    #------------------------------- ROM Path --------------------------------#

    rom = models.FileField(upload_to='genclave/roms/%Y/%m/%d/')

    #------------------------------ Screenshot -------------------------------#

    screenshot = models.ImageField(upload_to='genclave/screenshots/%Y/%m/%d/',
                                   blank=True, null=True)

    #--------------------------------- Tags ----------------------------------#

    tags = models.ManyToManyField(Tag, blank=True)

    #-------------------------------- Visible --------------------------------#

    visible = models.BooleanField(default=True, help_text="Non-visible games"
                                  " do not appear in search results.")

    #------------------------------ Other Stuff ------------------------------#

    def system(self): return self.emulator.system

    class Admin:
        date_hierarchy = 'date_added'
        fields = (('General Information',
                   {'fields': ('title', 'emulator', 'rom', 'screenshot')}),
                  ('Search Metadata',
                   {'fields': ('tags', 'visible')}))
        list_display = ('title', 'system', 'emulator', 'date_added',
                        'visible')
        list_display_links = ('title',)
        list_filter = ('visible', 'date_added')
        search_fields = ('title',)

    class Meta:
        get_latest_by = 'date_added'
        ordering = ('title',)

    @models.permalink
    def get_absolute_url(self):
        return ('genclave-game', (str(self.id),))

    def play_touch(self):
        self.last_played = datetime.datetime.now()
        self.save()

    objects = models.Manager()
    visibles = VisibleManager()

#-----------------------------------------------------------------------------#

class Freeze(models.Model):
    def __unicode__(self): return self.name

    game = models.ForeignKey(Game)

    user = models.ForeignKey(User)

    name = models.CharField(max_length=255)

    data = models.FileField(upload_to='genclave/freezes/%Y/%m/%d/')

    class Admin:
        list_display = ('name', 'game', 'user')
        list_display_links = ('name',)
        list_filter = ('game', 'user')
        search_fields = ('name', 'game')

    class Meta:
        #ordering = ('user.username', 'game.name', 'name',)
        unique_together = (('user', 'game', 'name'),)

#=============================================================================#
