from django.http import HttpResponse
from django.conf import settings
import jwt

class ThaliaMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if hasattr(request, 'path') and request.path.startswith("/api"):
            if('token' in request.COOKIES):
                jwt_token = request.COOKIES["token"]
                token_decoded = jwt.decode(jwt=jwt_token, key=settings.RSA_PUB_KEY, algorithms=["RS256"], audience=settings.CLIENT_ID)
                
                request.user_id = token_decoded["sub"]
            else:
                return HttpResponse(status=400)

        response = self.get_response(request)

        return response