from django.db import models

class AnytimerStatus(models.TextChoices):
    UNUSED = "unused"
    USED = "used"
    COMPLETED = "completed"

class anyTimer(models.Model):
    owner_id = models.IntegerField()
    recipient_id = models.IntegerField()
    owner_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=10, choices=AnytimerStatus, default=AnytimerStatus.UNUSED)
    
class anyTimerRequest(models.Model):
    requester_id = models.IntegerField()
    recipient_id = models.IntegerField()
    requester_name = models.CharField(max_length=500)
    recipient_name = models.CharField(max_length=500)
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)

class AnyTimerProof(models.Model):
    anytimer_id = models.IntegerField()
    file_url = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    proof_type = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)