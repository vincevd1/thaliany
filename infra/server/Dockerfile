FROM python:3.11-alpine AS base
 
ENV MEDIA_ROOT="/volumes/media" \
    STATIC_ROOT="/volumes/static" \
    SENDFILE_BACKEND="sendfile.backends.nginx" \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    TZ=Europe/Amsterdam \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Install build+runtime dependencies.
RUN apk update && apk add build-base postgresql-client runuser

COPY server/requirements.txt ./
RUN pip install -r requirements.txt

COPY server /app/server

VOLUME [ "/volumes/media", "/volumes/static" ]
EXPOSE 8000

COPY infra/server/entrypoint.sh /app/entrypoint.sh

WORKDIR /app/server

CMD [ "/app/entrypoint.sh" ]

RUN adduser --system --uid 5678 appuser

