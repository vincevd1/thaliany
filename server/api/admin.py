from django.contrib import admin
from .models import anyTimer, anyTimerRequest

# Register your models here.
class anyTimerAdmin(admin.ModelAdmin):
    list_display = ['id','owner_name', 'recipient_name', 'amount', 'type', 'description']
    search_fields = ("id","owner_name", "recipient_name")
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['owner_id', 'recipient_id']
        else:
            return []

class anyTimerRequestAdmin(admin.ModelAdmin):
    list_display = ['id','requester_name', 'recipient_name', 'amount', 'type', 'description']
    search_fields = ("id","requester_name", "recipient_name")
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['requester_id', 'recipient_id']
        else:
            return []

admin.site.register(anyTimer, anyTimerAdmin)
admin.site.register(anyTimerRequest, anyTimerRequestAdmin)
