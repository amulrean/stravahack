(function () {
    'use strict';

    angular
        .module('app.races.services')
        .factory('stravaService', stravaService);

    stravaService.$inject = ['$http', '$q', 'logger', '$cookies'];

    function stravaService($http, $q, logger, $cookies) {

        var stravaService = {
            STRAVA_TOKEN_KEY: 'stravaAccessToken',
            getIsAuthenticated: getIsAuthenticated,
            getAccessToken: getAccessToken,
            setAuthenticationToken: setAuthenticationToken,
            getAuthUrl: getAuthUrl,
            deauthorize: deauthorize,
            removeStravaCookie: removeStravaCookie,
            getProfile: getProfile,
            searchActivities: searchActivities,
            activityData: activityData,
            getProfileDemo: getProfileDemo,
            searchActivitiesDemo: searchActivitiesDemo,
            activityDataDemo: activityDataDemo
        };
        return stravaService;

        function getIsAuthenticated() {
            return $cookies.get(stravaService.STRAVA_TOKEN_KEY) != null;
        }

        function setAuthenticationToken(token) {
            $cookies.put(stravaService.STRAVA_TOKEN_KEY, token);
        }

        function stravaErrorHandler (e, message) {
            if (e.status === 401) {
                return handleUnauthorized();
            }

            logger.error(message, e);

            return $q.reject(e);
        }

        function handleUnauthorized () {
            $cookies.remove(stravaService.STRAVA_TOKEN_KEY);

            return $q.reject(e);
        }

        function getAuthUrl() {
            return $http.get('api/v1/auth-url/?')
                .then(getSuccess)
                .catch(getError);

            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {

                var message = 'Failed to get Strava Authentication Url';

                return stravaErrorHandler(e, message);

            }
        }

        function getAccessToken(code) {
            return $http.get('api/v1/access-token/?',
                {
                    params: {
                        code: code
                    }
                })
                .then(getSuccess)
                .catch(getError);

            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var message = 'Failed to get Strava Access Token';
                return stravaErrorHandler(e, message);
            }
        }

        function removeStravaCookie() {
            $cookies.remove(stravaService.STRAVA_TOKEN_KEY);
        }

        function deauthorize(code) {

            return $http.get('api/v1/deauthorize/?',
                {
                    params: {
                        access_token: $cookies.get(stravaService.STRAVA_TOKEN_KEY),
                    }
                })
                .then(getSuccess)
                .catch(getError);

            function getSuccess() {
                return removeStravaCookie();;
            }

            function getError(e) {
                var message = 'Failed to deauthorize from Strava.';
                removeStravaCookie();
                return stravaErrorHandler(e, message);
            }
        }

        function getProfile() {
            return $http.get('api/v1/profile/?',
                {
                    params: {
                        access_token: $cookies.get(stravaService.STRAVA_TOKEN_KEY),
                    }
                })
                .then(getSuccess)
                .catch(getError);
            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var message = 'Failed to get Strava Profile';
                return stravaErrorHandler(e, message);
            }
        }

        function searchActivities(activityType,
                                  start,
                                  end) {
            return $http.get('api/v1/activity-search/?',
                {
                    params: {
                        access_token: $cookies.get(stravaService.STRAVA_TOKEN_KEY),
                        activity_type: activityType,
                        start_date: start,
                        end_date: end
                    }
                })
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var message = 'Failed to get strava activities';
                return stravaErrorHandler(e, message);
            }
        }

        function activityData(activity) {
            return $http.get('api/v1/activity-data/?',
                {
                    params: {
                        access_token: $cookies.get(stravaService.STRAVA_TOKEN_KEY),
                        activity: JSON.stringify(activity)
                    }
                })
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var message = 'Failed to get strava activity';
                return stravaErrorHandler(e, message);
            }
        }

        function getProfileDemo() {
            return $http.get('api/v1/demo/profile')
                .then(getSuccess)
                .catch(getError);
            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var message = 'Failed to get Demo Strava Profile';
                return stravaErrorHandler(e, message);
            }
        }

        function searchActivitiesDemo() {
            return $http.get('api/v1/demo/activity-search')
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var message = 'Failed to get demo strava activities';
                return stravaErrorHandler(e, message);
            }
        }

        function activityDataDemo(activity) {
            return $http.get('api/v1/demo/activity-data',
                {
                    params: {
                        activity: JSON.stringify(activity)
                    }
                })
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var message = 'Failed to get demo strava activity';
                return stravaErrorHandler(e, message);
            }
        }
    }
})();