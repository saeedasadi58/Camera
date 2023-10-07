from django.contrib.admin.models import LogEntry
from django.contrib.auth.decorators import login_required
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin
from django.contrib.auth.models import Permission
from django.core.paginator import Paginator
from django.db.models import Q
from django.shortcuts import render, get_object_or_404
from django.views.generic import DetailView, ListView
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView, UpdateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, DjangoModelPermissions
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet
from rest_framework.renderers import TemplateHTMLRenderer
from .models import User,Camera
from .permissions import OwnerCanManageOrReadOnly
from .serializers import UserSerializer, UserCrateSerializer, ChangePasswordSerializer, \
    AccountSerializer, CameraSerializer
from persiantools.jdatetime import JalaliDate
from datetime import datetime
from django.db.models import Avg, Count
from webApp.form import loginForm
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
# from rest_framework.response import Response
# from rest_framework.views import APIView


class Login(LoginView):
    renderer_classes = [TemplateHTMLRenderer]
    template_name = 'login.html'

    AuthenticationForm = loginForm

    form_class = AuthenticationForm
    authentication_form = None
    # template_name = "registration/login.html"
    redirect_authenticated_user = False
    extra_context = None

    @method_decorator(sensitive_post_parameters())
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def dispatch(self, request, *args, **kwargs):
        if self.redirect_authenticated_user and self.request.user.is_authenticated:
            redirect_to = "/"
            if redirect_to == self.request.path:
                raise ValueError(
                    "Redirection loop for authenticated user detected. Check that "
                    "your LOGIN_REDIRECT_URL doesn't point to a login page."
                )
            return HttpResponseRedirect(redirect_to)
        return super().dispatch(request, *args, **kwargs)


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


class ReadCameraView(Response):
    """
    API endpoint that allows groups to be viewed or edited.
    """

    queryset = Camera.objects.all()
    serializer_class = CameraSerializer

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


class ChangePasswordView(UpdateAPIView):
    """
    An endpoint for changing password.
    """
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (OwnerCanManageOrReadOnly,)

    def get_object(self, queryset=None):
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            # Check old password
            if not self.object.check_password(serializer.data.get("old_password")):
                return Response({"old_password": ["Wrong password."]}, status=status.HTTP_400_BAD_REQUEST)
            # set_password also hashes the password that the user will get
            self.object.set_password(serializer.data.get("new_password"))
            self.object.save()
            return Response("Success.", status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class StatusStaffView(LoginRequiredMixin, ListView):
    template_name = 'profile/status_staff.html'

    def get(self, request, *args, **kwargs):
        if request.user.is_superuser:
            if request.method == "GET":
                template_name = 'profile/status_staff.html'
                result = User.objects.all().order_by('date_joined')
                # for j in result:
                #     print(j.)
                # paginator = Paginator(result, 10)
                # page = request.GET.get('page')
                # result = paginator.get_page(page)
                context = {
                    'object_of_event': result,
                    # 'paginator': paginator,
                    'permission_flag': True
                }
                return render(request, template_name, context)
        return render(request, 'error_403.html')

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