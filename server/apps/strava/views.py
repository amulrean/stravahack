from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

from stravalib import Client
from server.settings_secret import MY_STRAVA_CLIENT_ID, MY_STRAVA_CLIENT_SECRET

access_token = None


def set_access_token(new_access_token):
    global access_token
    access_token = new_access_token

@api_view()
def get_authorization_url(request):
    client = Client()
    url = client.authorization_url(client_id=MY_STRAVA_CLIENT_ID,
                                   redirect_uri='http://127.0.0.1:8000/api/v1/strava-authorization')
    return Response(url)

@api_view()
def strava_authorization(request):

    code = request.query_params.get('code')  # e.g.
    client = Client()
    new_access_token = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                                  client_secret=MY_STRAVA_CLIENT_SECRET,
                                                  code=code)
    set_access_token(new_access_token)

    return HttpResponseRedirect('/')


@api_view()
def is_authenticated(request):

    return Response(access_token is not None)