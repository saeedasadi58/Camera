from django.urls import include, path
from rest_framework import routers
from webApp import views
from django.contrib.auth import views as drf_views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
app_name = 'webApp'

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.



# urlpatterns = [
#     path('login/', drf_views.LoginView.as_view(template_name='rest_framework/login.html'), name='login'),
#     path('logout/', drf_views.LogoutView.as_view(), name='logout'),
# ]


urlpatterns = [
    # path('login', views.Login.as_view()),
    path('login/', views.Login.as_view(template_name='login.html',), name='login'),
    path('logout/', drf_views.LogoutView.as_view(), name='logout'),

    path('docs', include(router.urls)),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]