from django import forms
from .models import Venue

class VenueForm(forms.ModelForm):
    class Meta:
        model = Venue
        fields = ['name', 'category', 'price_per_hour', 'location', 'location_link', 'description', 'document', 'image', 'image1', 'image2', 'image3', 'image4']
        # widgets = {
        #     'category': forms.Select(choices=Venue.CATEGORY_CHOICES),  # Ensure dropdown works
        # }