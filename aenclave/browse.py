from django.template import RequestContext
from django.views.generic.list_detail import object_detail

from menclave.aenclave.models import Song
from menclave.aenclave.utils import get_song_list
from menclave.aenclave.html import render_html_template


#--------------------------------- Browsing ----------------------------------#

def browse_index(request):
    total_albums = Song.visibles.values('album').distinct().count()
    total_artists = Song.visibles.values('artist').distinct().count()
    return render_html_template('aenclave/browse_index.html', request,
                                {'total_albums': total_albums,
                                 'total_artists': total_artists},
                                context_instance=RequestContext(request))

def browse_albums(request, letter):
    if not letter.isalpha():
        letter = '#'
        matches = Song.visibles.filter(album__regex=r'^[^a-zA-Z]').order_by()
    else:
        letter = letter.upper()
        matches = Song.visibles.filter(album__istartswith=letter).order_by()
    albums = [item['album'] for item in matches.values('album').distinct()]
    return render_html_template('aenclave/browse_albums.html', request,
                                {'letter': letter, 'albums': albums},
                                context_instance=RequestContext(request))

def browse_artists(request, letter):
    if not letter.isalpha():
        letter = '#'
        matches = Song.visibles.filter(artist__regex=r'^[^a-zA-Z]').order_by()
    else:
        letter = letter.upper()
        matches = Song.visibles.filter(artist__istartswith=letter).order_by()
    artists = [item['artist'] for item in matches.values('artist').distinct()]
    return render_html_template('aenclave/browse_artists.html', request,
                                {'letter': letter, 'artists': artists},
                                context_instance=RequestContext(request))

def view_album(request, album_name):
    songs = Song.visibles.filter(album__iexact=album_name)
    songs = Song.annotate_favorited(songs, request.user)
    return render_html_template('aenclave/album_detail.html', request,
                                {'album_name': album_name,
                                 'song_list': songs},
                                context_instance=RequestContext(request))

def view_artist(request, artist_name):
    songs = Song.visibles.filter(artist__iexact=artist_name)
    songs = Song.annotate_favorited(songs, request.user)
    return render_html_template('aenclave/artist_detail.html', request,
                                {'artist_name': artist_name,
                                 'song_list': songs},
                                context_instance=RequestContext(request))

def view_song(request, object_id):
    return object_detail(object_id=object_id,
                         queryset=Song.objects,
                         template_name='song_detail.html')

def list_songs(request):
    songs = get_song_list(request.REQUEST)
    songs = Song.annotate_favorited(songs, request.user)
    return render_html_template('aenclave/list_songs.html', request,
                                {'song_list': songs},
                                context_instance=RequestContext(request))
