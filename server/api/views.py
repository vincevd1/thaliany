import json
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import anyTimer, anyTimerRequest

@api_view(['POST'])
def give_any(request, target_id):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    # Fetch owner user
    res = requests.get(f'https://staging.thalia.nu/api/v2/members/{target_id}', headers={
            'Authorization': request.thalia_user['Authorization']
        })

    anyTimer.objects.create(
        owner_id=target_id,
        recipient_id=request.thalia_user['pk'],
        owner_name=res.json()['profile']['display_name'],
        recipient_name=request.thalia_user['profile']['display_name'],
        amount=body['amount'],
        type=body['type'],
        description=body['description'],
    )

    return Response(200)

@api_view(['POST'])
def request_any(request, target_id):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)

    # Fetch owner user
    res = requests.get(f'https://staging.thalia.nu/api/v2/members/{target_id}', headers={
            'Authorization': request.thalia_user['Authorization']
        })

    anyTimerRequest.objects.create(
        requester_id=request.thalia_user['pk'],
        recipient_id=target_id,
        requester_name=res.json()['profile']['display_name'],
        recipient_name=request.thalia_user['profile']['display_name'],
        amount=body['amount'],
        type=body['type'],
        description=body['description'],
    )
    return Response(200)

@api_view(['GET'])
def fetch_requests():

    return Response(200)

@api_view(['GET'])
def fetch_anytimers():

    return Response(200)