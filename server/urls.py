"""server URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.9/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin

from rest_framework import routers

from server.views import IndexView
from server.apps.strava.views import get_authorization_url, get_access_token, deauthorize, \
     get_athlete_profile, activity_search, activity_data

from server.apps.strava.views_demo import demo_get_athlete_profile, demo_activity_data, demo_activity_search

router = routers.DefaultRouter()


urlpatterns = [
    # Standard router viewset endpoints
    url(r'^api/v1/', include(router.urls)),

    url(r'^api/v1/auth-url', get_authorization_url),
    url(r'^api/v1/access-token', get_access_token),
    url(r'^api/v1/deauthorize', deauthorize),
    url(r'^api/v1/profile', get_athlete_profile),
    url(r'^api/v1/activity-search', activity_search),
    url(r'^api/v1/activity-data', activity_data),

    url(r'^api/v1/demo/profile', demo_get_athlete_profile),
    url(r'^api/v1/demo/activity-search', demo_activity_search),
    url(r'^api/v1/demo/activity-data', demo_activity_data),

    # Django Admin Endpoints
    url(r'^admin/', admin.site.urls),
    url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),

    # home/index
    url(r'^.*$', IndexView.as_view(), name='index'),
]
