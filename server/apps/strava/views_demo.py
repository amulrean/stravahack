import json
import os
from server.settings import BASE_DIR

from django.http import HttpResponseRedirect
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view()
def demo_get_athlete_profile(request):

    with open(os.path.join(BASE_DIR, 'server/apps/strava/demo/profile.json'), "r") as infile:
        profile = json.load(infile)
    return Response(profile)


@api_view()
def demo_activity_search(request):

    with open(os.path.join(BASE_DIR, 'server/apps/strava/demo/activity_search.json'), "r") as infile:
        resp = json.load(infile)
    return Response(reversed(resp))


@api_view()
def demo_activity_data(request):

    # Decode json string of ids sent by angular
    activity = json.loads(request.query_params.get('activity'))

    with open(os.path.join(BASE_DIR, 'server/apps/strava/demo/' + str(activity['id'])+'.json'), "r") as infile:
        resp = json.load(infile)

    return Response(resp)