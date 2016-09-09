#!/usr/bin/python
# -*- coding: utf-8 -*-
# imdb.py

"""In general, IMDB parsing crap."""

from __future__ import with_statement

import codecs
import datetime
import os
import re

from menclave.venclave import models


DB_FILES = (
    'ratings.list',
    'movies.list',
    'genres.list',
    'plot.list',
    'directors.list',
    'actors.list',
    'actresses.list',
    'release-dates.list',
    'running-times.list',
)

DB_URL = "ftp://ftp.fu-berlin.de/pub/misc/movies/database/"


def parse_int(int_str):
    """Parse an int or return None."""
    try:
        return int(int_str)
    except (TypeError, ValueError):
        return None


class ImdbParser(object):

    def __init__(self, imdb_path):
        self.imdb_path = imdb_path

    def open_list(self, list_file):
        """Return a file handle of the specified .list file.

        It's not clear what character set the files are encoded with.  In some
        places, we believe it is the Windows codepage 1252 (look it up on
        Wikipedia).  cp1252 is like latin-1, except that it has extra
        characters, such as right single quote, which can be found in
        actors.list under "Brill, Steven"/"Knocked Up (2007)".  In other places,
        there are two byte control sequences which suggests UTF-8.
        """
        path = os.path.join(self.imdb_path, list_file)
        # TODO(rnk): It would be really hardcore if we could register an error
        # handler to try decoding with UTF-8 if cp1252 fails.
        return codecs.open(path, encoding='cp1252', errors='ignore')

    #============================ MOVIES =====================================#

    # parses a movies.list

    MOVIE_RE = "^(?P<title>.+?)\t+(?P<startyear>(?:\d{4}|\?{4}))(?:-(?P<endyear>(?:\d{4}|\?{4}))){0,1}$"

    def generate_movie_titles(self):
        """Parse movies.list and generate each movie title in turn."""
        movie_matcher = re.compile(self.MOVIE_RE)
        with self.open_list('movies.list') as f:
            for line in f:
                match = movie_matcher.match(line)
                if match:
                    title = match.group('title').strip()
                    yield title

    #============================ PLOT =======================================#

    # On IMDB multiple plot summaries can be contributed by different
    # authors. Plot summaries for a title are started with a line like:

    # MV: <title>

    # With <title> in standard IMDB format.
    # A plot summary is given by
    # PL: ...Line 1...
    # PL: ...Line 2...
    # PL: ...
    # PL: ...Line n...

    # BY: <author>

    # And multiple PL/BY groups can exist for the same MV. Different MV
    # entries are offset by:

    #-------------------------------------------------------------------------------

    PLOT_TITLE_RE = "^MV:\s(?P<title>.+)$"
    PLOT_PLOT_RE = "^PL:\s(?P<plot>.+)$"
    PLOT_AUTHOR_RE = "^BY:\s(?P<author>.+)$"

    def generate_plots(self):
        """Generates (title, [(author, plot)...]) pairs from plot.list."""
        re_title = re.compile(self.PLOT_TITLE_RE)
        re_plot = re.compile(self.PLOT_PLOT_RE)
        re_author = re.compile(self.PLOT_AUTHOR_RE)

        plot_index = {}

        with self.open_list('plot.list') as f:
            current_title = None
            current_plot = []
            current_plots = []

            for line in f:
                title_match = re_title.match(line)
                plot_match = re_plot.match(line)
                author_match = re_author.match(line)

                if title_match:
                    title = title_match.group('title').strip()
                    if current_title:
                        yield (current_title, current_plots)
                        current_plots = []
                    current_title = title
                elif plot_match:
                    plot = plot_match.group('plot')
                    current_plot.append(plot.strip())
                elif author_match:
                    author = author_match.group('author')
                    plot = (author, ' '.join(current_plot))
                    current_plot = []
                    current_plots.append(plot)

            # Remember to yield the final plot.
            if current_title:
                yield (current_title, current_plots)

    #============================ GENRES =====================================#

    # The genres file is a list of title and genre pairs. A title that has
    # multiple genres is simply listed twice. The title name is in
    # standard IMDB format and is separated from the genre by tabs.

    # As usual there is tons of !@#$ noise at the beginning of the file,
    # just to screw up people like us who try to parse it. The genres list
    # starts off with these lines:

    #8: THE GENRES LIST
    #==================

    GENRE_RE = "^(?P<title>.+?)\t+(?P<genre>.+)$"

    def generate_genres(self):
        """Generates (title, genre) pairs from the genres.list."""
        genre_matcher = re.compile(self.GENRE_RE)
        genre_index = {}
        all_genres = set()

        with self.open_list('genres.list') as f:

            # Skip to the point in the file where the genres actually start.
            for line in f:
                if line == "8: THE GENRES LIST\n":
                    break

            # Parse each genre line.
            for line in f:
                match = genre_matcher.match(line)

                if match:
                    title = match.group('title').strip()
                    genre = match.group('genre')
                    yield (title, genre)

    # TODO(rnk): Merge directors/actors/actresses parsing, since the file
    # formats are all the same.

    #============================ DIRECTORS ==================================#

    # In general the directors file is formatted like so:

    # "Director 1\t+Title 1"
    # "\t+Title2"
    # "\t+Title3"
    # ""
    # "Director 2\t+Title 1"
    # ""
    # etc

    # The file has a lot of noise at the beginning which is not part of
    # the list. The list itself is kicked off by the following lines:

    #Name			Titles
    #----			------

    # To skip the noise, we just hack it by detecting this line.

    # For grabbing the director's name max length (variable column size)
    DIRECTOR_START_RE="^(?P<director>.+?)\t+(?P<title>.+?)( +\((TV|V|VG)\))?$"
    DIRECTOR_CONTINUE_RE = "^\t+(?P<title>.+?)( +\((TV|V|VG)\))?$"

    def generate_directors(self):
        """Generates (title, director) pairs from directors.list."""
        start = re.compile(self.DIRECTOR_START_RE)
        continue_ = re.compile(self.DIRECTOR_CONTINUE_RE)

        with self.open_list('directors.list') as f:

            # Skip to where the directors start.
            for line in f:
                if line == "Name\t\t\tTitles\n":
                    f.next()  # Skip next line.
                    break

            for line in f:
                start_match = start.match(line)

                # Skip empty or non-matching noise lines.
                if not start_match: continue

                # This line is the start of a director section.
                director = start_match.group('director').strip()
                title = start_match.group('title').strip()
                yield (title, director)

                # Generate titles following this line with the same director.
                for line in f:
                    continue_match = continue_.match(line)
                    if not continue_match:
                        break
                    title = continue_match.group('title').strip()
                    yield (title, director)

    #============================= ACTORS ====================================#

    # "xxxxx"        = a television series
    # "xxxxx" (mini) = a television mini-series
    # [xxxxx]        = character name
    # <xx>           = number to indicate billing position in credits
    # (TV)           = TV movie, or made for cable movie
    # (V)            = made for video movie (this category does NOT include TV
    #                  episodes repackaged for video, guest appearances in
    #                  variety/comedy specials released on video, or
    #                  self-help/physical fitness videos)

    # The code for this is essentially copied from the code for directors, as the
    # .list files are in a very similar format.

    ACTOR_END_RE = ("\t+(?P<title>[^\t]+?)"
                    "( +\((TV|V|VG)\))?"
                    "( +\[(?P<role>.+)\])?"
                    "( +<(?P<bill_pos>\d+)>)?\n$")
    ACTOR_CONTINUE_RE = "^" + ACTOR_END_RE
    ACTOR_START_RE = "^(?P<actor>[^\t]+?)" + ACTOR_END_RE

    def generate_actors(self):
        """Generate (title, actor...) tuples from actors and actresses.list."""
        with self.open_list('actors.list') as f:
            for tup in self._generate_actors(f, 'M'):
                yield tup
        with self.open_list('actresses.list') as f:
            for tup in self._generate_actors(f, 'F'):
                yield tup

    def _generate_actors(self, f, sex):
        """Generate (title, actor...) tuples from the passed in file object."""
        start = re.compile(self.ACTOR_START_RE)
        continue_ = re.compile(self.ACTOR_CONTINUE_RE)

        # Skip until the actors start.
        for line in f:
            if line.strip() == "Name\t\t\tTitles":
                f.next()  # Skip next line.
                break

        # Parse and generate the pairs.
        for line in f:
            start_match = start.match(line)

            # Skip nonsense lines.
            if not start_match:
                continue

            # this line is the start of a actor
            # TODO(jslocum): Figure out what to do with roles.
            actor = start_match.group('actor')
            title = start_match.group('title')
            role = start_match.group('role')
            bill_pos = parse_int(start_match.group('bill_pos'))
            yield (title, actor, sex, role, bill_pos)

            # grab all extra titles following this line
            for line in f:
                continue_match = continue_.match(line)
                if not continue_match:
                    break
                title = continue_match.group('title')
                role = continue_match.group('role')
                bill_pos = parse_int(continue_match.group('bill_pos'))
                yield (title, actor, sex, role, bill_pos)

    # Various title formats:
    # TODO - fold these into a tests
    #'"'Allo 'Allo!" (1982)'
    #'"$treet, The" (2000) {Closet Cases (#1.4)}'
    #'"'Drehscheibe, Die'" (1964) {(1970-02-01)}'
    #'"10 Years Younger" (2004/II)'
    #'"106 & Park Top 10 Live" (2000) {The Pursuit of Happyness Preview}'
    #'"24" (2001) {9:00 p.m.-10:00 p.m. (#1.22)}'
    #'100 Sexiest Artists (2002) (TV)'
    #'100 Kilos (2001) (V)'
    #'110% Natural 3 (2002) (V)'
    #'110° in Tucson (2005) (V)'
    #'American Rhapsody, An (2001)'
    #'American Ruling Class, The (2005)'
    #"Ami de Vincent, L' (1983)"
    #'Vampiric Love Story, A (????)'
    #'"Zomergasten" (1988) {(#19.4)}'

    # Movie Title/Series Title (year) (V) (TV) {Episode Title (release date) (#season.episode)}
    #

    # from directors.list -- stupid docs are littered everywhere
    #"xxxxx"        = a television series
    #"xxxxx" (mini) = a television mini-series
    #(TV)           = TV movie, or made for cable movie
    #(V)            = made for video movie (this category does NOT include TV
    #                 episodes repackaged for video, guest appearances in
    #                 variety/comedy specials released on video, or
    #                 self-help/physical fitness videos)
    #(VG)           = video game

    # This bastard will parse the above examples.
    TITLE_RE = r"""(?x)                         # turn on verbose
                    ^                           # grab from start
                    (?:                         # get the title (nongreedy) either:
                    "(?P<series>.*?)"           #   quoted series title
                    |                           #     OR
                    (?P<movie>.*?)              #   movie name
                    )                           #
                    \s+                         # needs to be at least 1
                    \(                          # in parens
                    (?P<year>(?:\d{4}|\?{4}))   # grab the year
                    (?P<yearextra>.*?)          # and maybe other crap (non-greedy)
                    \)                          #
                    \s*                         # could be nothing more, so *
                    (?:{                        # optionally the curly brace part
                    (?P<episodetitle>.*?)       # non-greedy grab episode title
    #                \s+                         # WTF(rryan) leave commented
                    (?:\((?:                    # optionally, in parens - EITHER
                    \#(?P<season>\d+)\.         # hash, season number, dot
                    (?P<episode>\d+)            # episode number
                    |                           #   OR
                    (?P<date>\d{4}-\d{2}-\d{2}) # release date
                    )\)){0,1}                   # the paren statement is optional
                    }){0,1}                     # zero or one of the curly brace
                    (?P<extras>\s*\(.*?\))*     # any extra crap (TV), (V), etc.
                    $                           # end of string
                    """

    def parse_title(self, title):
        """
        Makes a good effort at parsing an IMDB title string.

        If successful, returns a dict of various stuff:
              series : the title of the TV series, if it's a TV series
               movie : the title of the movie, if it's a movie
                year : the year of the title's release, possibly ????
           yearextra : umm...
        episodetitle : episode title, if it's a TV series
              season : season number (TV)
             episode : episode number (TV)
                date : specific release date (maybe air date?)
              extras : extra crap hanging off the end of the title

              TODO(rryan)
                kind : a guess at the 'kind' of the title
        Otherwise, returns None

        """
        m = re.compile(self.TITLE_RE).match(title)
        if not m:
            return None

        result = m.groupdict()

        # A bug in TITLE_RE causes episodetitle to possibly chomp extra
        # whitespace. Strip it manually here.
        episode_title = result.get('episodetitle', None)
        if episode_title:
            result['episodetitle'] = episode_title.rstrip()

        # Parse integers.
        result['year'] = parse_int(result.get('year', None))
        result['season'] = parse_int(result.get('season', None))
        result['episode'] = parse_int(result.get('episode', None))

        # Parse date as datetime object.
        date = result.get('date', None)
        if date:
            try:
                date = datetime.strptime(date, '%Y-%m-%d')
            except ValueError:
                date = None
            result['date'] = date

        # Guess the kind.
        kind = None
        if result['movie']:
            # If it has movie, then it is a movie.
            kind = models.KIND_MOVIE
        elif result['series']:
            # If it has series, then it is a TV episode or TV series.
            if result['episode'] is not None and result['season'] is not None:
                # If it has an episode and season, then it is a TV episode.
                kind = models.KIND_TV
            else:
                # Otherwise it is probably a series.
                kind = models.KIND_SERIES
        if kind is None:
            kind = models.KIND_UNKNOWN
        result['kind'] = kind

        return result

    #============================ RATINGS ====================================#

    # General rating format:
    #'      2..222...2       5   5.2  "#1 College Sports Show, The" (2004)'

    #RATINGS_RE = "^\s+([.*0-9]{10})\s+(\d+)\s+(\d+\.\d)\s+(.*)$"

    #This regular expression DOES NOT WORK ON ALL MOVIES. I have no clue why.
    #Example of failure: the movie 21 (made in 2008), is not matched.
    # RATINGS_RE = r"""(?x)                          # turn on verbose mode
    #                  ^                             # grab from start
    #                  \s+                           #
    #                  (?P<distribution>[.*1-9]{10}) # distribution chars, 10 times
    #                  \s+                           #
    #                  (?P<votes>\d+)                # number of votes
    #                  \s+                           #
    #                  (?P<rating>\d+\.\d+)          # the rating 0-10.x
    #                  \s+                           #
    #                  (?P<title>.*)                 # the title
    #                  $                             # end of string
    #                  """

    #Somehow this works though? WTF?
    RATINGS_RE = """^\s+([.*0-9]{10})\s+(\d+)\s+(?P<rating>\d+\.\d)\s+(?P<title>.*)$"""

    def generate_ratings(self):
        """Generate (title, rating) pairs from ratings.list.

        Ratings are floating point numbers out of 10.
        """
        matcher = re.compile(self.RATINGS_RE)
        title_matcher = re.compile(self.TITLE_RE)

        with self.open_list('ratings.list') as f:
            for line in f:
                match = matcher.match(line)
                if match:
                    title = match.group('title').strip()
                    rating = match.group('rating')
                    # Drop the dot and use fixed point.  Makes the rating out
                    # of 100.  This is more accurate for testing, but less
                    # convenient elsewhere.
                    rating = int(rating.replace('.', ''))
                    yield (title, rating)

    #============================= TIMES =====================================#

    # This is just quick thing I whipped up to match running times. It doesn't
    # work for TV shows, but it seems to work for movies.

    RUNNING_RE = """^(?P<title>.+\))\s+[^\d]*(?P<time>\d+).*$"""

    # TODO(rnk): Check whether this works/helps.
    RUNNING_RE_2 = """^(?P<title>.+\).+\))\s+[^\d]*(?P<time>\d+).*$"""

    def generate_running_times(self):
        """Generate (title, time) pairs from running-times.list."""
        matcher = re.compile(self.RUNNING_RE)
        matcher2 = re.compile(self.RUNNING_RE_2)
        title_matcher = re.compile(self.TITLE_RE)
        ratings_index = {}

        with self.open_list('running-times.list') as f:
            for line in f:
                match = matcher.match(line)
                if match:
                    title = match.group('title').strip()
                    time = int(match.group('time'))
                    yield (title, time)
                else:
                    match = matcher2.match(line)
                    if match:
                        title = match.group('title').strip()
                        time = int(match.group('time'))
                        yield (title, time)

    #============================= DATES =====================================#

    def generate_release_dates(self):
        # TODO(rnk): Parse the release-dates.list file.
        raise NotImplementedError

# TODO(rnk): This is totally broken right now...
#def find_content_title(content, imdb):

    #kind = content.kind
    #titles = imdb['titles']

    #to_match = None

    #if kind == models.KIND_MOVIE:
        #title = utils.canonicalTitle(content.title)
        #year = content.release_date.year if content.release_date else None

        #to_match = {'movie': title,
                    #'kind': models.KIND_MOVIE}

        #if not year is None:
            #to_match['year'] = year

    #elif kind == models.KIND_SERIES:
        #title = utils.canonicalTitle(content.title)
        #year = content.release_date.year if content.release_date else None

        #to_match = {'series': title,
                    #'kind': models.KIND_SERIES,
                    #'episodetitle': None,
                    #'season': None,
                    #'episode': None,
                    #'date': None}

        #if not year is None:
            #to_match['year'] = year

    #elif kind == models.KIND_TV:
        #series = utils.canonicalTitle(content.parent.title)
        #episode_title = content.title
        #season = content.season
        #episode = content.episode
        #year = content.release_date.year if content.release_date else None

        #to_match = {'series': series,
                    #'kind': models.KIND_TV}

        #if not year is None:
            #to_match['year'] = year

        #if season is None and episode is None:
            #to_match['episodetitle'] = episode_title

        #if not season is None:
            #to_match['season'] = season

        #if not episode is None:
            #to_match['episode'] = episode

    #print "Searching for a match for %s" % to_match

    #found = None
    #for title in titles:
        #from_match = title['title_parse']

        #all_match = True
        #for key in to_match.keys():
            #m1 = from_match[key]
            #m2 = to_match[key]

            #if from_match['movie'] == 'Coffee':
                #print "'%s' versus '%s'" % (m1,m2)

            ## so fug. replace!
            #if not str(m1).lower() == str(m2).lower():
                #all_match = False
                #break
        #if all_match:
            #found = title
            #break

    #return found['title']
