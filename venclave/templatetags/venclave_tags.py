#!/usr/bin/env python

from __future__ import division

from django.utils.html import urlquote, escape, mark_safe
from django.core.urlresolvers import reverse
from django.template import Context
from django.template import Library
from django.template.loader import get_template

from menclave.venclave import models


register = Library()

@register.simple_tag
def facet(attribute):
    type = attribute.facet_type
    choices = attribute.get_choices()
    t = get_template('facets/%s.html' % type)
    return t.render(Context({'attribute': attribute}))


@register.simple_tag
def breadcrumbs(request):
    crumb_tmpl = '<a href="%s" class="%s">%s</a>'
    # '/video/a/b/c/' -> ['video', 'a', 'b', 'c']
    crumbs = request.path.strip('/').split('/')
    # Drop video.
    # TODO(rnk): This encodes a dependency on the URL mapping.  Oh well.
    crumbs = crumbs[crumbs.index('video') + 1:]
    html_parts = []
    for (i, crumb) in enumerate(crumbs):  # Aye, caramba!
        href = urlquote('/'.join(['', 'video'] + crumbs[:i + 1] + ['']))
        css_class = "crumb"
        if i + 1 == len(crumbs):
            css_class += " crumb-active"
        crumb = escape(crumb)
        html_parts.append(crumb_tmpl % (href, css_class, crumb))
    return mark_safe(' &raquo; '.join(html_parts))


@register.simple_tag
def comma_separated(items, alt_text=""):
    items = list(items)
    if not items:
        return alt_text
    return ', '.join(str(item) for item in items)


@register.simple_tag
def make_stars(rating):
    if not rating:
        return ""
    if rating >= 4.75:
        url = reverse('venclave-images', args=['star_green_full.png'])
        return ('<img src="%s"/>' % url) * 5
    url = reverse('venclave-images', args=['star_yellow_full.png'])
    html = ('<img src="%s"/>' % url) * int(rating)
    if .25 < (rating % 1 ) < .75:
        url = reverse('venclave-images', args=['star_yellow_half.png'])
        html += '<img src="%s"/>' % url
    return html


@register.filter
def rating(rating):
    """Map None to the empty string."""
    if not rating:
        return "??"
    return rating


@register.filter
def mins_to_hours(mins):
    """Convert a number of minutes into hours:mins."""
    if not mins:
        return ""
    try:
        mins = int(mins)
    except (ValueError, TypeError):
        return ""
    hours = mins // 60
    mins = mins % 60
    return "%d:%02d" % (hours, mins)


@register.filter
def ex_braces(content):
    """Wrap text in braces for exhibit.

    Django has no way to escape braces in its template syntax, and Exhibit uses
    expressions like {{.label}} for its ex:*-subcontent attributes.  This
    is used to, for example, generate a URL from the item in the lens.

    See: http://simile.mit.edu/wiki/Exhibit/Dynamic_URLs

    This filter exists to wrap text in double curly braces that will make it
    past Django and be visible to Exhibit.  The official way to do this with
    django is to use {% templatetag openvariable %} to emit a literal {{.  This
    is less than ideal, so we use the filter approach.
    """
    return "{{" + content + "}}"


@register.filter
def content_url(node):
    if node.kind == models.KIND_MOVIE:
        return reverse('venclave-movie-detail', args=[node.title])
    elif node.kind == models.KIND_SERIES:
        return reverse('venclave-browse-series', args=[node.title])
    elif node.kind == models.KIND_SEASON:
        return reverse('venclave-browse-season',
                       args=[node.parent.title, node.title])
    elif node.kind == models.KIND_TV:
        return reverse('venclave-episode-detail',
                       args=[node.parent.parent.title, node.parent.title,
                             node.title])
    else:
        return reverse('venclave-detail', args=[node.id])


@register.filter
def title_column_name(kind):
    column_names = {
            models.KIND_MOVIE: 'Title',
            models.KIND_SERIES: 'Series',
            models.KIND_SEASON: 'Season',
            models.KIND_TV: 'Episode',
            }
    return column_names.get(kind, 'Title')
