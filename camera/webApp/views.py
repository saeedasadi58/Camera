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
from .models import User, Camera
from .permissions import OwnerCanManageOrReadOnly
from .serializers import UserSerializer, UserCrateSerializer, ChangePasswordSerializer, \
    AccountSerializer, CameraSerializer
from persiantools.jdatetime import JalaliDate
from datetime import datetime
from django.db.models import Avg, Count
from webApp.form import loginForm, SettingsForm
from django.contrib.auth.views import LoginView
from django.views.decorators.debug import sensitive_post_parameters
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.cache import never_cache
from django.http import HttpResponseRedirect, QueryDict
# from django.contrib.auth.models import Group
# from django.contrib.auth import get_user_model
# from rest_framework import viewsets
# from rest_framework import permissions
# from webApp.serializers import UserSerializer
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
from .BackCods.Python.plotly import *
from django.contrib import messages
import json

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
    template_name = 'login.html'
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


class ReadCameraView(LoginRequiredMixin, View):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    # queryset = Camera.objects.all()
    # serializer_class = CameraSerializer
    def get(self, request, *args, **kwargs):

        # settings_form = SettingsForm()
        with open('webApp/setting.json') as f:
            data = json.load(f)
        print("saeed data ************ ",data)
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
            "samplingTime": data["setting"]["PanelSettings"]["samplingTime"],
            "processedSeparately": data["setting"]["PanelSettings"]["processedSeparately"],
            "processPerSeconds": data["setting"]["PanelSettings"]["processPerSeconds"],
            "calibration": data["setting"]["PanelSettings"]["calibration"],
            "evaluatedDirectly": data["setting"]["PanelSettings"]["evaluatedDirectly"],
            "evaluatedAutomatically": data["setting"]["PanelSettings"]["evaluatedAutomatically"],
            "evaluatedExperimental": data["setting"]["PanelSettings"]["evaluatedExperimental"],
            "coefficient_N": data["setting"]["PanelSettings"]["coefficient_N"],
            "coefficient_X": data["setting"]["PanelSettings"]["coefficient_X"],
            "separationAlgorithm": data["setting"]["PanelSettings"]["separationAlgorithm"],
        })
        data = {
            "SettingsForm": settings_form,
            "customerList": "customerList",
            "Custpmers": "Customers",
            "searchTestPerson": "searchTest"
        }
        return render(request, "main.html", {"data": data})

    def post(self, request, *args, **kwargs):
        files = request.FILES.getlist("uploaded")
        permission = Permission.objects.filter(user=request.user)
        grouppermission = request.user.get_group_permissions()
        data = {
            "SettingsForm": SettingsForm,
            "customerList": "customerList",
            "Custpmers": "Customers",
            "searchTestPerson": "searchTest"
        }
        if request.user.is_superuser or permission or grouppermission:
            if files and len(files) > 0:
                messages.success(request, "file is there")
                for csv_file in files:
                    pass
            else:
                camera = read_camera()
                if camera["code"] == -1:
                    messages.error(request, camera["message"])


        else:
            messages.error(request, 'نام کاربری که با آن وارد شدید اجازه انجام این عملیات را ندارد.')
            return self.get(request, *args, **kwargs)

        return render(request, "main.html", {"data": data})


class Settings(LoginRequiredMixin, View):

    def post(self, request, *args, **kwargs):
        print("saeed ------------- ", request.POST)
        if request.method == 'POST':
            regForm = SettingsForm(request.POST)  # form needs content
            if regForm.is_valid():
                print("saeed ------------- regForm.is_valid ", regForm.is_valid())

        if request.method == "POST":
            settings_form = SettingsForm(request.POST)
            print("saeed ------------- ", settings_form.is_valid())
            if settings_form.is_valid():
                print("saeed ------------- ", settings_form.cleaned_data)

        return redirect("/")

#
# class StandardResultsSetPagination(PageNumberPagination):
#     # this feature set the number of recored for present per page
#     page_size = 50
#     page_size_query_param = 'page_size'
#     max_page_size = 50
#
#
# class CloudPagination(PageNumberPagination):
#     # this feature set the number of recored for present per page
#     page_size = 1000
#     page_size_query_param = 'page_size'
#     max_page_size = 1000
#
#
# class UserListApiView(ListCreateAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserCrateSerializer
#     permission_classes = [DjangoModelPermissions]
#     pagination_class = StandardResultsSetPagination

# permission_classes = [AllowAny]

# for hashing password
# def perform_create(self, serializer):
#     instance = serializer.save()
#     instance.set_password(instance.password)
#     instance.save()


# class ProfileView(ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = AccountSerializer
#     pagination_class = StandardResultsSetPagination
#     permission_classes = [AllowAny]
#
#     # for hashing password
#     def perform_create(self, serializer):
#         instance = serializer.save()
#         instance.set_password(instance.password)
#         instance.save()
#
#
# class UserUpdateApiView(RetrieveUpdateDestroyAPIView):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [OwnerCanManageOrReadOnly]
#
#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)
#
#         if serializer.is_valid():
#             # Check old password
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
#             # set_password also hashes the password that the user will get
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()
#             return Response("Success.", status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#

# @api_view(['GET'])
# def create_project(request):
#     # data = first_task()
#     # second_task(data) # want to run this function at background
#     return Response("asdasdasdsad")  # want to return this response after completion of first_task()
#
#
# class ReadCameraView(LoginRequiredMixin, View):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#
#     # queryset = Camera.objects.all()
#     # serializer_class = CameraSerializer
#     def get(self, request, *args, **kwargs):
#         return render(request, "error_403.html")

# def get(self, request, *args, **kwargs):
#     if request.user.is_superuser:
#         if request.method == "GET":
#             template_name = 'profile/status_staff.html'
#             result = User.objects.all().order_by('date_joined')
#             # for j in result:
#             #     print(j.)
#             # paginator = Paginator(result, 10)
#             # page = request.GET.get('page')
#             # result = paginator.get_page(page)
#             context = {
#                 'object_of_event': result,
#                 # 'paginator': paginator,
#                 'permission_flag': True
#             }
#             return render(request, template_name, context)
#     return render(request, 'error_403.html')

# def get(self,request,*args,**kwargs):
#     return HttpResponse("ok")
# permission_classes = [DjangoModelPermissions]
# pagination_class = StandardResultsSetPagination

# def perform_create(self, serializer):
#     instance = serializer.save()
#     # instance.set_password(instance.password)
#     instance.save()


# class AddCameraViewSet(ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#
#     queryset = Camera.objects.all()
#     serializer_class = GroupSerializer

#
# class ChangePasswordView(UpdateAPIView):
#     """
#     An endpoint for changing password.
#     """
#     serializer_class = ChangePasswordSerializer
#     model = User
#     permission_classes = (OwnerCanManageOrReadOnly,)
#
#     def get_object(self, queryset=None):
#         obj = self.request.user
#         return obj
#
#     def update(self, request, *args, **kwargs):
#         self.object = self.get_object()
#         serializer = self.get_serializer(data=request.data)
#
#         if serializer.is_valid():
#             # Check old password
#             if not self.object.check_password(serializer.data.get("old_password")):
#                 return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
#             # set_password also hashes the password that the user will get
#             self.object.set_password(serializer.data.get("new_password"))
#             self.object.save()
#             return Response("Success.", status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#
#
# class StatusStaffView(LoginRequiredMixin, ListView):
#     template_name = 'profile/status_staff.html'
#
#     def get(self, request, *args, **kwargs):
#         if request.user.is_superuser:
#             if request.method == "GET":
#                 template_name = 'profile/status_staff.html'
#                 result = User.objects.all().order_by('date_joined')
#                 # for j in result:
#                 #     print(j.)
#                 # paginator = Paginator(result, 10)
#                 # page = request.GET.get('page')
#                 # result = paginator.get_page(page)
#                 context = {
#                     'object_of_event': result,
#                     # 'paginator': paginator,
#                     'permission_flag': True
#                 }
#                 return render(request, template_name, context)
#         return render(request, 'error_403.html')

#
# @login_required
# def profile(request):
#     return render(request, 'profile/base.html')
#
#
# def error_404(request, exception):
#     data = {}
#     return render(request, 'error_404.html', data)
#
#
# def error_500(request):
#     data = {}
#     return render(request, 'error_500.html', data)
#
#
# def error_403(request, exception):
#     data = {}
#     return render(request, 'error_403.html', data)


# class UserViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows users to be viewed or edited.
#     """
#     queryset = User.objects.all().order_by('-date_joined')
#     serializer_class = UserSerializer
#     permission_classes = [permissions.IsAuthenticated]


# class GroupViewSet(viewsets.ModelViewSet):
#     """
#     API endpoint that allows groups to be viewed or edited.
#     """
#     queryset = Group.objects.all()
#     serializer_class = GroupSerializer
#     permission_classes = [permissions.IsAuthenticated]
