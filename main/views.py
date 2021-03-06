from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import Project
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login, logout, authenticate
from django.contrib import messages


# Create your views here.
def homepage(request):
    return render(request=request,
                  template_name="main/home.html",
                  context={"projects": Project.objects.all})

def aboutme(request):
    return render(request,
                  template_name="main/aboutme.html")

def seeker(request):
    return render(request,
     template_name="main/seeker.html")

def register(request):
    if request.method == "POST":
        form = UserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            username = form.cleaned_data.get('username')
            messages.success(request, f"New Account Created: {username}")
            login(request, user)
            return redirect("main:homepage")
        else:
            for msg in form.error_messages:
                messages.error(request, f"{msg}: {form.error_messages}")


    form = UserCreationForm
    return render(request,
                  "main/register.html",
                  context={"form":form})