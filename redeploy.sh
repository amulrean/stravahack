#!/usr/bin/env bash

cd /home/django/stravahack/
git pull
python manage.py collectstatic
service nginx restart
service gunicorn restart