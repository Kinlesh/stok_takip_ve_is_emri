# accounts/views.py
from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from .forms import CustomLoginForm

def login_view(request):
    if request.user.is_authenticated:
        return redirect('modul_secimi')

    form = CustomLoginForm(request, data=request.POST or None)
    if request.method == "POST":
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('modul_secimi')

    return render(request, 'frontend/login.html', {'form': form})

def logout_view(request):
    logout(request)
    return redirect('login')
