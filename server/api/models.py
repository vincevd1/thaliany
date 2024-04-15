from django.db import models

class anyTimer(models.Model):
    id = models.BigAutoField(primary_key=True)
    owner_id = models.IntegerField()
    receipient_id = models.IntegerField()
    

