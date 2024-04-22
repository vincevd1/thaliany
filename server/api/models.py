from django.db import models

class anyTimer(models.Model):
    id = models.BigAutoField(primary_key=True)
    owner_id = models.IntegerField()
    receipient_id = models.IntegerField()
    amount = models.IntegerField()
    type = models.CharField(max_length=500)
    description = models.CharField(max_length=500)
    

