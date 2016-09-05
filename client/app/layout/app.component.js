(function () {
    'use strict';

    angular
        .module('app.layout.components')
        .component('app', {
            templateUrl: 'static/app/layout/app.html',
            controller: AppController
        });

    AppController.$inject = ['$scope', '$cookies', 'stravaService', '$state'];

    function AppController($scope, $cookies, stravaService, $state) {
        var ctrl = this;
        ctrl.isAuthenticated = false;
        ctrl.authUrl = '';

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
            }
        }

        $scope.$watch(function() { return $cookies.get(stravaService.STRAVA_TOKEN_KEY); }, function(newValue, oldValue) {
            if (newValue !== oldValue) {
                setAuthenticationStatus();
            }
        });

        ctrl.deauthorize = function () {
            ctrl.isAuthenticated = false;
            stravaService.deauthorize();
            $state.go('welcome');
        }

    }

})();
