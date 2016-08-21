(function () {
    'use strict';

    angular
        .module('app.util.services')
        .factory('logger', logger);

    logger.$inject = ['$mdToast'];

    function logger($mdToast) {
        var logger = {
            log: log,
            error: error,
            warn: warn,
            info: info,
            debug: debug
        };
        return logger;

        function log(message, object) {
            console.log(message, object);
        }

        function error(message, object) {
            console.log(message, object);
            $mdToast.show($mdToast.simple().textContent(message));
        }

        function warn(message, object) {
            console.log(message, object);
        }

        function info(message, object) {
            // Do nothing for now
        }

        function debug(message, object) {
            // Do nothing for now
        }
    }
})();
