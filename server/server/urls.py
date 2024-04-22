from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.redirected),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls'))
]
