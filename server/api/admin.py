from django.contrib import admin
from .models import AnyTimer, AnyTimerRequest , AnyTimerProof

# Register your models here.
class AnyTimerAdmin(admin.ModelAdmin):
    list_display = ['id','owner_name', 'recipient_name', 'amount', 'type', 'description', 'status']
    search_fields = ("id","owner_name", "recipient_name")
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['owner_id', 'recipient_id']
        else:
            return []

class AnyTimerRequestAdmin(admin.ModelAdmin):
    list_display = ['id','requester_name', 'recipient_name', 'amount', 'type', 'description']
    search_fields = ("id","requester_name", "recipient_name")
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['requester_id', 'recipient_id']
        else:
            return []

class AnyTimerProofAdmin(admin.ModelAdmin):
    list_display = ['id','anytimer_id', 'description', 'proof_type', 'created_at']
    search_fields = ("id","anytimer_id")
    def get_readonly_fields(self, request, obj=None):
        if obj:  # if the object is being edited
            return ['anytimer_id']
        else:
            return []

admin.site.register(AnyTimer, AnyTimerAdmin)
admin.site.register(AnyTimerRequest, AnyTimerRequestAdmin)
admin.site.register(AnyTimerProof, AnyTimerProofAdmin)
