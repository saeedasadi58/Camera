import time

import django

django.setup()
from django.contrib.admin.models import LogEntry
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.models import Permission
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render, get_object_or_404, resolve_url, redirect
from django.views.generic import DetailView, ListView, View
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import TemplateHTMLRenderer
from .models import User, Camera, Proccess
from .permissions import OwnerCanManageOrReadOnly
from .serializers import UserSerializer, UserCrateSerializer, ChangePasswordSerializer, \
    AccountSerializer, CameraSerializer
from persiantools.jdatetime import JalaliDate
from datetime import datetime, timedelta
from django.db.models import Avg, Count
from webApp.form import loginForm, SettingsForm, ReportForm,kalibrSettingsForm
from django.contrib.auth.views import LoginView
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from django.http import HttpResponseRedirect, QueryDict
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from django.views.generic.edit import FormView
import functools
from django.contrib.auth.forms import (
    AuthenticationForm, )
from django.contrib.auth import (
    REDIRECT_FIELD_NAME, login as auth_login,
)
import warnings
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import url_has_allowed_host_and_scheme as is_safe_url
from rest_framework.authtoken.models import Token
from camera import settings
from multiprocessing import Pool, Process
from .BackCods.Python.plotly import plotting,analysis
# try:
#     from .BackCods.Python.plotly import *
# except:
#     pass
from django.contrib import messages
import json
from django import db
import random
import os


class RemovedInDjango21Warning(PendingDeprecationWarning):
    pass


class SuccessURLAllowedHostsMixin:
    success_url_allowed_hosts = set()

    def get_success_url_allowed_hosts(self):
        return {self.request.get_host(), *self.success_url_allowed_hosts}


class LoginView(SuccessURLAllowedHostsMixin, FormView):
    """
    Display the login form and handle the login action.
    """

    form_class = loginForm
    authentication_form = loginForm
    redirect_field_name = REDIRECT_FIELD_NAME
    template_name = 'newLogin.html'
    redirect_authenticated_user = False
    extra_context = None

    @method_decorator(sensitive_post_parameters())
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if self.redirect_authenticated_user and self.request.user.is_authenticated:
            redirect_to = self.get_success_url()
            if redirect_to == self.request.path:
                raise ValueError(
                    "Redirection loop for authenticated user detected. Check that "
                    "your LOGIN_REDIRECT_URL doesn't point to a login page."
                )
            return HttpResponseRedirect(redirect_to)
        return super().dispatch(request, *args, **kwargs)

    def get_success_url(self):
        url = self.get_redirect_url()
        return url or resolve_url(settings.LOGIN_REDIRECT_URL)

    def get_redirect_url(self):
        """Return the user-originating redirect URL if it's safe."""
        redirect_to = self.request.POST.get(
            self.redirect_field_name,
            self.request.GET.get(self.redirect_field_name, '')
        )
        url_is_safe = is_safe_url(
            url=redirect_to,
            allowed_hosts=self.get_success_url_allowed_hosts(),
            require_https=self.request.is_secure(),
        )
        return redirect_to if url_is_safe else ''

    def get_form_class(self):
        return self.authentication_form or self.form_class

    def get_form_kwargs(self):
        kwargs = super().get_form_kwargs()
        kwargs['request'] = self.request
        return kwargs

    def form_valid(self, form):
        """Security check complete. Log the user in."""
        # token = Token.objects.get_or_create(user=form.get_user())
        auth_login(self.request, form.get_user())
        return HttpResponseRedirect(self.get_success_url())

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_site = get_current_site(self.request)
        context.update({
            self.redirect_field_name: self.get_redirect_url(),
            'site': current_site,
            'site_name': current_site.name,
            **(self.extra_context or {})
        })
        return context


def deprecate_current_app(func):
    """
    Handle deprecation of the current_app parameter of the views.
    """

    @functools.wraps(func)
    def inner(*args, **kwargs):
        if 'current_app' in kwargs:
            warnings.warn(
                "Passing `current_app` as a keyword argument is deprecated. "
                "Instead the caller of `{0}` should set "
                "`request.current_app`.".format(func.__name__),
                'RemovedInDjango20Warning'
            )
            current_app = kwargs.pop('current_app')
            request = kwargs.get('request', None)
            if request and current_app is not None:
                request.current_app = current_app
        return func(*args, **kwargs)

    return inner


@deprecate_current_app
def login(request, *args, **kwargs):
    print(request)
    warnings.warn(
        'The login() view is superseded by the class-based LoginView().',
        RemovedInDjango21Warning, stacklevel=2
    )
    return LoginView.as_view(**kwargs)(request, *args, **kwargs)


from django.http import HttpResponse
from django.http import JsonResponse


class CameraViewData(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        if kwargs['to_date'] != "0":
            to_date = datetime.strptime(kwargs['to_date'], '%Y-%m-%d %H:%M:%S.%f')
        else:
            to_date = (datetime.today() + timedelta(days=1)).strftime('%Y-%m-%d %H:%M:%S.%f')
        data = Proccess.objects.filter(
            start_date__range=[datetime.strptime(kwargs['from_date'], '%Y-%m-%d %H:%M:%S.%f'), to_date])
        D20 = []
        D40 = []
        D50 = []
        D80 = []

        for i in data:
            # print(i)
            D20.append(i.D20)
            D40.append(i.D40)
            D50.append(i.D50)
            D80.append(i.D80)

        print("saeed /-/-/-/-/--/-/-/-/-/-/-/-/-/-/-/-/-//-", D20, D40, D50, D80)
        # return HttpResponse(Proccess.objects.filter(start_date__range=[datetime.strptime(kwargs['from_date'], '%Y-%m-%d %H:%M:%S.%f'),to_date]))
        return JsonResponse(({"D20": D20, "D40": D40, "D50": D50, "D80": D80}))

class MatlabAnalysis(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        print("------------axs ------------------")

        return HttpResponse(analysis())


def plotting2():
    while True:
        print("--------------------", datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f'))
        # read_camera()
        random_number_D20 = random.uniform(10, 11.32)
        random_number_D40 = random.uniform(11.35, 13.008)
        random_number_D50 = random.uniform(13.1, 15)
        random_number_D80 = random.uniform(15.2, 16.35)
        Proccess.objects.create(D20=random_number_D20, D40=random_number_D40, D50=random_number_D50,
                                D80=random_number_D80, start_date=datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f'))

        time.sleep(1)


Proce = Process(target=plotting2, args=())


class ReadCameraView(LoginRequiredMixin, View):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    # def __init__(self):
    #     self.

    def get(self, request, *args, **kwargs):

        # settings_form = SettingsForm()
        with open('webApp/setting.json') as f:
            data = json.load(f)
        print("saeed data ************ ", data)
        settings_form = SettingsForm(initial={
            "ExposureTime": data["setting"]["CameraSettings"]["ExposureTime"],
            "Gain": data["setting"]["CameraSettings"]["Gain"],
            "Width": data["setting"]["CameraSettings"]["Width"],
            "Height": data["setting"]["CameraSettings"]["Height"],
            "FrameRate": data["setting"]["CameraSettings"]["FrameRate"],
            "PixelFormat": data["setting"]["CameraSettings"]["PixelFormat"],
            "AutoWhiteBalance": data["setting"]["CameraSettings"]["AutoWhiteBalance"],
            "ColorBalanceRed": data["setting"]["CameraSettings"]["ColorBalanceRed"],
            "ColorBalanceBlue": data["setting"]["CameraSettings"]["ColorBalanceBlue"],

        })

        kalibr_settings_form = kalibrSettingsForm(initial={
            "samplingTime": data["setting"]["PanelSettings"]["samplingTime"],
            "processedSeparately": data["setting"]["PanelSettings"]["processedSeparately"],
            "processPerSeconds": data["setting"]["PanelSettings"]["processPerSeconds"],
            "calibration": data["setting"]["PanelSettings"]["calibration"],
            "coefficient_N": data["setting"]["PanelSettings"]["coefficient_N"],
            "coefficient_X": data["setting"]["PanelSettings"]["coefficient_X"],
            "separationAlgorithm": data["setting"]["PanelSettings"]["separationAlgorithm"],
            "evaluated": data["setting"]["PanelSettings"]["evaluated"],
        })
        data = {
            "SettingsForm": settings_form,
            "KalibrSettingsForm": kalibr_settings_form,
            "ReportForm": ReportForm,
            "play": Proce.is_alive(),
            "play_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        }
        return render(request, "index.html", {"data": data})

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("uploaded")
        permission = Permission.objects.filter(user=request.user)
        grouppermission = request.user.get_group_permissions()
        data = {
            "SettingsForm": SettingsForm,
            "ReportForm": ReportForm,
            "play": Proce.is_alive(),
            "play_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S.%f')
        }
        if request.user.is_superuser or permission or grouppermission:
            if files and len(files) > 0:
                messages.success(request, "file is there")
                for csv_file in files:
                    pass
            else:
                # try:
                if Proce.is_alive():

                    data["play"] = False
                    Proce.terminate()
                    Proce.kill()
                    # Proce.close()

                else:
                    # Proce = Process(target=plotting2, args=())
                    try:
                        Proce.start()
                    except:
                        Proce.join()
                        Proce.start()


                        # Proce = Process(target=plotting2, args=())
                        # Proce.start()
                        ...
                    data["play"] = Proce.is_alive()
                    # camera = read_camera()
                    # if camera:
                    #     Proce.start()
                    #     camera = read_camera()
                    #     data["play"] = Proce.is_alive()
                    #     messages.success(request, f" فعال است. {camera} دوربین ")
                # except:
                #     data["play"] = Proce.is_alive()
                #     messages.error(request, f" هیچ دوربینی یافت نشد. ")

        else:
            messages.error(request, 'نام کاربری که با آن وارد شدید اجازه انجام این عملیات را ندارد.')
            return self.get(request, *args, **kwargs)

        return render(request, "index.html", {"data": data})


class Settings(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):

        if request.method == "POST":
            settings_form = SettingsForm(request.POST)
            print(settings_form.is_valid())
            settings_cleaned = settings_form.cleaned_data
            if settings_cleaned:
                f = open('webApp/setting.json', "r+")
                data = json.load(f)
                os.remove("webApp/setting.json")
                data["setting"]["CameraSettings"]["ExposureTime"] = settings_cleaned["ExposureTime"]
                data["setting"]["CameraSettings"]["Width"] = settings_cleaned["Width"]
                data["setting"]["CameraSettings"]["Height"] = settings_cleaned["Height"]
                data["setting"]["CameraSettings"]["FrameRate"] = settings_cleaned["FrameRate"]
                data["setting"]["CameraSettings"]["PixelFormat"] = settings_cleaned["PixelFormat"]
                data["setting"]["CameraSettings"]["AutoWhiteBalance"] = settings_cleaned["AutoWhiteBalance"]
                data["setting"]["CameraSettings"]["ColorBalanceRed"] = settings_cleaned["ColorBalanceRed"]
                data["setting"]["CameraSettings"]["ColorBalanceBlue"] = settings_cleaned["ColorBalanceBlue"]

                # data["setting"]["PanelSettings"]["samplingTime"] = settings_cleaned["samplingTime"]
                # data["setting"]["PanelSettings"]["processedSeparately"] = settings_cleaned["processedSeparately"]
                # data["setting"]["PanelSettings"]["processPerSeconds"] = settings_cleaned["processPerSeconds"]
                # data["setting"]["PanelSettings"]["calibration"] = settings_cleaned["calibration"]
                # data["setting"]["PanelSettings"]["evaluated"] = settings_cleaned["evaluated"]
                # data["setting"]["PanelSettings"]["coefficient_N"] = settings_cleaned["coefficient_N"]
                # data["setting"]["PanelSettings"]["coefficient_X"] = settings_cleaned["coefficient_X"]
                # data["setting"]["PanelSettings"]["separationAlgorithm"] = settings_cleaned["separationAlgorithm"]

                f = open('webApp/setting.json', "w")
                f.write(json.dumps(data))
                f.close()

        return redirect("/")

class KalibrSettings(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):

        if request.method == "POST":
            settings_form = kalibrSettingsForm(request.POST)
            print(settings_form.is_valid())
            settings_cleaned = settings_form.cleaned_data
            if settings_cleaned:
                f = open('webApp/setting.json', "r+")
                data = json.load(f)
                os.remove("webApp/setting.json")
                # data["setting"]["CameraSettings"]["ExposureTime"] = settings_cleaned["ExposureTime"]
                # data["setting"]["CameraSettings"]["Width"] = settings_cleaned["Width"]
                # data["setting"]["CameraSettings"]["Height"] = settings_cleaned["Height"]
                # data["setting"]["CameraSettings"]["FrameRate"] = settings_cleaned["FrameRate"]
                # data["setting"]["CameraSettings"]["PixelFormat"] = settings_cleaned["PixelFormat"]
                # data["setting"]["CameraSettings"]["AutoWhiteBalance"] = settings_cleaned["AutoWhiteBalance"]
                # data["setting"]["CameraSettings"]["ColorBalanceRed"] = settings_cleaned["ColorBalanceRed"]
                # data["setting"]["CameraSettings"]["ColorBalanceBlue"] = settings_cleaned["ColorBalanceBlue"]

                data["setting"]["PanelSettings"]["samplingTime"] = settings_cleaned["samplingTime"]
                data["setting"]["PanelSettings"]["processedSeparately"] = settings_cleaned["processedSeparately"]
                data["setting"]["PanelSettings"]["processPerSeconds"] = settings_cleaned["processPerSeconds"]
                data["setting"]["PanelSettings"]["calibration"] = settings_cleaned["calibration"]
                data["setting"]["PanelSettings"]["evaluated"] = settings_cleaned["evaluated"]
                data["setting"]["PanelSettings"]["coefficient_N"] = settings_cleaned["coefficient_N"]
                data["setting"]["PanelSettings"]["coefficient_X"] = settings_cleaned["coefficient_X"]
                data["setting"]["PanelSettings"]["separationAlgorithm"] = settings_cleaned["separationAlgorithm"]

                f = open('webApp/setting.json', "w")
                f.write(json.dumps(data))
                f.close()

        return redirect("/")
