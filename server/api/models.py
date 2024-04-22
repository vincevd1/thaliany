from django.db import models

class anyTimer(models.Model):
    owner_id = models.IntegerField()
    recipient_id = models.IntegerField()
    owner_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    def __str__(self):
        return f"{self.owner_name}'s anytimer on {self.recipient_name} for {self.amount} {self.type}"
    
class anyTimerRequest(models.Model):
    requester_id = models.IntegerField()
    recipient_id = models.IntegerField()
    requester_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    def __str__(self):
        return f"{self.requester_name}s request for an anytimer on {self.recipient_name} for {self.amount} {self.type}"