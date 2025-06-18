from django.contrib.auth import authenticate, login
import random
import json
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.core.mail import send_mail
from django.contrib import messages
from django.shortcuts import render, redirect
from django.contrib.auth import get_user_model  # ✅ Use this instead of User
User = get_user_model()  # ✅ Get your custom User model




@csrf_exempt
def signup_view(request):
    if request.method == "POST":
        first_name = request.POST.get("first-name")
        last_name = request.POST.get("last-name")
        username = request.POST.get("username")
        email = request.POST.get("email")
        password = request.POST.get("password")
        confirm_password = request.POST.get("confirm-password")

        print("✅ Signup form submitted")

        if password != confirm_password:
            messages.error(request, "Passwords do not match!")
            return render(request, "users/signup.html", {"form_data": request.POST})

        if User.objects.filter(email=email).exists():
            messages.error(request, "Email already registered!")
            return render(request, "users/signup.html", {"form_data": request.POST})

        if User.objects.filter(username=username).exists():
            messages.error(request, "Username already taken!")
            return render(request, "users/signup.html", {"form_data": request.POST})

        # ✅ Create and save the user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        user.save()
        print("✅ User created successfully")
        login(request, user)

        # Redirect to home page (replace 'home_page' with your actual url name)
        return redirect("home_page")

        return JsonResponse({"status": "success", "message": "User registered successfully!"})

    return render(request, "users/signup.html")

# def signup_view(request):
#     if request.method == "POST":
#         first_name = request.POST.get("first-name")
#         last_name = request.POST.get("last-name")
#         username = request.POST.get("username")
#         email = request.POST.get("email")
#         password = request.POST.get("password")
#         confirm_password = request.POST.get("confirm-password")
#
#         print("✅ Signup form submitted")
#
#         if password != confirm_password:
#             return JsonResponse({"status": "error", "message": "Passwords do not match!"})
#
#         if User.objects.filter(email=email).exists():
#             return JsonResponse({"status": "error", "message": "Email already registered!"})
#
#         # ✅ Store user details in session (DO NOT create user yet)
#         request.session["signup_data"] = {
#             "first_name": first_name,
#             "last_name": last_name,
#             "username": username,
#             "email": email,
#             "password": password,
#         }
#
#         # ✅ Generate and store verification code
#         verification_code = str(random.randint(100000, 999999))
#         request.session["verification_code"] = verification_code
#
#         print(f"✅ Generated Verification Code: {verification_code}")
#
#         # ✅ Send verification email
#         try:
#             send_mail(
#                 "Your Verification Code",
#                 f"Your verification code is: {verification_code}",
#                 "210103465@stu.sdu.edu.kz",
#                 [email],
#                 fail_silently=False,
#             )
#             print("✅ Email sent successfully")
#         except Exception as e:
#             print(f"❌ Email sending failed: {e}")
#             return JsonResponse({"status": "error", "message": "Email sending failed."})
#
#         return JsonResponse({"status": "success", "message": "Verification code sent!"})
#
#     return render(request, "users/signup.html")



def verify_code(request):
    if request.method == "POST":
        user_code = request.POST.get("verification_code")
        stored_code = request.session.get("verification_code")
        email = request.session.get("email")

        if user_code == stored_code:
            try:
                user = User.objects.get(email=email)
                user.is_active = True  # Activate user
                user.save()
                del request.session["verification_code"]  # Remove session data
                del request.session["email"]
                messages.success(request, "Email verified successfully! You can log in now.")
                return redirect("login_page")
            except User.DoesNotExist:
                messages.error(request, "User not found. Please sign up again.")
                return redirect("signup_page")
        else:
            messages.error(request, "Invalid verification code!")

    return render(request, "users/signup.html", {"show_verification": True})


# Login View

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')

        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            messages.success(request, "Login successful!")
            return redirect('home_page')  # Redirect to home page
        else:
            messages.error(request, "Invalid username or password")
            return redirect('login_page')

    return render(request, 'users/login.html')






def homepage(request):
    return render(request, 'users/home_page.html')


def verify_code(request):
    if request.method == "POST":
        user_code = request.POST["code"]
        stored_code = request.session.get("verification_code")

        if user_code == stored_code:
            del request.session["verification_code"]  # Remove code after verification
            messages.success(request, "Email verified successfully!")
            return redirect("login_page")  # Redirect to login page
        else:
            messages.error(request, "Invalid verification code!")

    return render(request, "users/signup.html")





def verify_code_view(request):
    if request.method == "POST":
        entered_code = request.POST.get("code")
        stored_code = request.session.get("verification_code")  # ✅ Get verification code safely
        signup_data = request.session.get("signup_data")  # ✅ Get signup data safely

        if not stored_code or not signup_data:
            return JsonResponse({"status": "error", "message": "Session expired. Please sign up again."})

        if entered_code != stored_code:
            return JsonResponse({"status": "error", "message": "Invalid verification code!"})

        # ✅ Create and activate the user
        user = User.objects.create_user(
            username=signup_data["username"],
            email=signup_data["email"],
            password=signup_data["password"],
            first_name=signup_data["first_name"],
            last_name=signup_data["last_name"],
            is_active=True  # ✅ Activate the user
        )
        user.save()

        # ✅ Log in the user automatically after verification
        login(request, user)

        # ✅ Safely remove session keys
        request.session.pop("verification_code", None)  # ✅ No error if key doesn't exist
        request.session.pop("signup_data", None)  # ✅ No error if key doesn't exist

        return redirect("login_page")  # ✅ Redirect to login page

    return JsonResponse({"status": "error", "message": "Invalid request."})


@login_required
def user_info_api(request):
    user = request.user
    data = {
        'username': user.username,
        'email': user.email,
        'first_name': user.first_name,
        'last_name': user.last_name,
        # Add any other fields you want to expose
    }
    return JsonResponse(data)


def all_usernames_api(request):
    if request.method == "GET":
        usernames = list(User.objects.values_list('username', flat=True))
        print("Fetched usernames:", usernames)
        return JsonResponse({'usernames': usernames})
    else:
        return JsonResponse({'error': 'Only GET method allowed'}, status=405)





def forgot_password_view(request):
    if request.method == 'POST':
        email = request.POST.get('email')
        try:
            user = User.objects.get(email=email)
            code = str(random.randint(100000, 999999))
            request.session['reset_email'] = email
            request.session['reset_code'] = code

            send_mail(
                'Your Password Reset Code',
                f'Here is your verification code: {code}',
                '210103465stu.sdu.edu.kz',
                [email],
                fail_silently=False,
            )
            print(f"Send this code to {email}: {code}")  # Replace this with actual email logic
            return redirect('verify_password_code')
        except User.DoesNotExist:
            messages.error(request, "User with this email doesn't exist.")
    return render(request, 'users/forgot_password.html')

def verify_password_code_view(request):
    if request.method == 'POST':
        code = request.POST.get('code')
        if code == request.session.get('reset_code'):
            return redirect('reset_password_page')
        else:
            messages.error(request, "Invalid code.")
    return render(request, 'users/verify_password_code.html')



def reset_password_view(request):
    if request.method == 'POST':
        password1 = request.POST.get('password1')
        password2 = request.POST.get('password2')

        if password1 == password2:
            email = request.session.get('reset_email')
            print("Session email is:", email)

            try:
                user = User.objects.get(email=email)
                print("User found:", user.username)
                user.set_password(password1)
                user.save()
                messages.success(request, "Password reset successfully.")
                return redirect('login_page')
            except User.DoesNotExist:
                messages.error(request, "User not found with this email.")
        else:
            messages.error(request, "Passwords do not match.")
    return render(request, 'users/reset_password.html')


@csrf_exempt  # ❗Only needed if NOT sending CSRF — you're sending it, so this can be removed
def update_user_view(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user = request.user

            user.first_name = data.get("first_name", user.first_name)
            user.last_name = data.get("last_name", user.last_name)
            user.username = data.get("username", user.username)
            user.email = data.get("email", user.email)
            user.save()

            return JsonResponse({"status": "success", "message": "User updated successfully."})
        except Exception as e:
            print("Update error:", e)
            return JsonResponse({"status": "error", "message": "Could not update user."})
    return JsonResponse({"status": "error", "message": "Invalid method."})