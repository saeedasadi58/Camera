# from django.urls import include, path
# from rest_framework import routers
# from webApp import views
# from django.contrib.auth import views as drf_views
#
# router = routers.DefaultRouter()
# router.register(r'readCamera', views.ReadCameraViewSet)
# router.register(r'users', views.UserViewSet)
# router.register(r'groups', views.GroupViewSet)
# # router.register(r'groups', views.GroupViewSet)
# app_name = 'webApp'
from django.urls import path, include
from rest_framework.routers import DefaultRouter
# from rest_framework_jwt.views import obtain_jwt_token
# from .views import UserUpdateApiView, UserListApiView
from webApp import views
from django.contrib.auth import views as drf_views

app_name = 'webApp'
router = DefaultRouter()
# router.register(r'profile', views.ProfileView)
router.register(r'readCamera', views.ReadCameraView,basename="webApp")
#
# # Wire up our API using automatic URL routing.
# # Additionally, we include login URLs for the browsable API.
#
#
#
# # urlpatterns = [
# #     path('login/', drf_views.LoginView.as_view(template_name='rest_framework/login.html'), name='login'),
# #     path('logout/', drf_views.LogoutView.as_view(), name='logout'),
# # ]
#
#
urlpatterns = [
    # path('login', views.Login.as_view()),
    path('login/', drf_views.LoginView.as_view(template_name='login.html'), name='login'),
    path('logout/', drf_views.LogoutView.as_view(), name='logout'),
    path('docs/', include(router.urls)),
    path('docs/list/', views.create_project, name="list"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]



#
# urlpatterns = [
#     path('login/', views.Login.as_view(template_name='login.html',), name='login'),
#     path('logout/', drf_views.LogoutView.as_view(), name='logout'),
#     path('docs/', include(router.urls)),
#     path('docs/<pk>/edit/', UserUpdateApiView.as_view(), name='edit'),
#     path('docs/list/', UserListApiView.as_view()),
#     path('docs/changepassword/', ChangePasswordView.as_view(), name='change-password-api'),
#     # path('api/token/auth/', obtain_jwt_token),
#     path('<int:pk>/ProfileDetail/', ProfileDetileView.as_view(), name='profile-detail'),
#     # path('<int:pk>/tracking/', Tracking.as_view(), name='tracking'),
#     path('StatusStaff/', StatusStaffView.as_view(), name='status_staff'),
#     path('', views.profile, name='profile'),
#     path('docs/', include(router.urls)),
#     path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
# ]
