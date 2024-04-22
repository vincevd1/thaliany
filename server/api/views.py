import json
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def give_any(request, id):
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    print(body_unicode)
    return Response(200)

@api_view(['POST'])
def request_any(request, id):
    return Response(200)