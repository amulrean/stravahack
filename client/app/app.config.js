(function () {
    'use strict';

    angular
        .module('app.config')
        .config(config);

    config.$inject = ['$locationProvider', '$mdThemingProvider'];

    function config($locationProvider, $mdThemingProvider) {
        $locationProvider.html5Mode(true);
        $locationProvider.hashPrefix('!');

        $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('blue');
    }
})();
