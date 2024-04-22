from django.urls import path
from . import views

urlpatterns = [
    path('users/<target_id>/give/', views.give_any, name="give_any"),
    path('users/<target_id>/request/', views.request_any, name="request_any"),
    path('users/<id>/anytimers/', views.fetch_anytimers, name="fetch_anytimers"),
]