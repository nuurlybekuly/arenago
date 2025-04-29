from django.contrib.auth.views import LogoutView
from django.urls import path
from .views import add_venue, venue_list, venue_detail, home_page, profile_view, create_booking, \
    user_bookings_api, add_favorite, remove_favorite, get_favorite_venues, get_favorite_venues_profile, \
    get_owner_bookings, user_notifications
from .views import venue_list_api,get_bookings


urlpatterns = [
    path('api/venues/', venue_list_api, name='venue_list_api'),
    path('', venue_list, name='venue_list'),  # List all approved venues
    path('add/', add_venue, name='add_venue'),  # Page to add a new venue
    path('api/user-bookings/', user_bookings_api, name='user_bookings_api'),
    path('api/bookings/<int:venue_id>/', get_bookings, name='get_bookings'),
    path('book/', create_booking, name='create_booking'),
    path('<int:venue_id>/', venue_detail, name='venue_detail'),  # View venue details


    path("profile/", profile_view, name="profile"),
    # path('', home_page, name='home_page')
    path('add_favorite/<int:venue_id>/', add_favorite, name='add_favorite'),
    path('remove_favorite/<int:venue_id>/', remove_favorite, name='remove_favorite'),
    path('api/favorites/', get_favorite_venues, name='get_favorite_venues'),
    path('api/favorites/profile/', get_favorite_venues_profile, name='get_favorite_venues'),
    path('get-owner-bookings/', get_owner_bookings, name='get_owner_bookings'),
    path('api/notifications/', user_notifications, name='user_notifications'),

]