# menclave/aenclave/templatetags/aenclave.py

import datetime

from django import template

register = template.Library()

#=============================================================================#

@register.filter
def is_recent(value, arg=7):
    """Returns True if the given date is in the last `arg` days (default 7),
    False otherwise."""
    try: return datetime.datetime.now() - value < datetime.timedelta(int(arg))
    except (TypeError, ValueError): return False

#=============================================================================#

# strings for the first twenty numbers
FIRST20 = ('','one','two','three','four','five','six','seven','eight','nine',
           'ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen',
           'seventeen','eighteen','nineteen')
# strings for multiples of ten
MULT10 = ('','ten','twenty','thirty','forty','fifty','sixty','seventy',
          'eighty','ninety')
# strings for powers of 1000
POW1000 = ('','thousand','million','billion','trillion','quadrillion',
           'quintillion','sextillion','septillion','octillion','nonillion',
           'decillion','undecillion','duodecillion','tredecillion',
           'quattuordecillion','quindecillion','sexdecillion',
           'septendecillion','octodecillion','novemdecillion',
           'vigintillion')  # one vigintillion == 10**63

@register.filter
def number_string(value):
    """Returns the English words for the integer given.  If the input is
    invalid or too big to handle, it will just return the input unmodified."""
    try: num = long(value)
    except (TypeError, ValueError): return value
    if num == 0: return 'zero'
    elif num < 0:
        string = 'negative '
        num = abs(num)
    else: string = ''
    # If the number is too big for the function to handle, then just return the
    # string form of the number.  Note that this function could be extended to
    # handle larger numbers simply by adding more entries to the POW1000 list.
    if num >= 1000**len(POW1000): return value
    # Run through the powers of 1000, from largest to smallest
    for power in xrange(len(POW1000)-1,-1,-1):
        # Let p be the given power of 1000
        p = 1000**power
        # Let h be the multiple of p
        h = num // p
        # If h is zero, we don't need to print anything for this power
        if h == 0: continue
        # If h is at least 100, print the number of hundreds and take h mod 100
        if h >= 100:
            string += FIRST20[h//100]+' hundred '
            h %= 100
        # If h is zero, don't print anything
        if h == 0: pass
        # If h is less then twenty, print the string for that number
        elif h < 20: string += FIRST20[h]+' '
        # If h is a multiple of ten, print the string for that number
        elif h % 10 == 0: string += MULT10[h//10]+' '
        # Otherwise, print the ten's place and one's place separately
        else: string += MULT10[h//10]+'-'+FIRST20[h%10]+' '
        # Print the string for the given power of 1000, as well as a comma
        string += POW1000[power]+', '
        # Take the number mod p, and go to the next lower power of 1000
        num %= p
    # Remove any extraneous spaces or commas, and return the final string
    return string.strip(', ')

#=============================================================================#

@register.filter
def json_escape(value):
    return unicode(value).replace(u'\\', u'\\\\').replace(u'\b', u'\\b').\
           replace(u'\f', u'\\f').replace(u'\n', u'\\n').\
           replace(u'\r', u'\\r').replace(u'\t', u'\\t').\
           replace(u'"', u'\\"').encode('utf-8', 'replace')

#=============================================================================#

@register.filter
def groups_of(value, arg=1):
    group_size = max(int(arg), 1)
    result_list = []
    current_group = []
    for item in value:
        current_group.append(item)
        if len(current_group) == group_size:
            result_list.append(current_group)
            current_group = []
    if current_group:
        while len(current_group) < group_size:
            current_group.append(None)
        result_list.append(current_group)
    return result_list

#=============================================================================#
