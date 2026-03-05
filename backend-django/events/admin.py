from django.contrib import admin
from .models import Event, Participant, Registration

# Registers all three models in the Django admin interface with
# sensible list displays, filters and search fields for each.

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'date', 'location', 'status')
    list_filter = ('status',)
    search_fields = ('title',)

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'email', 'phone')
    search_fields = ('email', 'last_name')

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ('participant', 'event', 'registered_at')
