from django.urls import path
from . import views

urlpatterns = [
    path('users/<target_id>/give/', views.give_any, name="give_any"),
    path('users/<target_id>/request/', views.request_any, name="request_any"),
    path('anytimers/confirmed/<direction>/', views.fetch_anytimers, name="fetch_anytimers"),
    path('anytimers/requests/<direction>/', views.fetch_requests, name="fetch_requests"),
    path('anytimers/requests/<request_id>/deny/', views.deny_anytimer, name="deny_anytimer"),
    path('anytimers/requests/<request_id>/accept/', views.accept_anytimer, name="accept_anytimer"),
    path('anytimers/requests/<anytimer_id>/complete/', views.complete_anytimer, name="complete_anytimer"),
    path('anytimers/requests/<request_id>/revoke/', views.revoke_request, name="revoke_request"),
]