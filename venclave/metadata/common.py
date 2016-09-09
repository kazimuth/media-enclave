import re
import logging
import traceback
import mechanize
import cookielib

import unicodedata

def remove_accents(s):
    try:
        #from unidecode import unidecode
        #return unidecode(s)
        if not isinstance(s, unicode):
            s = s.decode('utf-8')  # Oh god, why are we guessing here?
        assert isinstance(s, unicode)
        nkfd_form = unicodedata.normalize('NFKD', s)
        only_ascii = nkfd_form.encode('ASCII', 'ignore')
    except Exception, e:
        logging.error("Couldn't strip accents from '%s'" % s)
        traceback.print_exc(e)
        return s
    else:
        return only_ascii

def make_search_term(term):
    punctuation = [',', '.', '!', ':', '/', '?']
    space_punctuation = ['\\-',]
    term = re.sub("[%s]" % ''.join(punctuation), '', term)
    term = re.sub("[%s]" % ''.join(space_punctuation), ' ', term)
    return term


def title_match(ours, theirs):

    # Returns true if the titles are the same
    # If the title starts with an article, look for it at the end of
    # the imdb title (e.g. 'Clockwork Orange, A')

    if ours == theirs:
        return True

    for p in ['A', 'An', 'The']:
        if ours.startswith(p + ' '):
            if ours[len(p)+1:] + ', ' + p == theirs:
                return True

    # Try stripping out punctuation
    punctuation = [',', '.', '!', ':', '/', '?']
    space_punctuation = ['\\-',]
    def normalize(phrase):
        norm = remove_accents(phrase)
        norm = re.sub("[%s]" % ''.join(punctuation), '', norm)
        norm = re.sub("[%s]" % ''.join(space_punctuation), ' ', norm)

        norm = norm.lower()
        norm = norm.replace('&', 'and') # Dumb & Dumber
        norm = norm.replace('drive', 'dr') # Mulholland Dr. (punctuation already stripped)
        norm = norm.replace('volume', 'vol') # Kill Bill: Vol. 1
        norm = norm.replace('theatre', 'theater')
        norm = re.sub('^the', '', norm) # The Ghosts of Girlfriends Past
        norm = re.sub('\s+', ' ', norm) # Star Wars: Episode I - The Phantom Menace (triple space caused by -)
        norm = norm.strip()
        return norm
    ours = normalize(ours)
    theirs = normalize(theirs)

    if ours == theirs:
        return True

    return False

def make_browser():
    # Browser
    br = mechanize.Browser()

    # Cookie Jar
    cj = cookielib.LWPCookieJar()
    br.set_cookiejar(cj)

    # Browser options
    br.set_handle_equiv(True)
    br.set_handle_gzip(True)
    br.set_handle_redirect(True)
    br.set_handle_referer(True)
    br.set_handle_robots(False)

    # Follows refresh 0 but not hangs on refresh > 0
    br.set_handle_refresh(mechanize._http.HTTPRefreshProcessor(), max_time=1)

    # Want debugging messages?
    #br.set_debug_http(True)
    #br.set_debug_redirects(True)
    #br.set_debug_responses(True)

    # logger = logging.getLogger("mechanize")
    # logger.addHandler(logging.StreamHandler(sys.stdout))
    # logger.setLevel(logging.INFO)

    # User-Agent (this is cheating, ok?)
    br.addheaders = [('User-agent', 'Mozilla/5.0 (X11; U; Linux i686; en-US; rv:1.9.0.1) Gecko/2008071615 Fedora/3.0.1-1.fc9 Firefox/3.0.1')]
    return br

def get_page(url, data=None):
    """Use mechanize to fetch a page."""
    br = make_browser()
    r = br.open(url, data)
    return r.geturl(), r.read()

# def GetPage(url, data=None):
#     """Use urllib to fetch a page. `data' is a dictionary query parameters."""
#     try:
#         if data is None:
#             request = urllib2.Request(url)
#         else:
#             d = urllib.urlencode(data)
#             request = urllib2.Request(url,d)
#         response = urllib2.urlopen(request)
#         out = response.read()
#         return out
#     except:
#         return None

titleyearPattern = re.compile("^(?P<title>.*) \((?P<year>\d{4}).*?\)$")
def detect_title_year(name):
    match = titleyearPattern.search(name)
    if not match:
        return name, None
    match = match.groupdict()
    return match['title'], match['year']
