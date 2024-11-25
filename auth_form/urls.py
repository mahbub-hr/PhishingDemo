from django.urls import path
from .views import login_form  # Import from the same app

urlpatterns = [
    path("login/", login_form, name="login_form"),  # Define the login route
]
