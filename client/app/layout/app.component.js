(function () {
    'use strict';

    angular
        .module('app.layout.components')
        .component('app', {
            templateUrl: 'static/app/layout/app.html',
            controller: AppController
        });

    AppController.$inject = ['stravaService'];

    function AppController(stravaService) {
        var ctrl = this;
        ctrl.isAuthenticated = false;
        ctrl.authUrl = '';

        ctrl.$onInit = function () {


            ctrl.isAuthenticated = stravaService.getIsAuthenticated();

            if (!ctrl.isAuthenticated || ctrl.isAuthenticated) {
                stravaService.getAuthUrl().then(function (data) {
                    ctrl.authUrl = data;
                    return ctrl.authUrl;
                });
            }


        };

        ctrl.deauthorize = function () {
            ctrl.isAuthenticated = false;
            stravaService.deauthorize();
        }

    }

})();
