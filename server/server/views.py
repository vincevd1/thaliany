from django.shortcuts import redirect

def redirected(request):
    return redirect('http://localhost:5173')