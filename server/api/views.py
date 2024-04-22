import json
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import anyTimer

@api_view(['POST'])
def give_any(request, target_id):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body)

    anyTimer.objects.create(owner_id=target_id, recipient_id=target_id, amount=body['amount'], type=body['type'], description=body['description'])

    return Response(200)

@api_view(['POST'])
def request_any(request, target_id):
    return Response(200)