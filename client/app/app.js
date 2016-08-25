(function () {
    'use strict';

    angular
        .module('app', [
            'ngMaterial',
            'app.layout',
            'app.util',
            'ngAnimate',
            'ngSanitize',
            'ngCookies',
            'nemLogging',
            'ui-leaflet',
            'app.races',
            'ui.router',
            'app.config',
        ]);

    angular
        .module('app.config', []);

    angular
        .module('pinion.filters', []);

    angular.module('app').run(run);

    run.$inject = ['$http'];

    /**
     * @name run
     * @desc Update xsrf $http headers to align with Django's defaults
     */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
