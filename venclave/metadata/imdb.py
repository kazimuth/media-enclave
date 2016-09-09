import os
import re
import logging
import urllib
import copy
import traceback

from BeautifulSoup import BeautifulSoup as B
import Image

from django.conf import settings
from menclave.venclave import models

import common

def imdb_cleanup_markup(page):
    """Not needed. Was using a crappy version of BeautifulSoup"""
    page = re.sub('<script.*?</script>', '', page)
    page = page.replace('rate""', 'rate"').replace('"src', '" src')
    page = re.sub('<noscript>.*?</noscript>', '', page, re.M)
    return page


def is_valid_image(image_file):
    if not os.path.exists(image_file):
        return False
    try:
        img = Image.open(image_file)
        img.verify()
    except Exception, e:
        logging.info("Bad image file: %r", image_file)
        traceback.print_exc(e)
        return False
    else:
        return True


# IMDB TODO
# - Parse AKA's in search results
# - Match missing special characters (ex: Amelie)
# - Solve unicode issues methodically

imdb_title_pattern = re.compile('^/title/tt(?P<imdb_id>\d{7})/$')
def imdb_find_id(title, year=None):
    title = title.decode('utf8')

    url = u'http://www.imdb.com/find?%s'
    data = {'s': 'tt',
            'q': title.encode('latin1')}

    try:
        url = url % urllib.urlencode(data)
        logging.info("Executing IMDB regular search for '%s' at '%s'" % (title, url))
        result_url, page = common.get_page(url)

        result_url = result_url.replace('http://www.imdb.com', '')
        result_url_match = imdb_title_pattern.match(result_url)
        if result_url_match:
            # IMDb saw fit to redirect us to the thing we searched for. Let's
            # trust them?
            logging.info("IMDb redirected us to '%s', trusting them." % result_url)
            return result_url_match.groupdict()['imdb_id']

        # BeautifulSoup can't handle hex entities. Massage them into decimal.
        hexentityMassage = copy.copy(B.MARKUP_MASSAGE)
        hexentityMassage = [(re.compile('&#x([^;]+);'),
                             lambda m: '&#%d;' % int(m.group(1), 16))]

        #page = imdb_cleanup_markup(page)
        document = B(page, convertEntities=B.HTML_ENTITIES,
                     markupMassage=hexentityMassage)

        links = document.findAll('a', attrs={'href': re.compile('^/title/tt\d{7}/$')})
        for link in links:
            link_title = link.string
            if not link_title:
                continue

            if not common.title_match(title, link_title):
                logging.info("Skipping IMDB link title '%s' because it didn't match '%s'" % (link_title, title))
                continue

            link_year = link.nextSibling

            if not isinstance(link_year, basestring):
                continue

            link_year = link_year.strip()
            link_year_match = re.match('\((?P<year>\d{4}).*?\)', link_year)
            link_year = link_year_match.groupdict()['year'] if link_year_match else None

            if not link_year:
                continue

            if year and link_year != year:
                logging.info("Link '%s's year '%s' doesn't match '%s'." % (link_title, link_year, year))
                continue

            imdb_url = link.get('href')
            imdb_match = re.match('^/title/tt(?P<imdb_id>\d{7})/', imdb_url)
            logging.info("Found match for '%s (%s)': '%s (%s)'" % (title, year, link_title, link_year))
            # We know this because the nodes were selected with this regex.
            assert imdb_match
            return imdb_match.groupdict()['imdb_id']
        logging.error("Found no matches for '%s'" % title)
    except Exception, e:
        logging.error("Couldn't get IMDB regular search for '%s'" % title)
        traceback.print_exc(e)
    return None

def imdb_parse_page_metadata(imdb_id):
    url = u'http://www.imdb.com/title/tt%s/combined' % imdb_id

    try:
        logging.info("Looking up '%s'" % url)
        _, page = common.get_page(url)

        # BeautifulSoup can't handle hex entities. Massage them into decimal.
        hexentityMassage = copy.copy(B.MARKUP_MASSAGE)
        hexentityMassage = [(re.compile('&#x([^;]+);'),
                             lambda m: '&#%d;' % int(m.group(1), 16))]

        document = B(page, convertEntities=B.ALL_ENTITIES,
                     markupMassage=hexentityMassage)

        metadata = {}

        # Grab the poster
        poster_node = document.findChild('img', attrs={'id': 'primary-poster'})
        poster_url = poster_node.get('src') if poster_node else None
        if poster_url:
            logging.info("Found IMDb Poster URL: '%s'" % poster_url)
            # IMDb Poster URLs work like this:
            # http://ia.media-imdb.com/images/M/MV5BOTI5ODc3NzExNV5BMl5BanBnXkFtZTcwNzYxNzQzMw@@._V1._SX214_CR0,0,214,314_.jpg
            # Everything after the @@ is a format command.
            # ._V1 not sure
            # ._SX214 format width 214 pixels
            # ._SY214 format height 214 pixels
            # _CR0,0,214,214_ not sure

            # So to collect our images at X by Y, just replace 'SX\d+' by the
            # desired width. The combined details page defaults to a small
            # thumbnail.

            # Eliminate height restrictions.
            poster_url = re.sub('_SY\d+', '', poster_url)

            desired_width = settings.IMDB_THUMBNAIL_WIDTH

            # Replace height restriction with our desired height.
            poster_url = re.sub('\._SX\d+', "._SX%d" % desired_width, poster_url)

            metadata['imdb_cover_uri'] = poster_url
            metadata['imdb_cover_width'] = desired_width

        info_nodes = document.findAll('div', attrs={'class': re.compile('^info( stars)?$')})

        def take_first_string(contents):
            for item in node_content.contents:
                if isinstance(item, basestring):
                    return unicode(item.strip())
            return None

        for node in info_nodes:
            node_title = node.findChild('h5')
            node_title = node_title.string if node_title else None
            node_content = node.findChild('div', attrs={'class': re.compile('^(info-content|starbar-meta)$')})

            if not node_title or not node_content:
                continue

            if node_title == 'User Rating:':
                rating_node = node_content.findChild('b')
                rating_match = re.match("(?P<rating>[0-9.]+)/10", rating_node.string.strip()) \
                    if rating_node and rating_node.string else None
                if rating_match:
                    try:
                        metadata['imdb_rating'] = float(rating_match.groupdict()['rating'])
                    except Exception, e:
                        logging.error("Couldn't parse rating: '%s'" % rating_match.groupdict()['rating'])
            elif node_title == 'Director:':
                metadata['imdb_directors'] = [unicode(subnode.string)
                                              for subnode in node_content.findAll('a')
                                              if subnode.string]
            elif node_title == 'Writers:':
                metadata['imdb_writers'] = [unicode(subnode.string)
                                            for subnode in node_content.findAll('a')
                                            if subnode.string]
            elif node_title == 'Release Date:':
                release_date = take_first_string(node_content.contents)
                if release_date:
                    metadata['imdb_releasedate'] = release_date
            elif node_title == 'Genre:':
                # Only keep links that match /Sections/Genres/
                metadata['imdb_genres'] = [unicode(subnode.string)
                                           for subnode in node_content.findAll('a', attrs={'href': re.compile('^/Sections/Genres/')})
                                           if subnode.string]
            elif node_title == 'Plot:':
                outline = take_first_string(node_content.contents)
                if outline:
                    metadata['imdb_outline'] = outline
            elif node_title == 'Tagline:':
                tagline = take_first_string(node_content.contents)
                if tagline:
                    metadata['imdb_tagline'] = tagline
            elif node_title == 'Runtime:':
                runtime = take_first_string(node_content.contents)
                runtime_match = re.match("(?P<length>\d+) mins?.?", runtime) if runtime else None
                if runtime_match:
                    metadata['imdb_runtime'] = int(runtime_match.groupdict()['length'])
        cast_table = document.findChild('table', attrs={'class':'cast'})

        cast = []
        actor_nodes = cast_table.findAll('tr') if cast_table else []
        for actor_node in actor_nodes:
            actor = actor_node.findAll('a', attrs={'href': re.compile('^/name/')})
            character = actor_node.findAll('a', attrs={'href': re.compile('^/character/')})
            if len(character) == 0 or len(actor) == 0:
                continue
            if len(actor) == 2:
                actor = [actor[1]]
            actor = actor[0]
            character = character[0]
            if actor.string and character.string:
                cast.append((unicode(actor.string), unicode(character.string)))
        if len(cast) > 0:
            metadata['imdb_actors'] = cast
        return metadata
    except Exception, e:
        logging.error("Couldn't lookup IMDb metadata for '%s'" % imdb_id)
        traceback.print_exc(e)
    return None

def imdb_metadata_search(content):
    """Attempt to lookup the IMDB page for a ContentNode if we do not know its
    IMDB ID. Parses the results of the IMDB Advanced Search page. Deprecated"""

    name = content.simple_name().encode('utf-8')
    title, year = common.detect_title_year(name)

    logging.info("Finding IMDB ID for content named '%s'" % name)

    if year is None:
        logging.info("Couldn't split '%s' into title/year, skipping IMDb ID detection." % name)
        return None

    year = int(year)

    years = "%d,%d" % (year - 1, year + 1)

    url = u'http://www.imdb.com/List'
    url = u'http://www.imdb.com/search/title?'

    data = {'title': title,
            'release_date': years}

    try:
        url = url + urllib.urlencode(data)
    except Exception, e:
        logging.error("Could not URL encode %s" % str(data))
        return None
    data = None
    _, page = common.get_page(url, data)

    if page is None:
        logging.info("Couldn't get IMDb search page for '%s'" % name)
        return None

    # Cleanup dumbass IMDB stuff
    page = page.replace('rate""', 'rate"').replace('"src', '" src')

    document = B(page)

    results = document.findAll('tr', attrs={'class': re.compile('detailed')})


    for result_node in results:
        extras = {}

        link = result_node.findChild('a')
        if link is None:
            logging.error("Could not get link node of result for '%s', skipping." % name)
            continue

        extras['imdb_uri'] = imdb_uri = link.get('href')
        imdb_id_match = re.match('/title/(?P<imdb_id>tt[0-9]+)/*', imdb_uri)
        if not imdb_id_match:
            continue

        extras['imdb_id'] = imdb_id_match.groupdict()['imdb_id']

        imdb_name = link.get('title')
        imdb_title, imdb_year = common.detect_title_year(imdb_name)
        imdb_title = imdb_title.encode('utf-8')

        extras['imdb_canonical_title'] = imdb_name
        extras['imdb_title'] = imdb_name
        if imdb_year is not None:
            extras['imdb_year'] = imdb_year

        if not common.title_match(title, imdb_title):
            logging.info("Skipping IMDB title '%s' because it didn't match '%s'" % (imdb_title, title))
            continue

        thumb_node = result_node.findChild('td', attrs={'class':'image'})
        thumb_image = thumb_node.findChild('img') if thumb_node is not None else None
        if thumb_image:
            extras['imdb_thumb_uri'] = thumb_image.get('src')
            extras['imdb_thumb_width'] = thumb_image.get('width')
            extras['imdb_thumb_height'] = thumb_image.get('height')

        runtime_node = result_node.findChild('span', attrs={'class': 'runtime'})
        if runtime_node:
            runtime_match = re.match("(?P<length>\d+) mins.", runtime_node.string)
            if runtime_match:
                extras['imdb_length'] = int(runtime_match.groupdict()['length'])

        outline_node = result_node.findChild('span', attrs={'class': 'outline'})
        if outline_node and outline_node.string:
            extras['imdb_outline'] = outline_node.string.strip()

        genre_node = result_node.findChild('span', attrs={'class': 'genre'})
        if genre_node:
            extras['imdb_genres'] = [genre.string for genre in genre_node.findAll('a')]

        rating_list = result_node.findChild('div', attrs={'class': re.compile('rating-list')})
        if rating_list is not None:
            rating_id = rating_list.get('id')
            # rating_id is formatted like:
            # tt0463854|imdb|7.1|7.1|advsearch
            elts = rating_id.split('|')

            if len(elts) < 2 or elts[1] != 'imdb':
                logging.warning("IMDB has changed. Got rating-list that is '%s' for '%s'" % (rating_id, name))
                continue

            imdb_id = elts[0]
            if imdb_id != extras['imdb_id']:
                logging.warning("WARNING: Rating IMDB ID does not match the one we got from the link node.")

            if len(elts) > 2:
                imdb_rating = elts[3]
                try:
                    imdb_rating = float(imdb_rating)
                    extras['imdb_rating'] = imdb_rating
                except Exception, e:
                    logging.error("Exception while parsing rating: %s" % e)
        # If we got here, we have an ID and we should return all the metadata we
        # found.
        return extras
    return None

def update_imdb_metadata(node, force=False, erase=False):
    try:
        name = node.simple_name().encode('utf-8')
        title, year = common.detect_title_year(name)
        imdb = node.metadata.imdb
        imdb_id = imdb.imdb_id if imdb else None

        if not imdb_id or erase:
            imdb_id = imdb_find_id(title, year)
            if not imdb_id:
                return False
        elif not force:
            logging.info("IMDb metadata already found for '%s', skipping." % node)
            return True

        # If we already have an IMDB node with this IMDB id and we're not
        # erasing existing data, we don't need to rescrape the page.
        if not force and not erase:
            try:
                imdb = models.IMDBMetadata.objects.get(imdb_id=imdb_id)
            except models.IMDBMetadata.DoesNotExist:
                # We don't have it, so continue with the scraping.
                pass
            else:
                logging.info("Found exsting IMDBMetadata for '%s'" % node)
                node.metadata.imdb = imdb
                node.metadata.save()
                node.save()
                return True

        (imdb, _) = models.IMDBMetadata.objects.get_or_create(imdb_id=imdb_id)
        imdb.imdb_id = imdb_id
        imdb.imdb_uri = u'http://www.imdb.com/title/tt%s/' % imdb_id
        imdb.save()

        fetched = imdb_parse_page_metadata(imdb_id)

        if not fetched:
            logging.error("Couldn't lookup IMDB metadata for '%s'" % node)
            return False

        if 'imdb_genres' in fetched:
            for genre in fetched['imdb_genres']:
                (gnode, _) = models.Genre.objects.get_or_create(name=genre)
                gnode.save()
                imdb.genres.add(gnode)

        if 'imdb_directors' in fetched:
            for director in fetched['imdb_directors']:
                (dnode, _) = models.Director.objects.get_or_create(name=director)
                dnode.save()
                imdb.directors.add(dnode)

        if 'imdb_actors' in fetched:
            for pos, (actor, role) in enumerate(fetched['imdb_actors']):
                (anode, _) = models.Actor.objects.get_or_create(name=actor)
                anode.save()
                (rnode, _) = models.Role.objects.get_or_create(actor=anode,
                                                               imdb=imdb,
                                                               role=role,
                                                               bill_pos=pos+1)
                rnode.save()


        # TODO Handle
        # imdb_releasedate
        # imdb_writers
        # imdb_tagline

        if 'imdb_cover_uri' in fetched:
            cover_uri = fetched['imdb_cover_uri']
            cover_width = fetched['imdb_cover_width']
            _, ext = os.path.splitext(cover_uri)
            saved_name = "%s_%s%s" %  (imdb_id, cover_width, ext)

            storage_path = os.path.join(imdb.thumb_image.field.upload_to, saved_name)
            storage_abs_path = os.path.join(settings.MEDIA_ROOT, storage_path)

            try:
                if is_valid_image(storage_abs_path):
                    logging.info("IMDb thumb image already exists.")
                    imdb.thumb_image = storage_path
                    # Force Django to read the image width and height.
                    # Sometimes it tries to be lazy about reading this data,
                    # which can cause PIL-related exceptions during template
                    # rendering.
                    if imdb.thumb_width == 0 or imdb.thumb_height == 0:
                        raise ValueError("Invalid image width and height")
                else:
                    saved_name, _ = urllib.urlretrieve(cover_uri, storage_abs_path)
                    assert (os.path.realpath(saved_name) ==
                            os.path.realpath(storage_abs_path))
                    if is_valid_image(saved_name):
                        # Store the source URI used
                        imdb.thumb_uri = cover_uri
                        imdb.thumb_image = storage_path
                        # thumb_width and thumb_height are filled automatically
            except Exception, e:
                logging.error("Couldn't lookup IMDb cover from given URI: %s" %
                              fetched['imdb_cover_uri'])
                traceback.print_exc(e)
            else:
                logging.info("Fetched thumbnail from: %s" %
                             fetched['imdb_cover_uri'])

        if 'imdb_outline' in fetched:
            imdb.plot_outline = fetched['imdb_outline']

        if 'imdb_runtime' in fetched:
            imdb.length = fetched['imdb_runtime']

        if 'imdb_rating' in fetched:
            imdb.rating = fetched['imdb_rating']

        # fetched = imdb_metadata_search(node)
        # if not fetched:
        #     logging.error("Couldn't lookup IMDB metadata for '%s'" % node)
        #     return False
        # # If success, guaranteed to have the imdb_id, imdb_uri, and imdb_canonical_title
        # imdb.imdb_id = fetched['imdb_id']
        # imdb.imdb_uri = fetched['imdb_uri']
        # imdb.imdb_canonical_title = fetched['imdb_canonical_title']
        # imdb.save()

        #     # Might have these as well. Don't want to overwrite existing stuff.
        # if 'imdb_year' in fetched:
        #     imdb.release_year = fetched['imdb_year']
        # if 'imdb_thumb_uri' in fetched:
        #     imdb.thumb_uri = fetched['imdb_thumb_uri']
        #     imdb.thumb_uri_width = fetched.get('imdb_thumb_width', 0)
        #     imdb.thumb_uri_height = fetched.get('imdb_thumb_height', 0)

        # if 'imdb_genres' in fetched:
        #     for genre in fetched['imdb_genres']:
        #         (gnode, _) = models.Genre.objects.get_or_create(name=genre)
        #         gnode.save()
        #         imdb.genres.add(gnode)

        imdb.save()
        node.metadata.imdb = imdb
        node.metadata.save()
        node.save()
        return True
    except Exception, ex:
        logging.error("Could not update metadata for '%s'. Got exception: %s" % (node, ex))
        traceback.print_exc()
    return False
