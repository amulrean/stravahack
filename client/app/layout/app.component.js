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

            stravaService.getIsAuthenticated().then(function (data) {
                ctrl.isAuthenticated = data;
                return ctrl.isAuthenticated;
            });

            stravaService.getAuthUrl().then(function (data) {
                ctrl.authUrl = data;
                return ctrl.authUrl;
            });
        };

    }

})();
