# log.py

"""aenclave.log -- logging and error-handling functions

The log module provides a centralized system for catching and logging errors.
It also contians functions for sending automated messages by email.

The most important thing for backend developers to know about the log module is
how to use the catch(), error(), and debug() functions, and when to raise the
Panic exception.  debug() should be called any time anything significant
happens (such as changing channels or uploading songs) so that an administrator
can optionally have these messages logged to monitor activity on the system.
error() should be called when there is an error in the backend that is resolved
and ignored, so that the problem can be tracked down later.  When an exception
occurs that the backend cannot resolve in a reasonable way, the except block of
the try statement should call catch() to log the traceback.  When the backend
is unable to do what the frontend asked it to do, it should raise a Panic
exception with a string describing to a user (not an admin) what went wrong --
this exception will be caught by the frontend and the message will be relayed
to the user."""

import time
import traceback

#============================= LOGGING FUNCTIONS =============================#

def _log(string, path):
    """_log(string, path) -> None

    Logs a timestamped bytestring in the log file at `path`."""
    try:
        f = open(path,'a')
        try:
            f.write('#' * 60)
            f.write('\n[%s] ' % time.ctime())
            f.write(string)
            f.write('\n')
        finally: f.close()
    # If logging fails, we can't do much else but give up; I mean, what are we
    # going to do, log an error?
    except IOError: pass

def catch():
    """catch() -> None
    
    Logs the most recent exception and the traceback information for that
    exception."""
    return  # for now this is turned off
    # Prepare the report.
    report = 'An error occurred in Audio Enclave.\n'
    report += traceback.format_exc()
    # Log the report to the error log.
    _log(report, settings.ERROR_LOG_PATH)

def error(priority, string):
    """error(priority, string) -> None

    Logs a timestamped bytestring in the enclave error log."""
    # This is just an easy way to get information about how and where the error
    # occurred.  We use the UserWarning exception because it's a pretty good
    # description of what this is: a warning about something that isn't
    # supposed to happen.
    try: raise UserWarning(string)
    except UserWarning: catch()

#=============================================================================#
