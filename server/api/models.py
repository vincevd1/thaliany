from django.db import models

class anyTimer(models.Model):
    owner_id = models.IntegerField()
    recipient_id = models.IntegerField()
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500, blank=True, null=True)
    def __str__(self):
        return f"{self.owner_id} - {self.recipient_id}"
    

