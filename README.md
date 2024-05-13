# Thaliany

## Origins

When I (Vince) started my bacherlor here at Radboud I quickly heard about there being a need for a website where people can keep track of their anytimers, so in September I started working on this project whereafter I finished it for the course R&D together with Luuk Schukkink. After that Dirk Doesburg helped me deploying the site on one of thalia's servers, solving some security issues and all round improving.

## Installation

1. Clone this github repository
2. Go into the client folder and install dependencies with ```npm install```
3. Create an env file in the client directory, which will look something like the following for development:
    ```env
    VITE_CLIENT_ID=7xLk3gkoqC4ANdl9r7vAR19sxgEb5EIp5pVBgYfJ
    VITE_CONCREXIT_URI=https://staging.thalia.nu
    VITE_AUTH_PATH=/user/oauth/authorize/
    VITE_TOKEN_PATH=/user/oauth/token/
    VITE_REDIRECT_URI=http://localhost:5173/auth/callback
    VITE_BACKEND_URI=http://localhost:8000
   ```
4. Start a development server with ```npm run dev```
5. Go into the server directory and create a virtual environment for django
6. Apply migrations with ```python manage.py migrate```
7. Create a superuser with ```python manage.py createsuperuser```
8. Start the django server with ```python manage.py runserver```
9. Thaliany should now work at the address where the frontend is currently hosted.