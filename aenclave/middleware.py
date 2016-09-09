# menclave/aenclave/middleware.py

"""Aenclave middleware."""

import logging


class LoggingMiddleware(object):

    """Logs exceptions with tracebacks with the standard logging module."""

    def process_exception(self, request, exception):
        logging.exception('Logging request handler error.')


class ChannelMiddleware(object):

    """Stuffs channel snapshots into the request object for performance."""

    def process_request(self, request):
        # TODO(rnk): Make this access lazy so that views that update the
        # channel will ask for this information after they've made their
        # changes.
        request.channel_snapshots = dict()
        def get_channel_snapshot(channel):
            if channel.id in request.channel_snapshots:
                return request.channel_snapshots[channel.id]
            else:
                snapshot = channel.controller().get_channel_snapshot()
                request.channel_snapshots[channel.id] = snapshot
                return snapshot
        request.get_channel_snapshot = get_channel_snapshot
