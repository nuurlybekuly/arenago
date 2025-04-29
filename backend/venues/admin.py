from django.contrib import admin
from .models import Venue, VenueCategory, Favorite, Booking, Notification
from django.utils.html import format_html

class VenueAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner', 'category', 'price_per_hour', 'location', 'is_confirmed')
    list_filter = ('is_confirmed', 'category', 'owner')
    search_fields = ('name', 'owner__username', 'category', 'location')
    actions = ['approve_venue', 'reject_venue']

    # actions = ['approve_venue']

    def approve_venue(self, request, queryset):
        queryset.update(is_confirmed=True)
        self.message_user(request, "Selected venues have been approved!")

    approve_venue.short_description = "Approve selected venues"

    def reject_venue(self, request, queryset):
        queryset.update(is_confirmed=False)
        self.message_user(request, "❌ Selected venues have been rejected!")

    reject_venue.short_description = "Reject selected venues"


    def document_preview(self, obj):
        if obj.document:
            return format_html('<a href="{}" target="_blank"><img src="{}" width="100"></a>', obj.document.url,
                               obj.document.url)
        return "No Document"

    document_preview.short_description = "Document"


admin.site.register(Venue, VenueAdmin)
admin.site.register(VenueCategory)
admin.site.register(Favorite)
admin.site.register(Notification)
admin.site.register(Booking)


