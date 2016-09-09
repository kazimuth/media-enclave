import re
import logging
import traceback

from BeautifulSoup import BeautifulSoup as B

from menclave.venclave import models
import common


def lookup_metacritic_metadata(content):
    metadata = {}
    name = content.simple_name()
    title, year = common.detect_title_year(name)

    url_kind_map = { models.KIND_MOVIE: 'http://www.metacritic.com/search/movie/%s/results',
                     models.KIND_SERIES: 'http://www.metacritic.com/search/tv/%s/results',
                     models.KIND_TV: 'http://www.metacritic.com/search/tv/%s/results',
                     models.KIND_SEASON: 'http://www.metacritic.com/search/tv/%s/results' }

    url = url_kind_map[content.kind]

    # Remove special characters that the regular metacritic search seems to
    # remove anyway.
    title_utf8 = title.encode('utf-8')
    title_stripped = re.sub('[!@#$%^&*();.,?]', '', title_utf8).strip() #title.replace('-','').replace(':','').replace('(','').replace(')','')
    title_stripped = re.sub('[:\-\s]', '+', title_stripped)
    #title_stripped = title_stripped.replace(' ', '+')

    # Fake encode the title, strip out the a=
    #title_stripped = re.sub('^a=', '', urllib.urlencode({'a': title_stripped}))

    url = url % title_stripped
    logging.info("Trying to search: %s" % url)
    _, page = common.get_page(url)

    if not page:
        logging.error("Couldn't get metacritic page for '%s'" % content)
        return None

    doc = B(page)

    # Get results
    results = doc.findAll('li', attrs={'class': re.compile('result')})

    for result in results:
        title_node = result.findChild('h3', attrs={'class': re.compile('product_title')})
        title_link = title_node.findChild('a') if title_node else None
        mc_title = title_link.string if title_link else None

        if not title_link or not mc_title:
            logging.warning("Could't find MC title link for result.")
            continue

        mc_title = mc_title.strip()

        if not common.title_match(title, mc_title):
            try:
                logging.warning(u"Skipping MC title '%s' because it didn't "
                                "match '%s'" % (mc_title, title))
            except Exception, e:
                traceback.print_exc(e)
            continue

        logging.info("Found a matching title, '%s' for '%s'" % (mc_title, title))

        mc_url = title_link.get('href')
        id_match = re.match('/(?P<type>movie|tv)/(?P<mc_id>.*)', mc_url)
        if not id_match:
            logging.warning("Could't find MC id from link '%s'." % mc_url)
            continue

        metadata['mc_uri'] = mc_url
        metadata['mc_id'] = id_match.groupdict()['mc_id']

        metascore_node = result.findChild('span', attrs={'class': re.compile('metascore')})
        metascore = metascore_node.string if metascore_node else None

        if metascore:
            metascore_class = metascore_node.get('class')
            score = 'unknown'
            if 'score_outstanding' in metascore_class:
                score = 'outstanding'
            elif 'score_favorable' in metascore_class:
                score = 'favorable'
            elif 'score_mixed' in metascore_class:
                score = 'mixed'
            elif 'score_unfavorable' in metascore_class:
                score = 'unfavorable'
            elif 'score_terrible' in metascore_class:
                score = 'terrible'
            elif 'score_tbd' in metascore_class:
                score = 'tbd'

            metadata['mc_status'] = score

            try:
                metadata['mc_score'] = int(metascore)
            except:
                logging.error("Couldn't convert metascore '%s' to integer." % metascore)

        return metadata
    return None

def update_metacritic_metadata(node, force=False):
    try:
        logging.info("Looking up MC metadata for '%s'" % node)
        mc = node.metadata.metacritic

        if mc is None:
            mc = models.MetaCriticMetadata()
        elif not force:
            logging.info("MC metadata already present for '%s'. Skipping." % node)
            return True

        metadata = lookup_metacritic_metadata(node)

        if metadata is None:
            logging.error("Could not find MC metadata for '%s'" % node)
            return False

        mc.mc_id = metadata['mc_id']
        mc.mc_uri = metadata['mc_uri']

        if 'mc_score' in metadata:
            mc.score = metadata['mc_score']
        if 'mc_status' in metadata:
            mc.status = metadata['mc_status']

        mc.save()
        node.metadata.metacritic = mc
        node.metadata.save()
        node.save()
        return True
    except Exception, ex:
        logging.error("Could not update metadata for '%s'. Got exception: %s" % (node, ex))
        traceback.print_exc()
    return False
