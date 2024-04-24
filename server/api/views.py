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
            'Authorization': request.headers['Authorization']
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
            'Authorization': request.headers['Authorization']
        })

    anyTimerRequest.objects.create(
        requester_id=request.thalia_user['pk'],
        recipient_id=target_id,
        requester_name=request.thalia_user['profile']['display_name'],
        recipient_name=res.json()['profile']['display_name'],
        amount=body['amount'],
        type=body['type'],
        description=body['description'],
    )
    return Response(200)

@api_view(['POST'])
def complete_anytimer(request, anytimer_id):
    anytimer = anyTimer.objects.get(owner_id=request.thalia_user['pk'], id=anytimer_id)
    anytimer.delete()
    return Response(200)

@api_view(['POST'])
def accept_anytimer(request ,request_id):
    anytimerrequest = anyTimerRequest.objects.get(recipient_id=request.thalia_user['pk'], id=request_id)
    anyTimer.objects.create(
        owner_id=anytimerrequest.requester_id,
        recipient_id=anytimerrequest.recipient_id,
        owner_name=anytimerrequest.requester_name,
        recipient_name=anytimerrequest.recipient_name,
        amount=anytimerrequest.amount,
        type=anytimerrequest.type,
        description=anytimerrequest.description,
    )
    anytimerrequest.delete()
    return Response(200)

@api_view(['POST'])
def deny_anytimer(request,request_id):
    anytimerrequest = anyTimerRequest.objects.get(recipient_id=request.thalia_user['pk'], id=request_id)
    anytimerrequest.delete()
    return Response(200)

@api_view(['POST'])
def revoke_request(request, request_id):
    anytimerrequest = anyTimerRequest.objects.get(requester_id=request.thalia_user['pk'], id=request_id)
    anytimerrequest.delete()
    return Response(200)

@api_view(['GET'])
def fetch_requests(request, direction):
    if direction == 'incoming':
        anytimerrequests = anyTimerRequest.objects.filter(recipient_id=request.thalia_user['pk'])
    elif direction == 'outgoing':
        anytimerrequests = anyTimerRequest.objects.filter(requester_id=request.thalia_user['pk'])
    else:
        return Response(status=400, data={'message': 'Invalid direction'})

    anytimerrequests_data = []
    for anytimerrequest in anytimerrequests:
        anytimerrequest_data = {
            'id': anytimerrequest.id,
            'owner_id': anytimerrequest.requester_id,
            'recipient_id': anytimerrequest.recipient_id,
            'owner_name': anytimerrequest.requester_name,
            'recipient_name': anytimerrequest.recipient_name,
            'amount': anytimerrequest.amount,
            'type': anytimerrequest.type,
            'description': anytimerrequest.description,
        }
        anytimerrequests_data.append(anytimerrequest_data)

    return Response(status=200, data=anytimerrequests_data)

@api_view(['GET'])
def fetch_anytimers(request, direction):
    if direction == 'incoming':
        anytimers = anyTimer.objects.filter(recipient_id=request.thalia_user['pk'])
    elif direction == 'outgoing':
        anytimers = anyTimer.objects.filter(owner_id=request.thalia_user['pk'])
    else:
        return Response(status=400, data={'message': 'Invalid direction'})

    anytimers_data = []
    for anytimer in anytimers:
        anytimer_data = {
            'id': anytimer.id,
            'owner_id': anytimer.owner_id,
            'recipient_id': anytimer.recipient_id,
            'owner_name': anytimer.owner_name,
            'recipient_name': anytimer.recipient_name,
            'amount': anytimer.amount,
            'type': anytimer.type,
            'description': anytimer.description,
        }
        anytimers_data.append(anytimer_data)

    return Response(status=200, data=anytimers_data)
