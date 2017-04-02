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


### Deploying to Elastic Beanstalk

Read these two articles for setting up the EB CLI and then deploying a django application.

http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3.html
http://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html
