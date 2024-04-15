from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['POST'])
def give_any(request, id):
    print(request, id)
    return Response(200)
