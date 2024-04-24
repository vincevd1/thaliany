import json
import requests
from django.http import HttpResponse

class ThaliaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if('Authorization' in request.headers):
            res = requests.get('https://staging.thalia.nu/api/v2/members/me', headers={
                'Authorization': request.headers['Authorization']
            })
            
            if res.status_code != 200:
                return HttpResponse(status=res.status_code , content=res.text)

            request.thalia_user = res.json()

        response = self.get_response(request)

        return response