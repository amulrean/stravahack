(function () {
    'use strict';

    angular
        .module('app', [
            'ngMaterial',
            'app.config',
            'app.layout',
            'app.util',
            'ngAnimate',
            'ngSanitize',
            'nemLogging',
            'ui-leaflet',
            'app.races'
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
