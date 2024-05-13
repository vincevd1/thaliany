import json
<<<<<<< HEAD
from django.shortcuts import get_object_or_404
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import AnyTimer, AnyTimerRequest, AnytimerStatus , AnyTimerProof
from django.db.models import Q
=======
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
import os

import requests
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.urls import reverse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from sendfile import sendfile

from .models import AnyTimer, AnyTimerProof, AnyTimerRequest, AnytimerStatus


@api_view(["POST"])
def give_any(request, target_id):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    # Fetch owner user
    res = requests.get(
        f"https://staging.thalia.nu/api/v2/members/{target_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

<<<<<<< HEAD
=======
    if target_id == str(request.thalia_user["pk"]):
        return Response(
            data={"message": "You cannot send an anytimer to yourself"}, status=400
        )

>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    AnyTimer.objects.create(
        owner_id=target_id,
        recipient_id=request.thalia_user["pk"],
        owner_name=res.json()["profile"]["display_name"],
        recipient_name=request.thalia_user["profile"]["display_name"],
        amount=body["amount"],
        type=body["type"],
        description=body["description"],
    )

    return Response(status=200)


@api_view(["POST"])
def request_any(request, target_id):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    # Fetch owner user
    res = requests.get(
        f"https://staging.thalia.nu/api/v2/members/{target_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

<<<<<<< HEAD
    AnyTimerRequest.objects.create(
        requester_id=request.thalia_user['pk'],
=======
    if target_id == str(request.thalia_user["pk"]):
        return Response(
            data={"message": "You cannot request an anytimer from yourself"}, status=400
        )

    AnyTimerRequest.objects.create(
        requester_id=request.thalia_user["pk"],
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
        recipient_id=target_id,
        requester_name=request.thalia_user["profile"]["display_name"],
        recipient_name=res.json()["profile"]["display_name"],
        amount=body["amount"],
        type=body["type"],
        description=body["description"],
    )
    return Response(status=200)


@api_view(["POST"])
def use_anytimer(request, anytimer_id):
    thalia_user = request.thalia_user
    anytimer = AnyTimer.objects.get(owner_id=thalia_user["pk"], id=anytimer_id)
<<<<<<< HEAD
    
    if(anytimer.status == AnytimerStatus.UNUSED):
        if(anytimer.amount > 1):
=======

    if anytimer.status == AnytimerStatus.UNUSED:
        if anytimer.amount > 1:
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
            # This requires some clarification
            # We first subtract 1 from anytimer and save it
            anytimer.amount -= 1
            anytimer.save()

            # Now we change the amount to one and change the status
            anytimer.amount = 1
            anytimer.status = AnytimerStatus.USED

            # And we set the id to None as to not overwrite our original anytimer with a bigger amount and thus 'duplicate' it
            anytimer.id = None

            # Then we save it again as a new object
            anytimer.save()
        else:
            anytimer.status = AnytimerStatus.USED
            anytimer.save()
    else:
        return Response(status=403)

    return Response(status=200)


@api_view(["POST"])
def complete_anytimer(request, anytimer_id):
    image_extensions = [
        "ase",
        "art",
        "bmp",
        "blp",
        "cd5",
        "cit",
        "cpt",
        "cr2",
        "cut",
        "dds",
        "dib",
        "djvu",
        "egt",
        "exif",
        "gif",
        "gpl",
        "grf",
        "icns",
        "ico",
        "iff",
        "jng",
        "jpeg",
        "jpg",
        "jfif",
        "jp2",
        "jps",
        "lbm",
        "max",
        "miff",
        "mng",
        "msp",
        "nef",
        "nitf",
        "ota",
        "pbm",
        "pc1",
        "pc2",
        "pc3",
        "pcf",
        "pcx",
        "pdn",
        "pgm",
        "PI1",
        "PI2",
        "PI3",
        "pict",
        "pct",
        "pnm",
        "pns",
        "ppm",
        "psb",
        "psd",
        "pdd",
        "psp",
        "px",
        "pxm",
        "pxr",
        "qfx",
        "raw",
        "rle",
        "sct",
        "sgi",
        "rgb",
        "int",
        "bw",
        "tga",
        "tiff",
        "tif",
        "vtf",
        "xbm",
        "xcf",
        "xpm",
        "3dv",
        "amf",
        "ai",
        "awg",
        "cgm",
        "cdr",
        "cmx",
        "dxf",
        "e2d",
        "egt",
        "eps",
        "fs",
        "gbr",
        "odg",
        "svg",
        "stl",
        "vrml",
        "x3d",
        "sxd",
        "v2d",
        "vnd",
        "wmf",
        "emf",
        "art",
        "xar",
        "png",
        "webp",
        "jxr",
        "hdp",
        "wdp",
        "cur",
        "ecw",
        "iff",
        "lbm",
        "liff",
        "nrrd",
        "pam",
        "pcx",
        "pgf",
        "sgi",
        "rgb",
        "rgba",
        "bw",
        "int",
        "inta",
        "sid",
        "ras",
        "sun",
        "tga",
        "heic",
        "heif",
    ]
    video_extensions = [
        "webm",
        "mkv",
        "flv",
        "vob",
        "ogv",
        "ogg",
        "rrc",
        "gifv",
        "mng",
        "mov",
        "avi",
        "qt",
        "wmv",
        "yuv",
        "rm",
        "asf",
        "amv",
        "mp4",
        "m4p",
        "m4v",
        "mpg",
        "mp2",
        "mpeg",
        "mpe",
        "mpv",
        "m4v",
        "svi",
        "3gp",
        "3g2",
        "mxf",
        "roq",
        "nsv",
        "flv",
        "f4v",
        "f4p",
        "f4a",
        "f4b",
        "mod",
        "quicktime",
    ]
    max_file_size = 25000000

<<<<<<< HEAD
    anytimer = AnyTimer.objects.get(recipient_id=request.thalia_user['pk'], id=anytimer_id, status=AnytimerStatus.USED)
=======
    anytimer = AnyTimer.objects.get(
        recipient_id=request.thalia_user["pk"],
        id=anytimer_id,
        status=AnytimerStatus.USED,
    )
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0

    if (
        not anytimer
    ):  # Check if there is actually a anytimer and not just a random picture uploaded
        return Response(status=403)
<<<<<<< HEAD
    
    AnyTimerProofExists = AnyTimerProof.objects.filter(anytimer_id = anytimer_id).exists()
    if(AnyTimerProofExists):
=======

    AnyTimerProofExists = AnyTimerProof.objects.filter(anytimer_id=anytimer_id).exists()
    if AnyTimerProofExists:
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
        return Response(status=403)

    proof_type = request.POST.get("proof_type")

    if (
        not request.FILES and proof_type
    ):  # If there was no file uploaded but the person did the anytimer anyways and promises so
        AnyTimerProof.objects.create(anytimer_id=anytimer_id, proof_type=proof_type)

        anytimer.status = AnytimerStatus.COMPLETED
        anytimer.save()

        return Response(status=200)

    file_data = request.FILES["file"]
    extension = os.path.splitext(str(request.FILES["file"]))[1].replace(".", "")

    if file_data.size > max_file_size:
        return Response(data={"message": "File exceeds maximum file size!"}, status=400)

    if extension in video_extensions or extension in image_extensions:
        AnyTimerProof.objects.create(
            anytimer_id=anytimer_id, file=file_data, proof_type=proof_type
        )

        # Set state to completed
        anytimer.status = AnytimerStatus.COMPLETED
        anytimer.save()

        return Response(status=200)
    else:
        return Response(status=415)

<<<<<<< HEAD
@api_view(['POST'])
def accept_anytimer(request ,request_id):
    anytimerrequest = AnyTimerRequest.objects.get(recipient_id=request.thalia_user['pk'], id=request_id)
=======

@api_view(["POST"])
def accept_anytimer(request, request_id):
    anytimerrequest = AnyTimerRequest.objects.get(
        recipient_id=request.thalia_user["pk"], id=request_id
    )
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    AnyTimer.objects.create(
        owner_id=anytimerrequest.requester_id,
        recipient_id=anytimerrequest.recipient_id,
        owner_name=anytimerrequest.requester_name,
        recipient_name=anytimerrequest.recipient_name,
        amount=anytimerrequest.amount,
        type=anytimerrequest.type,
        description=anytimerrequest.description,
    )
    anytimerrequest.delete()
    return Response(status=200)

<<<<<<< HEAD
@api_view(['POST'])
def deny_anytimer(request,request_id):
    anytimerrequest = AnyTimerRequest.objects.get(recipient_id=request.thalia_user['pk'], id=request_id)
=======

@api_view(["POST"])
def deny_anytimer(request, request_id):
    anytimerrequest = AnyTimerRequest.objects.get(
        recipient_id=request.thalia_user["pk"], id=request_id
    )
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    anytimerrequest.delete()
    return Response(status=200)


@api_view(["POST"])
def revoke_request(request, request_id):
<<<<<<< HEAD
    anytimerrequest = AnyTimerRequest.objects.get(requester_id=request.thalia_user['pk'], id=request_id)
=======
    anytimerrequest = AnyTimerRequest.objects.get(
        requester_id=request.thalia_user["pk"], id=request_id
    )
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    anytimerrequest.delete()
    return Response(status=200)


@api_view(["GET"])
def fetch_requests(request, direction):
<<<<<<< HEAD
    if direction == 'incoming':
        anytimerrequests = AnyTimerRequest.objects.filter(recipient_id=request.thalia_user['pk'])
    elif direction == 'outgoing':
        anytimerrequests = AnyTimerRequest.objects.filter(requester_id=request.thalia_user['pk'])
=======
    if direction == "incoming":
        anytimerrequests = AnyTimerRequest.objects.filter(
            recipient_id=request.thalia_user["pk"]
        )
    elif direction == "outgoing":
        anytimerrequests = AnyTimerRequest.objects.filter(
            requester_id=request.thalia_user["pk"]
        )
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    else:
        return Response(status=400, data={"message": "Invalid direction"})

    anytimerrequests_data = []
    for anytimerrequest in anytimerrequests:
        anytimerrequest_data = {
            "id": anytimerrequest.id,
            "owner_id": anytimerrequest.requester_id,
            "recipient_id": anytimerrequest.recipient_id,
            "owner_name": anytimerrequest.requester_name,
            "recipient_name": anytimerrequest.recipient_name,
            "amount": anytimerrequest.amount,
            "type": anytimerrequest.type,
            "description": anytimerrequest.description,
        }
        anytimerrequests_data.append(anytimerrequest_data)

    return Response(status=200, data=anytimerrequests_data)


@api_view(["GET"])
def fetch_anytimers(request, direction):
<<<<<<< HEAD
    if direction == 'incoming':
        anytimers = AnyTimer.objects.filter(recipient_id=request.thalia_user['pk'])
    elif direction == 'outgoing':
        anytimers = AnyTimer.objects.filter(owner_id=request.thalia_user['pk'])
=======
    if direction == "incoming":
        anytimers = AnyTimer.objects.filter(recipient_id=request.thalia_user["pk"])
    elif direction == "outgoing":
        anytimers = AnyTimer.objects.filter(owner_id=request.thalia_user["pk"])
>>>>>>> c46c6d711401959b8661d8053accee89fd1b12f0
    else:
        return Response(status=400, data={"message": "Invalid direction"})

    anytimers_data = []
    for anytimer in anytimers:
        anytimer_data = {
            "id": anytimer.id,
            "owner_id": anytimer.owner_id,
            "recipient_id": anytimer.recipient_id,
            "owner_name": anytimer.owner_name,
            "recipient_name": anytimer.recipient_name,
            "amount": anytimer.amount,
            "type": anytimer.type,
            "description": anytimer.description,
            "status": anytimer.status,
        }
        anytimers_data.append(anytimer_data)

    return Response(status=200, data=anytimers_data)


@api_view(["GET"])
def fetch_proof(request, anytimer_id):
    proof = get_object_or_404(
        AnyTimerProof.objects.filter(
            Q(anytimer__owner_id=request.thalia_user["pk"])
            | Q(anytimer__recipient_id=request.thalia_user["pk"])
        ),
        anytimer=anytimer_id,
    )

    data = {
        "anytimer_id": proof.anytimer_id,
        "proof_file": request.build_absolute_uri(
            reverse("proof_sendfile", args=[anytimer_id])
        ),
        "description": proof.description,
        "proof_type": proof.proof_type,
        "created_at": proof.created_at,
    }

    return Response(status=200, data=data)


def proof_sendfile(request, anytimer_id):
    """Sendfile view that checks authentication and then sends the file through nginx."""
    proof = get_object_or_404(
        AnyTimerProof.objects.filter(
            Q(anytimer__owner_id=request.thalia_user["pk"])
            | Q(anytimer__recipient_id=request.thalia_user["pk"])
        ),
        anytimer=anytimer_id,
    )

    return sendfile(request, proof.file.path)
