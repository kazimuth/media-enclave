from django.contrib import auth
from django.core.urlresolvers import reverse
from django.utils.http import urlquote
from django.http import HttpResponseRedirect
from django.template import RequestContext

from menclave import settings as settings
from menclave.aenclave.html import html_error, render_html_template
from menclave.aenclave.json_response import json_error
from menclave.aenclave.xml import xml_error

#------------------------------- Permissions --------------------------------#


def get_anon_user():
    username = settings.ANONYMOUS_USER
    try:
        anon = auth.models.User.objects.get(username = username)
    except auth.models.User.DoesNotExist:
        anon = auth.models.User.objects.create_user(username, '', '')
        anon.set_unusable_password()
        anon.save()
    return anon


def permission_required(perm, action, erf=html_error, perm_fail_erf=None):
    """
    Requre the user to have a permission or display an error message.

    perm - Permission to check.
    action - the type of action attempted
    erf - Error return function, takes request, text, title.
    perm_fail_erf - define this to use a different erf for permissions
    failures.
    """
    if perm_fail_erf is None:
        perm_fail_erf = erf

    def decorator(real_handler):
        def request_handler(request, *args, **kwargs):
            if not request.user.is_authenticated():
                # Check if the anonymous user has access.
                anon = get_anon_user()
                if anon.has_perm(perm):
                    return real_handler(request, *args, **kwargs)
                # Otherwise, show error message.
                error_text = ('You must <a href="%s">log in</a> to do that.' %
                              reverse('aenclave-login'))
                return erf(request, error_text, action)
            elif not request.user.has_perm(perm):
                # Check if the anonymous user has access.
                anon = get_anon_user()
                if anon.has_perm(perm):
                    return real_handler(request, *args, **kwargs)
                # Otherwise, show error message.
                error_text = ('You need more permissions to do that.')
                return perm_fail_erf(request, error_text, action)
            else:
                return real_handler(request, *args, **kwargs)
        return request_handler
    return decorator

def permission_required_redirect(perm, redirect_field_name):
    """
    Mimicks functionality of django.contrib.auth.permission_required
    """
    def erf(request, error_text, action):
        path = urlquote(request.get_full_path())
        tup = settings.LOGIN_URL, redirect_field_name, path
        return HttpResponseRedirect('%s?%s=%s' % tup)
    return permission_required(perm, '', erf, html_error)

def permission_required_xml(perm):
    return permission_required(perm, '', lambda r,text,act: xml_error(text))

def permission_required_json(perm):
    return permission_required(perm, '', lambda r,text,act: json_error(text))


#------------------------------- Login/Logout --------------------------------#

def user_debug(request):
    return render_html_template('aenclave/user_debug.html', request,
                                context_instance=RequestContext(request))

def login(request):
    form = request.POST

    # If not using SSL, try redirecting.
    if not request.is_secure():
        url = 'https' + request.build_absolute_uri()[4:]
        return HttpResponseRedirect(url)

    # First try SSL Authentication
    user = auth.authenticate(request=request)

    # Otherwise, treat this like a text login and show the login page if
    # necessary.
    if user is None:
        # If the user isn't trying to log in, then just display the login page.
        if not form.get('login', False):
            goto = request.GET.get('goto', None)
            if not goto:
                # The Django login_required decorator passes 'next' as the
                # redirect, so we look for that if 'goto' is missing.
                goto = request.GET.get('next', None)
            context = RequestContext(request)
            return render_html_template('aenclave/login.html', request,
                                        {'redirect_to': goto},
                                        context_instance=context)
        # Check if the username and password are correct.
        user = auth.authenticate(username=form.get('username', ''),
                                 password=form.get('password', ''))

    # If the username/password are invalid or SSL authentication failed tell
    # the user to try again.
    error_message = ''
    if user is None:
        error_message = 'Invalid username/password.'

    # If the user account is disabled, then no dice.
    elif not user.is_active:
        error_message = ('The user account for <tt>%s</tt> has been disabled.' %
                         user.username)
    if error_message:
        return render_html_template('aenclave/login.html', request,
                                    {'error_message': error_message,
                                     'redirect_to': form.get('goto', None)},
                                    context_instance=RequestContext(request))

    # Otherwise, we're good to go, so log the user in.
    auth.login(request, user)

    # hack to try to pass them back to http land
    goto = request.REQUEST.get('goto', reverse('aenclave-home'))

    # hack to prevent infinite loop.
    if goto == '':
        goto = reverse('aenclave-home')

    if goto.startswith('https'):
        goto = goto.replace('^https', 'http')

    return HttpResponseRedirect(goto)

def logout(request):
    auth.logout(request)
    goto = request.GET.get('goto', reverse('aenclave-home'))
    return HttpResponseRedirect(goto)
