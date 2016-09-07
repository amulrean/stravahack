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

    # u'Mon Sep 05 2016 00:00:00 GMT-0400 (EDT)'

    format_str = '%a %b %d %Y'
    start_str = request.query_params.get('start_date')[0:15]
    end_str = request.query_params.get('end_date')[0:15]

    activity_type = request.query_params.get('activity_type')
    start_date = datetime.strptime(start_str, format_str)
    end_date = datetime.strptime(end_str, format_str)

    activities = client.get_activities(after=start_date, before=end_date)
    resp = []
    for activity in activities:
        if activity.type != activity_type:
            continue
        # stream_types = ['time', 'latlng', 'altitude', 'heartrate', 'temp', ]
        stream_types = ['latlng']
        try:
            streams = client.get_activity_streams(activity.id, types=stream_types, resolution='low')
        except:
            # found activity with no lat lngs
            continue

        stream_data = {}

        # Get all available stream types listed above
        for stream_type in stream_types:
            if stream_type in streams.keys():
                stream_data[stream_type] = streams[stream_type].data

        # Distance seems to be a seprate stream
        if 'distance' in streams.keys():
            stream_data['distance'] = streams['distance'].data

        moving_time_minutes = str(activity.moving_time)

        distance_miles = round(unithelper.miles(activity.distance).get_num(), 1)

        kudos = []

        # if activity.kudos is not None:
        #     for kudo in activity.kudos:
        #         kudos.append({'firstname': kudo.firstname, 'lastname': kudo.lastname})


        resp.append({
            'id': activity.id,
            'name': activity.name,
            'description': activity.description,
            'type': activity.type,
            'moving_time': moving_time_minutes,
            'start_date_local': activity.start_date_local,
            'distance': distance_miles,
            # 'coomments': activity.comments,
            'comment_count': activity.comment_count,
            'kudos': kudos,
            'kudos_count': activity.kudos_count,
            'calories': activity.calories,
            'location_city': activity.location_city,
            'location_state': activity.location_state,
            'location_country': activity.location_country,
            'stream_data': stream_data,
        })

    return Response(reversed(resp))