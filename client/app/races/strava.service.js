(function () {
    'use strict';

    angular
        .module('app.races.services')
        .factory('stravaService', stravaService);

    stravaService.$inject = ['$http', '$q', 'logger'];

    function stravaService($http, $q, logger) {
        var stravaService = {
            getIsAuthenticated: getIsAuthenticated,
            getAuthUrl: getAuthUrl,
            getProfile: getProfile,
            searchActivities: searchActivities
        };
        return stravaService;

        function getIsAuthenticated() {
            return $http.get('api/v1/is-authenticated/?')
                .then(getSuccess)
                .catch(getError);
            function getSuccess(data) {
                return data.data;
            }

            function getError(e) {
                var newMessage = 'Failed to get Strava Authentication Status';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
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

        function getProfile() {
            return $http.get('api/v1/profile/?')
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