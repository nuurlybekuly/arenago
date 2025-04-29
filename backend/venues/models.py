from django.contrib.auth.decorators import login_required
from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings
from django.http import JsonResponse






class Notification(models.Model):
    notif_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

class VenueCategory(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Venue(models.Model):
        owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
        name = models.CharField(max_length=255)
        category = models.CharField(max_length=100)
        rating = models.DecimalField(max_digits=3, decimal_places=1, default=5)
        price_per_hour = models.DecimalField(max_digits=10, decimal_places=2)
        location = models.CharField(max_length=255)
        location_link = models.URLField(blank=True, null=True)
        description = models.TextField()
        document = models.FileField(upload_to='venue_documents/')
        created_at = models.DateTimeField(auto_now_add=True)

        start = models.TimeField(default="09:00:00")
        end = models.TimeField(default="22:00:00")

        # Working days stored as colon-separated numbers like "1:2:5"
        working_days = models.CharField(
            max_length=20,
            default="1:2:3:4:5:6:7",
            help_text="Store working days as colon-separated numbers, e.g., '1:2:5'"
        )

        # Image fields
        image = models.ImageField(upload_to='venue_images/', blank=True, null=True)
        image1 = models.ImageField(upload_to='venue_images/', blank=True, null=True)
        image2 = models.ImageField(upload_to='venue_images/', blank=True, null=True)
        image3 = models.ImageField(upload_to='venue_images/', blank=True, null=True)
        image4 = models.ImageField(upload_to='venue_images/', blank=True, null=True)

        is_confirmed = models.BooleanField(default=False)


        def __str__(self):
            return self.name


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'venue')

    def __str__(self):
        return f"{self.user} favorited {self.venue}"

# class Booking(models.Model):
#     venue_id = models.IntegerField()  # Store venue ID as integer (foreign key reference)
#     start_time = models.DateTimeField()
#     end_time = models.DateTimeField()
#     user_id = models.IntegerField()  # For simplicity, storing user_id directly here.
#     price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)
#
#     class Meta:
#         unique_together = ('venue_id', 'start_time')  # Ensure no overlapping bookings for the same venue and time slot.
#
#     def __str__(self):
#         return f"Booking for venue {self.venue_id} from {self.start_time} to {self.end_time}"
#
#     @classmethod
#     def is_available(cls, venue_id, start_time, end_time):
#         """ Check if a time slot is available for a venue ID """
#         return not cls.objects.filter(venue_id=venue_id, start_time=start_time, end_time=end_time).exists()

class Booking(models.Model):
    venue_id = models.IntegerField()  # Foreign key reference stored as integer
    venue_name = models.CharField(max_length=255)  # Name stored directly
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    user_id = models.IntegerField()  # Storing user ID as integer
    user_name = models.CharField(max_length=255, default="Anonym")  # Name stored directly
    price = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)

    class Meta:
        unique_together = ('venue_id', 'start_time')  # Prevent double bookings

    def __str__(self):
        return f"Booking for {self.venue_name} by {self.user_name} from {self.start_time} to {self.end_time}"

    @classmethod
    def is_available(cls, venue_id, start_time, end_time):
        """Check if a time slot is available for a venue"""
        return not cls.objects.filter(venue_id=venue_id, start_time=start_time, end_time=end_time).exists()
