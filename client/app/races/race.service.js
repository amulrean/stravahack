(function () {
    'use strict';

    angular
        .module('app.races.services')
        .factory('raceService', raceService);

    raceService.$inject = ['$http', '$q', 'logger'];

    function raceService($http, $q, logger) {
        var raceService = {
            search: search,
            searchBounded: searchBounded,
            getObject: getObject
        };
        return raceService;

        function search(start,
                        end,
                        searchTerm) {
            return $http.get('api/v1/races-search/?',
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
                var newMessage = 'Failed to get races';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }

        function searchBounded(start,
                        end,
                        searchTerm,
                        bounds) {
            return $http.get('api/v1/races-bounded-search/?',
                {
                    params: {
                        start: start,
                        end: end,
                        search_term: searchTerm,
                        top_left_lat: bounds.northEast.lat,
                        top_left_lon: bounds.southWest.lng,
                        bottom_right_lat: bounds.southWest.lat,
                        bottom_right_lon: bounds.northEast.lng
                    }
                })
                .then(listSuccess)
                .catch(listError);
            function listSuccess(data) {
                return data.data;
            }

            function listError(e) {
                var newMessage = 'Failed to get bounded races';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }

        function getObject(id) {
            return $http.get('api/v1/races-id/' + id + '/')
                .then(getObjectSuccess)
                .catch(getObjectError);
            function getObjectSuccess(data) {
                return data.data;
            }

            function getObjectError(e) {
                var newMessage = 'Failed to get race';
                if (e.data && e.data.message) {
                    newMessage = newMessage + '\n' + e.data.message;
                }
                logger.error(newMessage, e);
                return $q.reject(e);
            }
        }
    }
})();