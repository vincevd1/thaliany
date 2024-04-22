import json
import requests

class ThaliaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if('Authorization' in request.headers):
            res = requests.get('https://staging.thalia.nu/api/v2/members/me', headers={
                'Authorization': request.headers['Authorization']
            })

            request.thalia_user = res.content

        response = self.get_response(request)

        return response