
import json
import logging
import time

from models import RequestLog
import handler

LOGGING_ENABLE_ATTR = 'LOGGING_ENABLE'
LOGGING_START_TIME_ATTR = 'LOGGING_START_TIME'

class LoggingMiddleware(object):

    """Logs exceptions with tracebacks with the standard logging module."""

    def __init__(self):
        self._handler = handler.ThreadBufferedHandler()
        logging.root.setLevel(logging.NOTSET)
        logging.root.addHandler(self._handler)

    def process_exception(self, request, exception):
        extra = {}
        logging.error("An unhandled exception occurred: %s" % repr(exception),
                      extra=extra)

        time_taken = -1
        if hasattr(request, LOGGING_START_TIME_ATTR):
            start = getattr(request, LOGGING_START_TIME_ATTR)
            time_taken = time.time() - start

        records = self._handler.get_records()
        first = records[0] if len(records) > 0 else None
        records = [self._record_to_json(record, first) for record in records]
        message = json.dumps(records)

        log_entry = RequestLog(uri=request.path,
                               message=message,
                               duration=time_taken)
        log_entry.save()
        
    def process_request(self, request):
        setattr(request, LOGGING_START_TIME_ATTR, time.time())
        self._handler.clear_records()
        return None

    def _time_humanize(self, seconds):
        return "%.3fs" % seconds

    def _record_delta(self, this, first):
        return self._time_humanize(this - first)

    def _record_to_json(self, record, first):
        return {'filename': record.filename,
                'timestamp': record.created,
                'level_name': record.levelname,
                'level_number': record.levelno,
                'module': record.module,
                'function_name': record.funcName,
                'line_number': record.lineno,
                'message': record.msg,
                'delta': self._record_delta(record.created, first.created) 
                }

    def process_response(self, request, response):
        
        if not hasattr(request, LOGGING_ENABLE_ATTR):
            return response
        
        time_taken = -1
        if hasattr(request, LOGGING_START_TIME_ATTR):
            start = getattr(request, LOGGING_START_TIME_ATTR)
            time_taken = time.time() - start

        records = self._handler.get_records()
        first = records[0] if len(records) > 0 else None
        records = [self._record_to_json(record, first) for record in records]
        message = json.dumps(records)

        log_entry = RequestLog(uri=request.path,
                               message = message,
                               duration=time_taken)
        log_entry.save()

        return response
