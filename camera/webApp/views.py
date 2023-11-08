import django

django.setup()
import time
from django.views.decorators.csrf import csrf_exempt
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
from .models import User, Camera, Proccess, ProccessInfo
from .permissions import OwnerCanManageOrReadOnly
from .serializers import UserSerializer, UserCrateSerializer, ChangePasswordSerializer, \
    AccountSerializer, CameraSerializer
from persiantools.jdatetime import JalaliDate
from datetime import datetime, timedelta
from django.db.models import Avg, Count
from webApp.form import loginForm, SettingsForm, ReportForm, kalibrSettingsForm, CalibrationFileForm
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
from .BackCods.Python.plotly import analysis, calibration
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

        # print("saeed /-/-/-/-/--/-/-/-/-/-/-/-/-/-/-/-/-//-", D20, D40, D50, D80)
        return JsonResponse(({"D20": D20, "D40": D40, "D50": D50, "D80": D80}))


class MatlabAnalysis(LoginRequiredMixin, View):
    def get(self, request, *args, **kwargs):
        if "check" in kwargs and kwargs["check"]:
            try:
                camera = read_camera()
                if camera:
                    messages.success(request, f". فعال است {camera} دوربین ")
                    return HttpResponse("True")
            except:
                messages.error(request, ". دوربین یافت نشد ")
                return HttpResponse("False")

        return HttpResponse(self.plotting())

    def plotting(self):

        try:
            p_info = ProccessInfo.objects.filter().order_by('-id')
            p_info = p_info[0]
            if p_info.run:
                p_info.run = False
                p_info.stop_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f')
                p_info.save()
            else:
                p_info.run = True
                p_info.start_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f')
                p_info.save()

            while p_info.run:

                try:
                    camera = read_camera()
                    if camera:
                        ...
                    else:
                        p_info.run = False
                        p_info.stop_date = datetime.today().strftime('%Y-%m-%d %H:%M:%S.%f')
                        p_info.save()
                        break
                except:
                    break

                analysised_data = analysis()
                output_figure = open("webApp/BackCods/Matlab/output_figure.png", "rb")
                with open("webApp/static/image/output_figure.png", "wb") as f:
                    f.write(output_figure.read())

                output_img = open("webApp/BackCods/Matlab/IMG.jpg", "rb")
                with open("webApp/static/image/cameraPic.png", "wb") as f:
                    f.write(output_img.read())

                # time.sleep(1)
                if analysised_data == False:
                    break
        except:
            return HttpResponse("False")


class ReadCameraView(LoginRequiredMixin, View):

    def get(self, request, *args, **kwargs):

        with open('webApp/setting.json') as f:
            data = json.load(f)
        process = ProccessInfo.objects.filter().order_by('-id')[0]

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
            "calibration_persent": data["setting"]["PanelSettings"]["calibration_persent"],
            "coefficient_N": data["setting"]["PanelSettings"]["coefficient_N"],
            "coefficient_X": data["setting"]["PanelSettings"]["coefficient_X"],
            "separationAlgorithm": data["setting"]["PanelSettings"]["separationAlgorithm"],
            "evaluated": data["setting"]["PanelSettings"]["evaluated"],
        })
        data = {
            "SettingsForm": settings_form,
            "KalibrSettingsForm": kalibr_settings_form,
            "CalibrationFileForm": CalibrationFileForm,
            "ReportForm": ReportForm,
            "play": process.run,
            "play_date": process.start_date.strftime('%Y-%m-%d %H:%M:%S.%f')
        }
        return render(request, "index.html", {"data": data})

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("uploaded")
        permission = Permission.objects.filter(user=request.user)
        grouppermission = request.user.get_group_permissions()
        process = ProccessInfo.objects.filter().order_by('-id')[0]
        data = {
            "SettingsForm": SettingsForm,
            "ReportForm": ReportForm,
            "play": process.run,
            "play_date": process.start_date.strftime('%Y-%m-%d %H:%M:%S.%f')
        }
        if request.user.is_superuser or permission or grouppermission:
            if files and len(files) > 0:
                messages.success(request, "file is there")
                for csv_file in files:
                    pass
            else:
                ...

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
                data["setting"]["CameraSettings"]["ExposureTime"] = settings_cleaned["ExposureTime"]
                data["setting"]["CameraSettings"]["Width"] = settings_cleaned["Width"]
                data["setting"]["CameraSettings"]["Height"] = settings_cleaned["Height"]
                data["setting"]["CameraSettings"]["FrameRate"] = settings_cleaned["FrameRate"]
                data["setting"]["CameraSettings"]["PixelFormat"] = settings_cleaned["PixelFormat"]
                data["setting"]["CameraSettings"]["AutoWhiteBalance"] = settings_cleaned["AutoWhiteBalance"]
                data["setting"]["CameraSettings"]["ColorBalanceRed"] = settings_cleaned["ColorBalanceRed"]
                data["setting"]["CameraSettings"]["ColorBalanceBlue"] = settings_cleaned["ColorBalanceBlue"]
                os.remove("webApp/setting.json")

                f = open('webApp/setting.json', "w")
                f.write(json.dumps(data))
                f.close()

        return redirect("/")


def uploadOrginalImage(arg, request):
    imgdata = arg['file']
    with open("./webApp/BackCods/Matlab/IMGC.jpg", 'wb') as f:
        f.write(imgdata)

    file = ""
    with open('./webApp/BackCods/Matlab/calibration_BK.m', 'r') as f:
        file = f.read()
        f.close()

    with open('./webApp/BackCods/Matlab/calibration.m', 'w') as f:
        f.write(file.replace("dimensionofball = 20", f"dimensionofball = {arg['name']}"))
        f.close()

    with open('./webApp/BackCods/Matlab/analysis_BK.m', 'r') as f:
        file = f.read()
        f.close()
    data = calibration()

    with open('webApp/setting.json', "r+") as f:
        json_file = json.load(f)
        json_file["setting"]["PanelSettings"]["calibration_persent"] = str(data)
        json_file["setting"]["PanelSettings"]["calibration"] = str(arg['name'])
        f.close()
        os.remove("webApp/setting.json")

        f = open('webApp/setting.json', "w")
        f.write(json.dumps(json_file))
        f.close()

    with open('./webApp/BackCods/Matlab/analysis.m', 'w') as f:
        f.write(file.replace("calibcoeff = 12.7", f"calibcoeff = {data}"))
        f.close()

    return str(data)


@csrf_exempt
def uploadOrginalImageViwe(request, *arg, **kwargs):
    data = {
        "file": request.body,
        "name": kwargs['name']
    }

    result = uploadOrginalImage(data, request)

    return HttpResponse(f"{result}")


class KalibrSettings(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):

        if request.method == "POST":

            settings_form = kalibrSettingsForm(request.POST)
            print(settings_form.is_valid())
            settings_cleaned = settings_form.cleaned_data
            if settings_cleaned:
                f = open('webApp/setting.json', "r+")
                data = json.load(f)
                data["setting"]["PanelSettings"]["samplingTime"] = settings_cleaned["samplingTime"]
                data["setting"]["PanelSettings"]["processedSeparately"] = settings_cleaned["processedSeparately"]
                data["setting"]["PanelSettings"]["processPerSeconds"] = settings_cleaned["processPerSeconds"]
                data["setting"]["PanelSettings"]["evaluated"] = settings_cleaned["evaluated"]
                data["setting"]["PanelSettings"]["coefficient_N"] = settings_cleaned["coefficient_N"]
                data["setting"]["PanelSettings"]["coefficient_X"] = settings_cleaned["coefficient_X"]
                data["setting"]["PanelSettings"]["separationAlgorithm"] = settings_cleaned["separationAlgorithm"]
                os.remove("webApp/setting.json")

                f = open('webApp/setting.json', "w")
                f.write(json.dumps(data))
                f.close()

        return redirect("/")
