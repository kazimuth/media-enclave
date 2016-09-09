# menclave/venclave/models.py

import datetime
import os
import re

from django.conf import settings
from django.db import models
from django.db.models import Min, Max

#================================= UTILITIES =================================#

def datetime_string(dt):
    date, today = dt.date(), datetime.date.today()
    if date == today: return dt.strftime('Today %H:%M:%S')
    elif date == today - datetime.timedelta(1):
        return dt.strftime('Yesterday %H:%M:%S')
    else: return dt.strftime('%d %b %Y %H:%M:%S')

#================================== MODELS ===================================#


def cleanup_name(name):
    """
    "Smith, John" => "John Smith"
    "Smith, John (I)" => "John Smith"
    """
    name = re.sub('\([IVX]*\)$', '', name)
    last, first = name.split(', ')
    return "%s %s" % (first, last)


# TODO(rryan) Should we replace this with django-tagging?
class Tag(models.Model):
    def __unicode__(self): return self.name

    name = models.CharField(max_length=50, primary_key=True)

    class Admin:
        list_display = ('name',)
        list_display_links = ('name',)
        search_fields = ('name',)

    class Meta:
        ordering = ('name',)


class Facet(object):

    name = None
    path = None # string specifying field in querysets relative to ContentNode
    facet_type = None

    @classmethod
    def get_choices(cls):
        raise NotImplementedError


class GenreFacet(Facet):

    name = "Genre"
    path = "metadata__imdb__genres__name"
    facet_type = "checkbox"

    @classmethod
    def get_choices(cls):
        return [(g.name,g.name) for g in Genre.objects.order_by('name')]

class ActorFacet(Facet):

    name = "Actor"
    path = "metadata__imdb__actors__name"
    facet_type = "searchbar"
    
    @classmethod
    def get_choices(cls):
        return Actor.objects.order_by('name')

class DirectorFacet(Facet):

    name = "Director"
    path = "metadata__imdb__directors__name"
    facet_type = "searchbar"
    
    @classmethod
    def get_choices(cls):
        return Director.objects.order_by('name')

class TypeFacet(Facet):

    name = "Type"
    path = "kind"
    facet_type = "checkbox"
    
    @classmethod
    def get_choices(cls):
        return ContentNode.KIND_CHOICES

class YearFacet(Facet):

    name = "Year"
    path = "metadata__imdb__release_year"
    facet_type = "slider"

    @classmethod
    def get_choices(cls):
        return IMDBMetadata.objects.aggregate(min=Min('release_year'),
                                              max=Max('release_year'))

class RatingFacet(Facet):

    name = "Rating"
    path = "metadata__imdb__rating"
    facet_type = "slider"
    
    @classmethod
    def get_choices(cls):
        return {'min':0, 'max':5}


class Director(models.Model):

    name = models.CharField(max_length=255, primary_key=True)

    def __unicode__(self):
        return cleanup_name(self.name)


class Actor(models.Model):

    name = models.CharField(max_length=255, primary_key=True)

    SEXES = (('M', 'Male'),
             ('F', 'Female'))

    sex = models.CharField(max_length=1, choices=SEXES, blank=True, null=True)

    def __unicode__(self):
        return cleanup_name(self.name)


class Genre(models.Model):

    name = models.CharField(max_length=255, primary_key=True)

    def __unicode__(self):
        return self.name


class ContentMetadata(models.Model):

    """Content metadata container."""

    imdb = models.ForeignKey("IMDBMetadata", blank=True, null=True)
    rotten_tomatoes = models.ForeignKey("RottenTomatoesMetadata",
                                           blank=True, null=True)
    manual = models.OneToOneField("ManualMetadata", blank=True, null=True)
    file = models.OneToOneField("FileMetadata", blank=True, null=True)


class ContentMetadataSource(models.Model):

    """Abstract base class for storing metadata."""

    def __unicode__(self): return "%s Metadata" % self.source_name()

    @classmethod
    def source_name(cls):
        raise NotImplementedError("the source isn't properly defined")

    #created = models.DateTimeField(auto_now_add=True, editable=False)
    #updated = models.DateTimeField(auto_now=True, editable=False)

    class Meta:
        abstract = True


class IMDBMetadata(ContentMetadataSource):

    """IMDB sourced metadata."""

    def __unicode__(self):
        return ("<IMDBMetadata: imdb_canonical_title=%s>" %
                self.imdb_canonical_title)

    @classmethod
    def source_name(cls):
        return 'IMDB'

    imdb_canonical_title = models.CharField(max_length=255, null=True,
                                            primary_key=True)
    release_date = models.DateTimeField(blank=True, null=True)
    release_year = models.IntegerField(blank=True, null=True)
    genres = models.ManyToManyField('Genre')
    directors = models.ManyToManyField('Director')
    actors = models.ManyToManyField('Actor', through='Role')
    plot_summary = models.TextField(blank=True, null=True)
    rating = models.FloatField(blank=True, null=True)
    length = models.IntegerField(blank=True, null=True)

    def get_important_actors(self):
        return self.actors.order_by('role__bill_pos')[:4]


class Role(models.Model):

    """A role played by an actor."""

    actor = models.ForeignKey(Actor)
    imdb = models.ForeignKey(IMDBMetadata)
    
    role = models.CharField(max_length=255, blank=True, null=True)
    bill_pos = models.IntegerField(blank=True, null=True)


class RottenTomatoesMetadata(ContentMetadataSource):

    """RottenTomatoes metadata."""

    @classmethod
    def source_name(cls):
        return "RottenTomatoes"

    percent_rating = models.IntegerField()
    average_rating = models.FloatField()


class FileMetadata(ContentMetadataSource):

    """File-based metadata."""

    @classmethod
    def source_name(cls):
        return "File"


class ManualMetadata(ContentMetadataSource):

    """Manually entered metadata."""

    @classmethod
    def source_name(cls):
        return "Manual"

    description = models.TextField()


class VideoFile(models.Model):

    file = models.FileField(upload_to='venclave/content')
    parent = models.ForeignKey('ContentNode')


KIND_TV = 'tv'
KIND_MOVIE = 'mo'
KIND_SERIES = 'se'
KIND_SEASON = 'sn'
KIND_TRAILER = 'tr'
KIND_RANDOMCLIP = 'rc'
KIND_UNKNOWN = 'uk'

class ContentNode(models.Model):

    """A video-like set of content.

    We use this model to represent movies, TV series, TV seasons, TV episodes,
    trailers, and random clips.  Series and seasons are the only kinds of
    ContentNodes that have children and  don't directly correspond to a set of
    video files.
    """

    owner = models.ForeignKey('auth.User')

    objects = models.Manager()
    attributes = (TypeFacet, GenreFacet, RatingFacet, YearFacet, DirectorFacet)
    attrs_by_name = dict((f.name, f) for f in attributes)

    def __unicode__(self): return self.compact_name()

    KIND_CHOICES = ((KIND_MOVIE, 'Movie'),
                    (KIND_TV, 'TV episode'),
                    (KIND_SERIES, 'TV series'),
                    (KIND_SEASON, 'TV season'),
                    #(KIND_TRAILER, 'Trailer'),
                    #(KIND_RANDOMCLIP, 'Random clip'),
                    (KIND_UNKNOWN, 'Unknown'))

    kind = models.CharField(default=KIND_UNKNOWN,
                            max_length=2,
                            choices=KIND_CHOICES)

    title = models.CharField(max_length=255)

    # only applicable for kind=='tv', null if not applicable
    season = models.IntegerField(blank=True, null=True)
    episode = models.IntegerField(blank=True, null=True)

    def simple_name(self):
        return self.title

    def compact_name(self):
        #if self.kind == KIND_TV:
            #return "%s S%2dE%2d" % (self.title, self.season, self.episode)
        return self.title

    def full_name(self):
        if self.kind == KIND_TV:
            return ("%s Season %2d Episode %2d" %
                    (self.title, self.season, self.episode))
        elif self.kind == KIND_MOVIE:
            return "%s (%d)" % (self.title, self.release_date.year)
        return self.title

    def fully_qualified_name(self):
        if self.parent:
            return "%s > %s" % (self.parent.fully_qualified_name(),
                                self.compact_name())
        else:
            return self.compact_name()

    parent = models.ForeignKey("self", related_name="children",
                               blank=True, null=True)

    metadata = models.OneToOneField("ContentMetadata", blank=True, null=True)

    #--------------------------------- Content Path --------------------------#

    path = models.FilePathField(path=settings.VIDEO_PATH, recursive=True,
                                blank=True, max_length=512)

    def get_child_files(self):
        """Return absolute paths of files under this ContentNode."""
        path = self.path
        if os.path.isfile(path):
            return [path]
        else:
            paths = (os.path.join(path, p) for p in os.listdir(path))
            paths = [p for p in paths if os.path.isfile(p)]
            paths.sort()
            return paths

    def get_child_urls(self):
        """Return (url, basename) pairs for each child file."""
        # TODO(rnk): Make sure these are escaped correctly.
        return [(p.replace(settings.VIDEO_PATH, settings.VIDEO_URL),
                 os.path.basename(p))
                for p in self.get_child_files()]

    #------------------------------- Cover Art -------------------------------#

    cover_art = models.ImageField(upload_to='venclave/cover_art/%Y/%m/%d',
                                  blank=True, null=True)

    #------------------------------ Download Count ---------------------------#

    downloads = models.IntegerField(default=0, editable=False)

    #--------------------------------- Tags ----------------------------------#

    tags = models.ManyToManyField(Tag, blank=True)

    created = models.DateTimeField(auto_now_add=True, editable=False)
    updated = models.DateTimeField(auto_now=True, editable=False)

    def date_added_string(self): return datetime_string(self.created)
    date_added_string.short_description = 'date added'

    #------------------------------ Other Stuff ------------------------------#

    class Meta:
        get_latest_by = 'created'
        ordering = ('title',)

    @models.permalink
    def get_absolute_url(self):
        return ('django.views.generic.list_detail.object_detail',
                (str(self.id),), {'queryset': ContentNode.objects,
                                  'template_name': 'content_detail.html'})

    SEARCHABLE_FIELDS = ('title', 'metadata__imdb__directors__name',
                         'metadata__imdb__actors__name')
