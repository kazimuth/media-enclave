import logging
import traceback
import re
import urllib
import copy

from BeautifulSoup import BeautifulSoup as B

from menclave.venclave import models
import common


def rottentomatoes_repair_markup(page):
    """Repair the page as much as possible. Remove <script> and <noscript>
    tags. Fix strange occurences of '</<'"""
    page = page.replace('\n','').replace('\t','')
    page = re.sub('<noscript>.*?</noscript>', '', page)
    page = re.sub('<script.*?</script>', '', page)
    page = page.replace('</<', '<')
    return page

rottentomatoes_id_pattern = re.compile('/m/(?P<id>.*?)/')
def rottentomatoes_find_id_by_imdb(imdb_id):
    url = u"http://www.rottentomatoes.com/alias?type=imdbid&s=%s" % imdb_id
    logging.info("Searching RT with IMDB ID: ''%s'" % url)

    try:
        request_url, page = common.get_page(url)
    except Exception, e:
        logging.error("Got exception while opening page: %s" % e)
        return None

    id_match = rottentomatoes_id_pattern.search(request_url)
    if not id_match:
        logging.error("Could not find RT ID in '%s'" % request_url)
        return None
    logging.info("Found RT ID page via IMDB metadata: '%s'" % id_match.groupdict()['id'])
    return id_match.groupdict()['id']

def rottentomatoes_find_id(title, year=None, imdb_id=None):

    # Find the content by search.
    url = u"http://www.rottentomatoes.com/search/movie.php?%s"
    title_latin1 = title.encode('latin1')
    data = {'searchby': 'movies',
            'search': title_latin1}

    try:
        url = url % urllib.urlencode(data)
        logging.info("Executing RT regular search for '%s' at '%s'" % (title, url))
        result_url, page = common.get_page(url)

        # BeautifulSoup can't handle hex entities. Massage them into decimal.
        hexentityMassage = copy.copy(B.MARKUP_MASSAGE)
        hexentityMassage = [(re.compile('&#x([^;]+);'),
                             lambda m: '&#%d;' % int(m.group(1), 16))]

        #page = imdb_cleanup_markup(page)
        document = B(page, convertEntities=B.HTML_ENTITIES,
                     markupMassage=hexentityMassage)

        results_ul = document.findChild('ul', attrs={'id': re.compile('movie_results_ul')})
        results = (results_ul.findAll('li', attrs={'class': re.compile('media_block')})
                   if results_ul else None)

        if results is None:
            logging.error("Couldn't lookup RT ID for '%s (%s)'" % (title, year))
            return None

        for result_node in results:
            # Scope in on the content div, because otherwise we get the poster
            # image.
            content_div = result_node.findChild(
                'div', attrs={'class': re.compile('media_block_content')})
            link = content_div.findChild('a', attrs={'href': rottentomatoes_id_pattern})

            link_title = link.string if link else None
            if not link_title:
                logging.error("Couldn't find RT result link title. Skipping")
                continue

            titles = []

            # Try the original title
            titles.append(link_title)

            # Rotten Tomatoes annoyingly embeds the AKAs in the title in parens following the head title.
            # For example:
            # - Batoru rowaiaru II: Chinkonka (Battle Royale II)
            # - Battle Royale (Batoru Rowaiaru)
            endparen_match = re.search("\(([^\(\)]+)\)$", link_title)

            while endparen_match:
                titles.append(endparen_match.groups()[0])
                # Strip out the ending (title) and any spaces before it.
                link_title = re.sub("\s*\(([^\(\)]+)\)$", '', link_title)
                endparen_match = re.search("\(([^\(\)]+)\)$", link_title)

                # Add the final version of the title with the AKAs removed to
                # the title list.
                if not endparen_match:
                    titles.append(link_title)

            found_title = None
            for aka in titles:
                if not common.title_match(title, aka):
                    try:
                        logging.warning(u"Skipping RT title '%s' because it didn't match '%s'" % (aka, title))
                    except Exception, e:
                        traceback.print_exc(e)
                    continue
                else:
                    logging.info("Found RT title match '%s' for '%s'" % (aka, title))
                found_title = aka
                break

            if not found_title:
                continue

            span_year = result_node.findChild('span', attrs={'class': re.compile('movie_year')})
            link_year = unicode(span_year.string) if span_year and span_year.string else None
            link_year = link_year.strip(' ()')

            if year and link_year != year:
                logging.info("Link '%s's year '%s' doesn't match '%s'." %
                             (link_title, link_year, year))
                continue

            # Get RT ID
            link_href = link.get('href')
            link_match = rottentomatoes_id_pattern.match(link_href)
            assert link_match # guaranteed
            return link_match.groupdict()['id']
    except Exception, e:
        traceback.print_exc(e)
        logging.error("Couldn't lookup RT ID for '%s (%s)'" % (title, year))
        pass

    # As a fallback, try to determine the ID from the IMDB ID. This can be
    # faulty at times because the RT database seems to have incorrect mappings
    # for a lot of titles.
    logging.info("No RT ID found by search. Falling back on IMDB ID lookup.")
    rt_id = rottentomatoes_find_id_by_imdb(imdb_id) if imdb_id else None

    if rt_id:
        return rt_id

    return None

def rottentomatoes_parse_page(rt_id):
    metadata = {}

    try:
        url = u'http://www.rottentomatoes.com/m/%s/' % rt_id
        _, page = common.get_page(url)
    except Exception, e:
        logging.error("Got exception while opening page: %s" % e)
        return None

    if not page:
        logging.error("Couldn't get RT page for '%s'" % rt_id)
        return None

    page = rottentomatoes_repair_markup(page)
    doc = B(page)

    poster_area = doc.findChild('div', attrs={'class': 'movie_poster_area'})

    if not poster_area:
        logging.error("Page lookup by IMDb ID failed for '%s'" % rt_id)
        return None

    poster_link = poster_area.findChild('a')
    poster_image = poster_link.findChild('img') if poster_link else None

    if not poster_link or not poster_image:
        logging.error("Could not find poster for '%s'" % rt_id)
        return None

    metadata['rt_thumb_uri'] = poster_image.get('src')
    metadata['rt_thumb_width'] = poster_image.get('width')
    metadata['rt_thumb_height'] = poster_image.get('height')

    movie_content = doc.findChild('div', attrs={'class':'movie_content_area'})

    all_critics = movie_content.findChild(attrs={'id': 'all-critics-numbers'}) if movie_content else None
    critic_meter = all_critics.findChild('span', attrs={'id': 'all-critics-meter'}) if all_critics else None
    if critic_meter:
        try:
            metadata['rt_all_percent'] = int(critic_meter.string)
            critic_class = critic_meter.get('class')
            metadata['rt_all_fresh'] = True if 'fresh' in critic_class or 'certified' in critic_class else False
        except:
            logging.warning("Found no all-critics-numbers for '%s'" % rt_id)

    top_critics = movie_content.findChild(attrs={'id': 'top-critics-numbers'}) if movie_content else None
    # Note, even though the span is in the top-critics-numbers, its id is still 'all-critics-meter'
    critic_meter = top_critics.findChild('span', attrs={'id': 'all-critics-meter'}) if top_critics else None

    if critic_meter:
        try:
            metadata['rt_top_percent'] = int(critic_meter.string)
            critic_class = critic_meter.get('class')
            metadata['rt_top_fresh'] = True if 'fresh' in critic_class or 'certified' in critic_class else False
        except:
            logging.warning("Found no all-critics-numbers for '%s'" % rt_id)
    metadata['rt_directors'] = [director.string for director in doc.findAll('a', attrs={'rel': 'v:directedBy'})]

    # The roles are sometimes cut-off.
    actors = []
    for anode in doc.findAll('a', attrs={'rel': 'v:starring'}):
        actor_name = anode.string
        role_div = anode.parent
        role_span = role_div.findChild('span', attrs={'class': 'characters'})
        actor_role = (''.join(s for s in role_span.contents
                             if isinstance(s, basestring))
                      if anode.nextSibling else '')
        # Sometimes they aren't matched
        actor_role = re.sub('^\(', '', actor_role)
        actor_role = re.sub('\)$', '', actor_role)
        actors.append((actor_name,actor_role))
    metadata['rt_actors'] = actors

    return metadata

def update_rottentomatoes_metadata(node, force=False):
    try:
        logging.info("Looking up RT metadata for '%s'" % node)
        rt = node.metadata.rotten_tomatoes

        if rt and not force:
            logging.info("RT metadata already present for '%s'. Skipping." % node)
            return True

        name = node.simple_name()
        title, year = common.detect_title_year(name)

        rt_id = rt.rt_id if rt else None
        if not rt_id:
            imdb_id = node.metadata.imdb.imdb_id if node.metadata.imdb else None
            rt_id = rottentomatoes_find_id(title, year, imdb_id=imdb_id)
            if not rt_id:
                return False
        elif not force:
            logging.info("RT metadata already found for '%s', skipping." % node)
            return True

        # If we already have an RT node with this RT id and we're not erasing
        # existing data, we don't need to rescrape the page.
        if not force:
            try:
                rt = models.RottenTomatoesMetadata.objects.get(rt_id=rt_id)
            except models.RottenTomatoesMetadata.DoesNotExist:
                # We don't have it, so continue with the scraping.
                pass
            else:
                logging.info("Found exsting RottenTomatoesMetadata for '%s'" % node)
                node.metadata.rottentomatoes = rt
                node.metadata.save()
                node.save()
                return True

        (rt, _) = models.RottenTomatoesMetadata.objects.get_or_create(rt_id=rt_id)
        rt.rt_uri = u'http://www.rottentomatoes.com/m/%s/' % rt_id
        rt.save()

        metadata = rottentomatoes_parse_page(rt.rt_id)

        if metadata is None:
            logging.error("Could not find metadata for '%s'" % node)
            return False

        if 'rt_thumb_uri' in metadata:
            rt.thumb_uri = metadata['rt_thumb_uri']
            try:
                rt.thumb_width = int(metadata['rt_thumb_width'])
                rt.thumb_height = int(metadata['rt_thumb_height'])
            except:
                pass

        if 'rt_top_percent' in metadata:
            rt.top_critics_percent = metadata['rt_top_percent']
            rt.top_critics_fresh = metadata['rt_top_fresh']

        if 'rt_all_percent' in metadata:
            rt.all_critics_percent = metadata['rt_all_percent']
            rt.all_critics_fresh = metadata['rt_all_fresh']

        #TODO(XXX) handle rt_directors and rt_actors

        rt.save()
        node.metadata.rotten_tomatoes = rt
        node.metadata.save()
        node.save()
        return True
    except Exception, ex:
        traceback.print_exc()
        logging.error("Could not update metadata for '%s'. Got exception: %s" % (node, ex))
    return False
