from django.urls import path
from . import views

urlpatterns = [
    path('users/<id>/give/', views.give_any, name="give_any"),
]