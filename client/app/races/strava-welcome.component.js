(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('stravaWelcome', {
            bindings: {
                $router: '<'
            },
            templateUrl: 'static/app/races/strava-welcome.html',
            controller: StravaWelcomeController
        });

    StravaWelcomeController.$inject = ['stravaService', '$scope', '$cookies'];

    function StravaWelcomeController(stravaService, $scope, $cookies) {

        var ctrl = this;
        ctrl.isAuthenticated = false;
        ctrl.authUrl = '';
        ctrl.profile = null;
        ctrl.activityType = null;
        ctrl.startDate = null;
        ctrl.endDate = null;

        ctrl.$onInit = function () {
            setAuthenticationStatus();
        };

        function setAuthenticationStatus() {
            ctrl.isAuthenticated = stravaService.getIsAuthenticated();

            if (!ctrl.isAuthenticated) {
                stravaService.getAuthUrl().then(function (data) {
                    ctrl.authUrl = data;
                    return ctrl.authUrl;
                });
            } else {
                stravaService.getProfile()
                    .then(function (data) {
                        ctrl.profile = data;
                        return ctrl.profile;
                    }).catch(
                    function (data) {
                        ctrl.isAuthenticated = false;
                        stravaService.removeStravaCookie();
                    });
            }
        }

        $scope.$watch(function() { return $cookies.get(stravaService.STRAVA_TOKEN_KEY); }, function(newValue, oldValue) {
            if (newValue !== oldValue) {
                setAuthenticationStatus();
            }
        });
    }
})();
