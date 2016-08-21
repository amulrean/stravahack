(function () {
    'use strict';

    angular
        .module('app.layout.components')
        .component('app', {
            templateUrl: 'static/app/layout/app.html',
            controller: AppController
        });

    AppController.$inject = [];

    function AppController() {
        var ctrl = this;

        ctrl.$onInit = function () {

        };

    }

})();
