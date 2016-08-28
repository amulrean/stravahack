## Strava Hack

### Dev Install

```console
$ mkvirtualenv stravahack
$ pip install -r requirements.txt
$ npm install
$ python manage.py makemigrations
$ python manage.py migrate
$ python manage.py runserver

http://localhost:8000/

```

### Setup Strava Connections

- Copy File *server/settings_secret.py.template* to *server/settings_secret.py*
- Fill in Strava Client Id and Client Secret


### Install on Digital Ocean

- Install git
https://www.digitalocean.com/community/tutorials/how-to-install-git-on-ubuntu-14-04

- Install Node and Npm
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server

- Clone Git project to /home/django

- Run pip install -r requirements.txt

- Run npm install

- Edit NGINX and Gunicorn files
https://www.digitalocean.com/community/tutorials/how-to-use-the-django-one-click-install-image?utm_source=Customerio&utm_medium=Email_Internal&utm_campaign=Email_DjangoWelcome

- Copy server/settings_secret from the tempate and add secret values

- run python manage.py migrate

- service gunicorn restart

### Perform updates on server
 - git pull
 - sudo service nginx restart
 - service gunicorn restart