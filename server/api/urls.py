from django.urls import path
from . import views

urlpatterns = [
    path('users/<target_id>/give/', views.give_any, name="give_any"),
    path('users/<target_id>/request/', views.request_any, name="request_any"),
    path('anytimers/confirmed/<direction>/', views.fetch_anytimers, name="fetch_anytimers"),
    path('anytimers/requests/<direction>/', views.fetch_requests, name="fetch_requests"),
]