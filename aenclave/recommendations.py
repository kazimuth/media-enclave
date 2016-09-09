from django.template import RequestContext

from menclave.aenclave.models import Song
from menclave.aenclave.html import render_html_template

from menclave.aenclave import utils
from menclave.aenclave import json_response

import django
import django.conf
from menclave.aenclave import models
import datetime
from operator import itemgetter

# create one cluster entry.
def create_cluster_entry(songlist):
    cluster_weight = 100.0 / len(songlist)
    cluster_entry = models.Cluster(weight=cluster_weight)
    cluster_entry.save() # this one?
    cluster_entry.songs.add(*songlist)  # it gets mad because it expects 

# populate the DB with clusters.
# for now it's dumb and it just re-makes all of them.
def make_clusters():

    # for now: clear all clusters (this should overwrite them)
    models.Cluster.objects.all().delete()

    # clusters from playlists
    playlists = models.Playlist.objects.all()
    for i in range(0, len(playlists)):
        pl = playlists[i].songs.all()
        if len(pl) > 1:
            create_cluster_entry(pl)
   
    # clusters from queue history
    minute = datetime.timedelta(0,60)
    this_cluster = []
    play_history_objects = models.PlayHistory.objects.all().order_by(
        'queued_time')

    for i in range(0, len(play_history_objects)):
        if i == 0:
            continue
        timediff = (play_history_objects[i].queued_time - 
                    play_history_objects[i-1].queued_time)
        if timediff <= minute:
            if len(this_cluster) == 0:
                this_cluster.append(play_history_objects[i-1].song)
            this_cluster.append(play_history_objects[i].song)
        else:
            if len(this_cluster) > 1:
                # create a new cluster
                create_cluster_entry(this_cluster)
            this_cluster = []

# most recent cluster, i.e. whatever has been queued just now.
# just returns a list; doesn't create a Cluster object.
def get_latest_cluster(max_size):
    res = []
    play_history_objects = models.PlayHistory.objects
    start_id = play_history_objects.count() - max_size
    last_n = play_history_objects.filter(
        id__gt=start_id).order_by('-queued_time')

    minute = datetime.timedelta(0,60)
    res.append(last_n[0]) # we always want the most recent one.
    for i in range(0, len(last_n)-1):  # use [i+1] instead of [i-1] 
        this_pho = last_n[i]
        next_pho = last_n[i+1]
        timediff = this_pho.queued_time - next_pho.queued_time
        if timediff <= minute:
            res.append(next_pho)
        else:
            break

    res.reverse()
    return [pho.song for pho in res]

# in regular Python for now.
def recommend(cluster,n):
    related_clusters = []
    recommendations = {}
    for song in cluster:
        related_clusters += models.Cluster.objects.filter(songs=song)
    for rc in related_clusters:
        for song in rc.songs.all():
            recommendations[song] = rc.weight + recommendations.get(song,0)
    reclist = sorted(recommendations.items(),
                     key=itemgetter(1), reverse=True)
    reclist = [rec[0] for rec in reclist if rec[0] not in cluster]
    return reclist[:n]

def view_recommendations(request):
    form = request.REQUEST
    # Get the selected songs.
    #queued_songs = utils.get_song_list(form) # maybe better
    queued_songs = get_latest_cluster(10) # than this bc. they're queued.
    original_songs = ' '.join(str(song.id) for song in queued_songs)
    recommended_songs = recommend(queued_songs, 10)
    return render_html_template('aenclave/recommendations.html', request,
                                {'song_list': recommended_songs,
                                 'original_songs': original_songs},
                                context_instance=RequestContext(request))

## for 6.867 - Recommendations
## this is what happens when a user marks some recommended songs as bad.
def bad_recommendations(request):
    form = request.REQUEST
    # get songs that were marked as bad
    bad_songs = utils.get_song_list(form, key='bad_songs')
    # get the original set of songs that were queued
    original_songs = utils.get_song_list(form, key='original_songs')
    # find the clusters that the two song lists have in common
    # and decrease their weights accordingly.
    related_clusters = []
    for song in original_songs:
        related_clusters += models.Cluster.objects.filter(songs=song)
    # now keep only those clusters that contain some song in bad_songs....
    bad_related_clusters = []
    for rc in related_clusters:
        for song in bad_songs:
            if song in rc.songs.all():
                bad_related_clusters.append(rc)
                break # we've already counted it more than once if necessary
    # WOW, THAT WAS A REALLY DUMB WAY TO DO IT.
    # TODO FIX THIS.
    # also TODO make this separate because we have to do this same thing
    # when boosting songs that did well.

    for brc in bad_related_clusters:
        brc.weight = brc.weight * 0.5
        brc.save()

    # record the data
    bad_rec_entry = models.BadRecs(bad_recs=len(bad_songs))
    bad_rec_entry.save()

    # Songs get removed from the table on the page.
    return json_response.json_success("Hooray!")

## what happens when someone queues a recommended song.
## (score for common cluster gets boosted)
def good_recommendations(request):
    form = request.REQUEST
    good_songs = utils.get_song_list(form)
    original_songs = utils.get_song_list(form, key='original_songs')
    
    related_clusters = []
    for song in original_songs:
        related_clusters += models.Cluster.objects.filter(songs=song)

    good_related_clusters = []
    for rc in related_clusters:
        for song in good_songs:
            if song in rc.songs.all():
                good_related_clusters.append(rc)
                break # we've already counted it more than once if necessary

    for grc in good_related_clusters:
        grc.weight = brc.weight * 2
        grc.save()

    # record data
    good_rec_entry = models.GoodRecs(good_recs=len(good_songs))
    good_rec_entry.save()

    return json_response.json_success("Yay!!!") # mostly for consistency.
    # not 100% sure this actually works....
    # TODO test it more.
