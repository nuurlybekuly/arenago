from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages

from .forms import VenueForm
from django.utils.timezone import localtime, make_aware, now


from .models import Venue, Favorite, Notification
from django.shortcuts import render

from .models import Venue, Booking
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from datetime import datetime
from .models import Booking
from .models import Rating

def get_reviews(request):
    venue_id = request.GET.get('venue_id')
    if venue_id:
        ratings = Rating.objects.filter(venue_id=venue_id).order_by('-rating_id')
    else:
        ratings = Rating.objects.all().order_by('-rating_id')
    data = []
    for r in ratings:
        data.append({
            "rating_id": r.rating_id,
            "venue_id": r.venue_id,
            "rating": r.rating,
            "feedback": r.feedback,
            "user_id": r.user_id,
            "username": r.username,
            "date": r.date.strftime('%Y-%m-%d'),  # Format as string for JSON
        })
    return JsonResponse({"reviews": data})

@csrf_exempt  # Only for testing! Use proper CSRF handling in production.
def add_rating(request):
    if request.method == "POST":
        venue_id = request.POST.get("venue_id")
        rating = request.POST.get("rating")
        feedback = request.POST.get("feedback")
        user = request.user
        try:
            Rating.objects.create(
                venue_id=venue_id,
                rating=rating,
                feedback=feedback,
                user_id=user.id,
                username=user.username  # Add username here
                # date will be set automatically by auto_now_add
            )
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)})
    return JsonResponse({"success": False, "error": "Invalid request"})


@login_required
def user_notifications(request):
    notifications = Notification.objects.filter(user=request.user).order_by('-created_at')
    data = [
        {
            'title': notif.title,
            'content': notif.content,
            'created_at': notif.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        for notif in notifications
    ]
    return JsonResponse(data, safe=False)

@login_required
def get_owner_bookings(request):
    # Step 1: Get all venues that belong to the authenticated user (owner)
    user = request.user  # Get the current authenticated user
    venues = Venue.objects.filter(owner=user)  # All venues owned by the current user

    # Step 2: Get all bookings for these venues
    bookings = Booking.objects.filter(venue_id__in=venues.values_list('id', flat=True))
    booking_data = []
    for booking in bookings:
        # Convert UTC datetime to local time
        local_start = localtime(booking.start_time)
        local_end = localtime(booking.end_time)

        booking_data.append({
            'time': f"{local_start.strftime('%H:%M')} - {local_end.strftime('%H:%M')}",
            'name': booking.user_name,
            'price': float(booking.price),
            'venue_name': booking.venue_name,
            'date': local_start.strftime('%d.%m.%Y')
        })

    # Step 4: Return only the bookings array
    return JsonResponse(booking_data, safe=False)

@login_required
def user_bookings_api(request):
    user = request.user
    bookings = Booking.objects.filter(user_id=user.id).order_by('-start_time')


    booking_list = []
    for booking in bookings:
        venue = Venue.objects.get(id=booking.venue_id)

        adjusted_start = localtime(booking.start_time)
        adjusted_end = localtime(booking.end_time)

        current_time = localtime(now())  # Shift current time for status check

        if adjusted_end < current_time:
            status_text = "Ended"
            status_color = "orange"
        else:
            status_text = "Active"
            status_color = "green"

        booking_list.append({
            "id": booking.id,
            "venue_id": booking.venue_id,
            "date": adjusted_start.strftime("%d.%m.%Y"),
            "time": f"{adjusted_start.strftime('%H:%M')}-{adjusted_end.strftime('%H:%M')}",
            "venue": venue.name,
            "price": f"{int(booking.price):,}₸".replace(",", " "),
            "status_text": status_text,
            "status_color": status_color,
        })

    return JsonResponse({"bookings": booking_list})

@csrf_exempt
def create_booking(request):
    if request.method == "POST":
        data = json.loads(request.body)
        venue_id = data.get('venue_id')
        slots = data.get('slots')  # ['10:00 - 11:00']
        date_str = data.get('date')  # '2025-04-17'
        priceVenue = data.get('price')
        venue_name = data.get('venue_name')
        user_full_name = f"{request.user.first_name} {request.user.last_name}".strip()

        print(priceVenue)
        print("RECEIVED SLOTS:", slots)
        print("RECEIVED DATE:", date_str)

        for slot in slots:
            start_str, end_str = slot.split(' - ')
            start_str = start_str.strip()
            end_str = end_str.strip()

            try:
                naive_start = datetime.strptime(f"{date_str} {start_str}", "%Y-%m-%d %H:%M")
                naive_end = datetime.strptime(f"{date_str} {end_str}", "%Y-%m-%d %H:%M")
            except ValueError as e:
                return JsonResponse({"status": "error", "message": f"Invalid time format: {e}"}, status=400)

            aware_start = make_aware(naive_start)
            aware_end = make_aware(naive_end)

            Booking.objects.create(
                venue_id=venue_id,
                start_time=aware_start,
                end_time=aware_end,
                user_id=request.user.id,  # Or hardcode for now if request.user doesn't work
                venue_name= venue_name,
                user_name = user_full_name,
                price=priceVenue
            )

        return JsonResponse({"status": "success", "message": "Booking created!"})

    return JsonResponse({"status": "error", "message": "Invalid request"}, status=400)


def get_bookings(request, venue_id):
    bookings = Booking.objects.filter(venue_id=venue_id)
    booking_list = []

    for booking in bookings:
        booking_data = {
            'venue_id': booking.venue_id,
            'start_time': booking.start_time.strftime('%Y-%m-%d %H:%M:%S%z'),
            'end_time': booking.end_time.strftime('%Y-%m-%d %H:%M:%S%z'),
            'user_id': booking.user_id
        }
        booking_list.append(booking_data)

    return JsonResponse(booking_list, safe=False)

def venue_list_api(request):
    venues = Venue.objects.filter(is_confirmed=True)  # Fetch only approved venues
    data = []
    for venue in venues:
        data.append({
            "id": venue.id,
            "name": venue.name,
            "type": venue.category,
            "description": venue.description,
            "rating": venue.rating if venue.rating else "N/A",
            "location": venue.location,
            "pricePerHour": venue.price_per_hour,
            "start": venue.start.strftime('%H:%M') if venue.start else "09:00",  # formatted nicely
            "end": venue.end.strftime('%H:%M') if venue.end else "22:00",
            "working_days": venue.working_days if venue.working_days else "1:2:3:4:5:6:7",
            "images": [
                venue.image.url if venue.image else "none",
                venue.image1.url if venue.image1 else "none",
                venue.image2.url if venue.image2 else "none",
                venue.image3.url if venue.image3 else "none",
                venue.image4.url if venue.image4 else "none",
            ]
        })

    return JsonResponse({"venues": data})

@login_required
def add_venue(request):
    if request.method == 'POST':
        form = VenueForm(request.POST, request.FILES)
        if form.is_valid():
            venue = form.save(commit=False)
            venue.owner = request.user

            # These three fields come manually from JS
            start = request.POST.get('start')
            end = request.POST.get('end')
            working_days = request.POST.get('working_days')

            if start:
                venue.start = start
            if end:
                venue.end = end
            if working_days:
                venue.working_days = working_days

            venue.save()
            print("✅ Venue saved:", venue)  # Debugging save action
            messages.success(request, "Venue submitted for approval!")
            return redirect('home_page')
        else:
            print("❌ Form errors:", form.errors)
            messages.error(request, "There was an error in the form. Please correct it.")
    else:
        form = VenueForm()

    return render(request, 'venues/add_venue.html', {'form': form})



@login_required
def profile_view(request):
    # Get venues owned by the logged-in user
    user_venues = Venue.objects.filter(owner=request.user)

    # Separate confirmed, rejected, and pending venues
    approved_venues = user_venues.filter(is_confirmed=True)
    pending_venues = user_venues.filter(is_confirmed=False)

    return render(request, 'venues/profile.html', {
        'approved_venues': approved_venues,
        'pending_venues': pending_venues,
    })



def venue_list(request):
    venues = Venue.objects.filter(is_confirmed=True)  # Show only approved venues
    return render(request, 'venues/venue_list.html', {'venues': venues})

def venue_detail(request, venue_id):
    venue = get_object_or_404(Venue, id=venue_id)
    return render(request, 'venues/venue_detail.html', {'venue': venue})

def home_page(request):
    venues = Venue.objects.filter(isConfirmed=True)  # Only show confirmed venues
    return render(request, 'users/home_page.html', {'venues': venues})


@login_required
@csrf_exempt  # This is to handle CSRF tokens properly for POST requests in AJAX
def add_favorite(request, venue_id):
    if request.method == 'POST':
        venue = get_object_or_404(Venue, id=venue_id)

        # Check if the favorite already exists
        favorite, created = Favorite.objects.get_or_create(user=request.user, venue=venue)

        if created:
            return JsonResponse({'status': 'added', 'message': 'Venue added to favorites'})
        else:
            return JsonResponse({'status': 'already_exists', 'message': 'Venue is already in favorites'})


@login_required
@csrf_exempt  # This is to handle CSRF tokens properly for POST requests in AJAX
def remove_favorite(request, venue_id):
    if request.method == 'POST':
        venue = get_object_or_404(Venue, id=venue_id)

        # Delete the favorite if it exists
        favorite = Favorite.objects.filter(user=request.user, venue=venue).first()

        if favorite:
            favorite.delete()
            return JsonResponse({'status': 'removed', 'message': 'Venue removed from favorites'})
        else:
            return JsonResponse({'status': 'not_found', 'message': 'Venue not found in favorites'})


@login_required
def get_favorite_venues(request):
    # Get all the favorite venues of the authenticated user
    favorites = Favorite.objects.filter(user=request.user)

    # Prepare a list to store only venue_id
    favorite_venues_ids = [favorite.venue.id for favorite in favorites]

    # Return the list as a JSON response
    return JsonResponse({'favorite_venues_ids': favorite_venues_ids})

@login_required
def get_favorite_venues_profile(request):
    # Get all the favorite venues of the authenticated user
    favorites = Favorite.objects.filter(user=request.user)

    # Get the venue_ids for the user's favorite venues
    favorite_venue_ids = [favorite.venue.id for favorite in favorites]

    # Retrieve venue details for each favorite venue_id
    venues = Venue.objects.filter(id__in=favorite_venue_ids)

    # Prepare a list to return venue details
    venue_details = []
    for venue in venues:
        venue_details.append({
            'id': venue.id,
            'name': venue.name,
            'category': venue.category,
            'rating': str(venue.rating),  # Convert decimal to string for JSON
            'price_per_hour': str(venue.price_per_hour),  # Convert decimal to string for JSON
            'location': venue.location,
            'location_link': venue.location_link,
            'description': venue.description,
            'image': venue.image.url if venue.image else None,
            'image1': venue.image1.url if venue.image1 else None,
            'image2': venue.image2.url if venue.image2 else None,
            'image3': venue.image3.url if venue.image3 else None,
            'image4': venue.image4.url if venue.image4 else None,
            'is_confirmed': venue.is_confirmed
        })

    # Return the venue details as a JSON response
    return JsonResponse({'venue_details': venue_details})


def cancel_booking(request):
    if request.method == "POST":
        booking_id = request.POST.get("booking_id")
        try:
            booking = Booking.objects.get(id=booking_id)
            booking.delete()
            return JsonResponse({"success": True})
        except Booking.DoesNotExist:
            return JsonResponse({"success": False, "error": "Booking not found"})
    return JsonResponse({"success": False, "error": "Invalid request"})