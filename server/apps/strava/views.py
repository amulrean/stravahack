from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response

from datetime import datetime, timedelta

from stravalib import Client, unithelper, exc
from server.settings_secret import MY_STRAVA_CLIENT_ID, MY_STRAVA_CLIENT_SECRET, AUTH_REDIRECT_URI

@api_view()
def get_authorization_url(request):
    client = Client()
    url = client.authorization_url(client_id=MY_STRAVA_CLIENT_ID,
                                   redirect_uri=AUTH_REDIRECT_URI)
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

    after_date = datetime.today() - timedelta(days=30)

    activities = client.get_activities(after=after_date)
    resp = []
    for activity in activities:

        activity_fields = ['id', 'name', 'moving_time']

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
            'description': activity.description,
            'type': activity.type,
            'moving_time': activity.moving_time,
            # 'distance': activity.distance,
            # 'total_elevation_gain': activity.total_elevation_gain,
            'comment_count': activity.comment_count,
            'kudos_count': activity.kudos_count,
            'splits_metric': activity.splits_metric,
            'start_latlng': activity.start_latlng,
            'stream_data': stream_data,
        })


    return Response(resp)