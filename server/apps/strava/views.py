from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

from stravalib import Client, unithelper, exc
from server.settings_secret import MY_STRAVA_CLIENT_ID, MY_STRAVA_CLIENT_SECRET, AUTH_REDIRECT_URI

@api_view()
def get_authorization_url(request):
    client = Client()
    url = client.authorization_url(client_id=MY_STRAVA_CLIENT_ID,
                                   redirect_uri='http://127.0.0.1:8000/strava-authorization')
    return Response(url)

@api_view()
def deauthorize(request):

    access_token = request.query_params.get('access_token')
    client = Client(access_token)
    client.deauthorize()

    return HttpResponseRedirect('/')


@api_view()
def get_access_token(request):

    code = request.query_params.get('code')
    client = Client()
    new_access_token = client.exchange_code_for_token(client_id=MY_STRAVA_CLIENT_ID,
                                                  client_secret=MY_STRAVA_CLIENT_SECRET,
                                                  code=code)
    return Response(new_access_token)

@api_view()
def de_authorize(request):
    client = Client()
    client.deauthorize()
    url = client.authorization_url(client_id=MY_STRAVA_CLIENT_ID,
                                   redirect_uri=AUTH_REDIRECT_URI)
    return Response(url)


@api_view()
def get_athlete_profile(request):

    access_token = request.query_params.get('access_token')
    client = Client(access_token)
    profile = client.protocol.get('/athlete')
    return Response(profile)


@api_view()
def activity_search(request):


    access_token = request.query_params.get('access_token')
    client = Client(access_token)

    activities = client.get_activities(after="2016-07-01T00:00:00Z", limit=10)
    resp = []
    for activity in activities:

        stream_types = ['time', 'latlng', 'altitude', 'heartrate', 'temp', ]
        streams = client.get_activity_streams(activity.id, types=stream_types, resolution='low')

        stream_data = {}

        # Get all available stream types listed above
        for stream_type in stream_types:
            if stream_type in streams.keys():
                stream_data[stream_type] = streams[stream_type].data

        # Distance seems to be a seprate stream
        if 'distance' in streams.keys():
            stream_data['distance'] = streams['distance'].data


        resp.append({
            'id': activity.id,
            'name': activity.name,
            'moving_time': activity.moving_time,
            'start_latlng': activity.start_latlng,
            'stream_data': stream_data,
        })


    return Response(resp)