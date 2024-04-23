from django.db import models

class anyTimer(models.Model):
    owner_id = models.IntegerField()
    recipient_id = models.IntegerField()
    owner_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    
class anyTimerRequest(models.Model):
    requester_id = models.IntegerField()
    recipient_id = models.IntegerField()
    requester_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)