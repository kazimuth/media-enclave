import datetime

from django.conf import settings
from django.db.models.query import Q

from menclave.aenclave.models import Song

def get_unicode(form, key, default=None):
    value = form.get(key, None)
    if value is None: return default
    elif isinstance(value, unicode): return value
    elif isinstance(value, str):
        return value.decode(settings.DEFAULT_CHARSET, 'replace')
    else: return unicode(value)

def get_integer(form, key, default=None):
    try: return int(str(form[key]))
    except Exception: return default

def get_int_list(form, key):
    ints = []
    for string in form.get(key, '').split():
        try: ints.append(int(str(string)))
        except Exception: pass
    return ints

def get_song_list(form, key='ids'):
    """Given a list of ids in a form, fetch a list of Songs from the db.

    This function preserves the order of the ids as given in the form.
    """
    ids = get_int_list(form, key)
    song_dict = Song.objects.in_bulk(ids)
    return [song_dict[i] for i in ids if i in song_dict]

def parse_integer(string):
    try: return int(str(string))
    except Exception: raise ValueError('invalid integer: %r' % string)

def parse_date(string):
    string = string.strip().lower()
    if string == 'today': return datetime.date.today()
    elif string == 'yesterday':
        return datetime.date.today() - datetime.timedelta(1)
    # TODO make this more robust
    year,month,day = string.split('-')
    return datetime.date(int(year),int(month),int(day))

def parse_time(string):
    parts = string.strip().split(':')
    if len(parts) > 3: raise ValueError
    # This function is purposely forgiving.
    mult, total = 1, 0
    for part in reversed(parts):
        total += int(part) * mult
        mult *= 60
    return total
