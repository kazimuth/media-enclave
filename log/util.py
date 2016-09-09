import logging

from middleware import LOGGING_ENABLE_ATTR

def enable_logging(f):

    """ Decorator to enable logging on a Django request method."""

    def new_f(*args, **kwargs):
        request = args[0]
        setattr(request, LOGGING_ENABLE_ATTR, True)
        return f(*args, **kwargs)
    new_f.func_name = f.func_name
    return new_f

def trace(f):

    """Decorator to add traces to a method."""

    def new_f(*args, **kwargs):
        extra = {}
        logging.info("TRACE %s ENTER" % f.func_name,extra=extra)
        result = f(*args, **kwargs)
        logging.info("TRACE %s EXIT" % f.func_name,extra=extra)
        return result
    new_f.func_name = f.func_name
    return new_f

