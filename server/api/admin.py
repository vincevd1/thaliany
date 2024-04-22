from django.contrib import admin
from .models import anyTimer

# Register your models here.
class anyTimerAdmin(admin.ModelAdmin):
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['owner_id', 'recipient_id']
        else:
            return []

admin.site.register(anyTimer, anyTimerAdmin)
