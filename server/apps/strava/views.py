from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

from stravalib import Client, unithelper
from server.settings_secret import MY_STRAVA_CLIENT_ID, MY_STRAVA_CLIENT_SECRET

client_access_token = None


def set_access_token(new_access_token):
    global client_access_token
    client_access_token = new_access_token

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

    return Response(client_access_token is not None)


@api_view()
def get_athlete_profile(request):
    client = Client(client_access_token)
    profile = client.protocol.get('/athlete')
    return Response(profile)


@api_view()
def activity_search(request):
    client = Client(client_access_token)

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