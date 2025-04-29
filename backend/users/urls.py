from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.auth.views import LogoutView
from django.urls import path, include

from django.urls import path
from .views import signup_view, login_view, homepage, verify_code, verify_code_view, forgot_password_view, \
    verify_password_code_view, reset_password_view, user_info_api, all_usernames_api, update_user_view


urlpatterns = [
    path('signup/', signup_view, name='signup_page'),
    path('login/', login_view, name='login_page'),
    path('logout/', LogoutView.as_view(next_page='home_page'), name='logout'),
    path('', homepage, name='home_page'),


     # Page to add a new venue

    path('verify/', verify_code, name='verify_code'),
    path("verify-code/", verify_code_view, name="verify_code"),

    path('api/user-info/', user_info_api, name='user_info_api'),

    path('api/all-usernames/', all_usernames_api, name='all_usernames_api'),

    path('profile/update-user/', update_user_view, name='update_user'),

    path('forgot-password/', forgot_password_view, name='forgot_password'),
    path('verify-password-code/', verify_password_code_view, name='verify_password_code'),
    path('reset-password/', reset_password_view, name='reset_password_page')



]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)