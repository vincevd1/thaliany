import json
import os

import requests
from django.conf import settings
from django.db.models import Q
from django.shortcuts import get_object_or_404
from django.urls import reverse
from django_sendfile import sendfile
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import AnyTimer, AnyTimerProof, AnyTimerRequest, AnytimerStatus


@api_view(["POST"])
def give_any(request, target_id):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    # Fetch owner user
    owner = requests.get(
        f"{settings.THALIA_BASE_URL}/api/v2/members/{target_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

    # Fetch recipient user
    recipient = requests.get(
        f"{settings.THALIA_BASE_URL}/api/v2/members/{request.user_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

    if target_id == str(request.user_id):
        return Response(
            data={"message": "You cannot send an anytimer to yourself"}, status=400
        )

    AnyTimer.objects.create(
        owner_id=target_id,
        recipient_id=request.user_id,
        owner_name=owner.json()["profile"]["display_name"],
        recipient_name=recipient.json()["profile"]["display_name"],
        amount=body["amount"],
        type=body["type"],
        description=body["description"],
    )

    return Response(status=200)


@api_view(["POST"])
def request_any(request, target_id):
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    # Fetch recipient user
    recipient = requests.get(
        f"{settings.THALIA_BASE_URL}/api/v2/members/{target_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

    # Fetch requester user
    requester = requests.get(
        f"{settings.THALIA_BASE_URL}/api/v2/members/{request.user_id}",
        headers={"Authorization": request.headers["Authorization"]},
    )

    if target_id == str(request.user_id):
        return Response(
            data={"message": "You cannot request an anytimer from yourself"}, status=400
        )

    AnyTimerRequest.objects.create(
        requester_id=request.user_id,
        recipient_id=target_id,
        requester_name=requester.json()["profile"]["display_name"],
        recipient_name=recipient.json()["profile"]["display_name"],
        amount=body["amount"],
        type=body["type"],
        description=body["description"],
    )
    return Response(status=200)


@api_view(["POST"])
def use_anytimer(request, anytimer_id):
    anytimer = AnyTimer.objects.get(owner_id=request.user_id, id=anytimer_id)

    if anytimer.status == AnytimerStatus.UNUSED:
        if anytimer.amount > 1:
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
    image_extensions = ["jpeg", "jpg", "png", "gif", "webp"]
    video_extensions = ["avi", "mp4", "mov", "quicktime"]
    max_file_size = 25000000

    anytimer = AnyTimer.objects.get(
        recipient_id=request.user_id,
        id=anytimer_id,
        status=AnytimerStatus.USED,
    )

    if (
        not anytimer
    ):  # Check if there is actually a anytimer and not just a random picture uploaded
        return Response(status=403)

    AnyTimerProofExists = AnyTimerProof.objects.filter(anytimer_id=anytimer_id).exists()
    if AnyTimerProofExists:
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


@api_view(["POST"])
def accept_anytimer(request, request_id):
    anytimerrequest = AnyTimerRequest.objects.get(
        recipient_id=request.user_id, id=request_id
    )
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


@api_view(["POST"])
def deny_anytimer(request, request_id):
    anytimerrequest = AnyTimerRequest.objects.get(
        recipient_id=request.user_id, id=request_id
    )
    anytimerrequest.delete()
    return Response(status=200)


@api_view(["POST"])
def revoke_request(request, request_id):
    anytimerrequest = AnyTimerRequest.objects.get(
        requester_id=request.user_id, id=request_id
    )
    anytimerrequest.delete()
    return Response(status=200)


@api_view(["GET"])
def fetch_requests(request, direction):
    if direction == "incoming":
        anytimerrequests = AnyTimerRequest.objects.filter(recipient_id=request.user_id)
    elif direction == "outgoing":
        anytimerrequests = AnyTimerRequest.objects.filter(requester_id=request.user_id)
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
    if direction == "incoming":
        anytimers = AnyTimer.objects.filter(recipient_id=request.user_id)
    elif direction == "outgoing":
        anytimers = AnyTimer.objects.filter(owner_id=request.user_id)
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
            Q(anytimer__owner_id=request.user_id)
            | Q(anytimer__recipient_id=request.user_id)
        ),
        anytimer=anytimer_id,
    )

    data = {
        "anytimer_id": proof.anytimer_id,
        "proof_file": request.build_absolute_uri(
            settings.BASE_URL + reverse("proof_sendfile", args=[anytimer_id])
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
            Q(anytimer__owner_id=request.user_id)
            | Q(anytimer__recipient_id=request.user_id)
        ),
        anytimer=anytimer_id,
    )

    print(proof.file.path)
    return sendfile(request, proof.file.path)
