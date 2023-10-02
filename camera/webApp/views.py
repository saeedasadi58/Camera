from django.shortcuts import render
import time
import json
import os
import requests
from io import BytesIO
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime, timedelta
from django.http import HttpResponse,JsonResponse
from django.urls import reverse
from django.conf import settings
from django.shortcuts import redirect
from django.http import HttpResponseRedirect
from django.http.response import Http404
from django.shortcuts import render
from django.utils.http import urlencode
from django.utils.encoding import smart_str
from django.views.decorators.http import require_http_methods
from django.views import View

from django.contrib.auth.decorators import login_required

# from oauth2_provider.views.generic import ProtectedResourceView
from .form import loginForm
from . import models
# Create your views here.

# class DashboardView(View):

def login(request, *arg, **kwargs):
    # try:
    form = loginForm()
    if request.method == "POST":
        form = loginForm(request.POST)
        if form.is_valid():
            user = ""
            if user == None:
                messages.error(request, 'Wrong username or password')
                return redirect('/login')
            else:
                return redirect('/')
    elif request.method == "GET":
        # if (request) == None:
        return render(request, 'login.html', {"form": form})
        # else:
        #     return redirect('/')
    else:
        return redirect('/')
    # except:
    #     return render(request, 'handle500.html')

# class ApiEndpoint(ProtectedResourceView):
#     def get(self, request, *args, **kwargs):
#         return HttpResponse('Hello, OAuth2!')

# @login_required()


def index(request, *arg, **kwargs):

    return HttpResponse("success")

