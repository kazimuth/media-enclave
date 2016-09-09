from django.conf import settings
from django.contrib import auth as django_auth
import re

class KerberosBackend(object):

    """
    Backend for authentication using MIT Certificate headers posted
    with mod_headers
    """

    def authenticate(self, request):
        if not request.META.get('HTTP_SSL_CLIENT_VERIFY','') == 'SUCCESS':
            return None

        ssl_email = request.META.get('HTTP_SSL_CLIENT_S_DN_EMAIL', '')

        matcher = re.compile('(.+)@MIT.EDU')

        m = matcher.match(ssl_email)
        if m is None:
            return None

        kerberos = m.group(1)

        if kerberos is None:
            return None

        try:
            user = django_auth.models.User.objects.get(username = kerberos)
        except django_auth.models.User.DoesNotExist:
            # Create a user.
            new_user = django_auth.models.User.objects.create_user(kerberos,
                                                                   ssl_email,
                                                                   '')
            new_user.set_unusable_password()
            new_user.save()
            # Add user to the default kerberos group.
            new_user.groups.add(get_kerb_group())
            new_user.save()
            user = new_user

        return user

    def get_user(self, user_id):
        try:
            return django_auth.models.User.objects.get(pk=user_id)
        except django_auth.models.User.DoesNotExist:
            return None

def get_kerb_group():
    """
    Returns or creates the default kerberos group.
    """
    try:
        return django_auth.models.Group.objects.get(name=settings.DEFAULT_GROUP)
    except django_auth.models.Group.DoesNotExist:
        g = django_auth.models.Group(name=settings.DEFAULT_GROUP)
        g.save()
        return g
