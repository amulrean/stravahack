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
    }
})();