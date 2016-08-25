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

        // For any unmatched url, send to /home
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('home', {
                url: "/",
                template: "<race-home></race-home>"
            })
            .state('stravaAuthentication', {
                url: "/strava-authorization?state&code",
                controller: function ($stateParams, $state, stravaService, logger) {
                    if ($stateParams.code != null) {
                        stravaService.getAccessToken($stateParams.code).then(function (access_token) {
                            stravaService.setAuthenticationToken(access_token);
                        });

                    } else {
                        logger.error("StravaAuthentication Failed");
                    }
                    $state.go('home');
                }
            });
    }
})();
