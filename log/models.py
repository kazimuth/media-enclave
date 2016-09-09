from django.db import models

class RequestLog(models.Model):
    """
    Logging facility for requests.
    """

    def __unicode__(self):
        return "%s : %s : Duration: %0.4fs" % (self.uri, 
                                 self.timestamp.strftime(TIME_FORMAT), 
                                 self.duration)

    # max keylength of index is 767
    uri = models.CharField(max_length=767)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    duration = models.FloatField()
