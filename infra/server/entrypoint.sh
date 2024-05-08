#! /bin/sh

chown -R appuser /volumes/static
chown -R appuser /volumes/media

MANAGE_PY=1 runuser -u appuser -- ./manage.py collectstatic --no-input
MANAGE_PY=1 runuser -u appuser -- ./manage.py migrate --no-input

exec runuser -u appuser -- gunicorn \
  --workers=3 \
  --timeout=60 \
  --bind=0.0.0.0:8000 \
  --log-level=INFO \
  --capture-output \
  server.wsgi:application
