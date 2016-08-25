(function () {
    'use strict';

    angular
        .module('app.races.services')
        .factory('stravaService', stravaService);

    stravaService.$inject = ['$http', '$q', 'logger', '$cookies'];

    function stravaService($http, $q, logger, $cookies) {

        var STRAVA_TOKEN_KEY = 'stravaAccessToken';

        var stravaService = {
            getIsAuthenticated: getIsAuthenticated,
            getAccessToken: getAccessToken,
            setAuthenticationToken: setAuthenticationToken,
            getAuthUrl: getAuthUrl,
            deauthorize: deauthorize,
            getProfile: getProfile,
            searchActivities: searchActivities
        };
        return stravaService;

        function getIsAuthenticated() {
            return $cookies.get(STRAVA_TOKEN_KEY) != null;
        }

        function setAuthenticationToken(token) {
            $cookies.put(STRAVA_TOKEN_KEY, token);
        }

        function getAuthUrl() {
            return $http.get('api/v1/auth-url/?')
                .then(getSuccess)
                .catch(getError);

            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var newMessage = 'Failed to get Strava Authentication Url';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
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
                var newMessage = 'Failed to get Strava Access Token';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }

        function deauthorize(code) {

            return $http.get('api/v1/deauthorize/?',
                {
                    params: {
                        access_token: $cookies.get(STRAVA_TOKEN_KEY),
                    }
                })
                .then(getSuccess)
                .catch(getError);

            function getSuccess() {
                return $cookies.remove(STRAVA_TOKEN_KEY);;
            }

            function getError(e) {
                var newMessage = 'Failed to deauthorize from Strava.';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }

        function getProfile() {
            return $http.get('api/v1/profile/?',
                {
                    params: {
                        access_token: $cookies.get(STRAVA_TOKEN_KEY),
                    }
                })
                .then(getSuccess)
                .catch(getError);
            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var newMessage = 'Failed to get Strava Profile';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }

        function searchActivities(start,
                                  end,
                                  searchTerm) {
            return $http.get('api/v1/activity-search/?',
                {
                    params: {
                        start: start,
                        end: end,
                        search_term: searchTerm
                    }
                })
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var newMessage = 'Failed to get strava activities';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }
    }
})();