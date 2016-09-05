(function () {
    'use strict';

    angular
        .module('app.config')
        .config(config);

    config.$inject = ['$locationProvider', '$mdThemingProvider', '$stateProvider', '$urlRouterProvider'];

    function config($locationProvider, $mdThemingProvider, $stateProvider, $urlRouterProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('blue');

        $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();

        // For any unmatched url, send to /home
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('welcome', {
                url: "/",
                template: "<strava-welcome layout='column' flex></strava-welcome>"
            })
            .state('visualize', {
                url: "/visualize?activityType&startDate&endDate",
                template: "<race-home layout='column' flex></race-home>"
            })
            .state('stravaAuthentication', {
                url: "/strava-authorization?state&code",
                controller: function ($window, $stateParams, $state, stravaService, logger) {
                    if ($stateParams.code != null) {
                        stravaService.getAccessToken($stateParams.code).then(function (access_token) {
                            stravaService.setAuthenticationToken(access_token);
                            $state.go('welcome');
                        });

                    } else {
                        logger.error("StravaAuthentication Failed");
                    }

                }
            });
    }
})();
