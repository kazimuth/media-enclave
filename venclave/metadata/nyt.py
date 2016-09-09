import logging
import urllib
import traceback

from BeautifulSoup import BeautifulSoup as B

import common

def lookup_nyt_review(content):
    name = content.simple_name().encode('utf-8')
    title, year = common.detect_title_year(name)

    url = 'http://movies.nytimes.com/gst/movies/msearch.html?%s'
    data = {'query': title}

    url = url % urllib.urlencode(data)
    _, page = common.get_page(url)

    if not page:
        logging.error("Couldn't get NYT search page for '%s'" % content)
        return None

    doc = B(page)

    entertainment_results = doc.findChild('div', attrs={'id':'entertainment_results'})
    results_container = entertainment_results.findChild('ol') if entertainment_results else None
    results = results_container.findChildren('li', recursive=False) if results_container else []

    for result in results:
        title_header = result.findChild('h3')
        title_link = title_header.findChild('a') if title_header else None
        nyt_title = title_link.string if title_link else None

        if not nyt_title:
            logging.warning("Couldn't find title node for '%s'" % title)
            continue

        # This sucks.
        nyt_title = nyt_title.replace(u'\xa0',' ')
        nyt_title = nyt_title.encode('utf-8')

        nyt_title, nyt_year = common.detect_title_year(nyt_title)

        if not common.title_match(title, nyt_title):
            try:
                logging.warning("Skipping NYT title '%s' because it didn't match '%s'" % (nyt_title, title))
            except Exception, e:
                import pdb
                pdb.set_trace()
                print e
            continue

        extra_links = result.findChild('ul')
        if extra_links:
            for link in extra_links.findChildren('a'):
                if link.string == "N.Y.Times Review":
                    return 'http://movies.nytimes.com%s' % link.get('href')
    return None

def update_nyt_metadata(node, force=False):
    try:
        logging.info("Looking up NYT metadata for '%s'" % node)
        if node.metadata.nyt_review is not None and not force:
            logging.info("NYT review already found. Skipping.")
            return True
        nyt_review = lookup_nyt_review(node)

        if nyt_review is None:
            return False

        logging.info("Found NYT review at: %s" % nyt_review)
        node.metadata.nyt_review = nyt_review
        node.metadata.save()
        node.save()
        return True
    except Exception, ex:
        logging.error("Could not update NYT metadata for '%s'. Got exception: %s" % (node, ex))
        traceback.print_exc()
    return False
