(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceHome', {
            bindings: {
                $router: '<'
            },
            templateUrl: 'static/app/races/race-home.html',
            controller: RaceHomeController
        });

    RaceHomeController.$inject = ['stravaService', '$interval', '$stateParams', '$state'];

    function RaceHomeController(stravaService, $interval, $stateParams, $state) {
        var ctrl = this;

        ctrl.raceList = [];
        ctrl.raceTotal = 0;
        ctrl.selectedRace = null;
        ctrl.clickedRace = null;
        ctrl.searchTerm = '';
        ctrl.startDate = null;
        ctrl.endDate = null;
        ctrl.isLoadingList = false;
        ctrl.profile = {};

        ctrl.intervalPromise = undefined;

        ctrl.$onInit = function () {
            if($stateParams.activityType == null ||
                $stateParams.startDate == null ||
                $stateParams.endDate == null)
            {
                $state.go('welcome');
            }

            if (stravaService.getIsAuthenticated()) {
                searchActivities();

                stravaService.getProfile()
                    .then(function (data) {
                        ctrl.profile = data;
                        return ctrl.profile;
                    });
            }
        };

        function searchActivities() {
            ctrl.isLoadingList = true;
            console.log($stateParams);
            return stravaService.searchActivities(
                $stateParams.activityType,
                $stateParams.startDate,
                $stateParams.endDate
            )
                .then(function (data) {
                    ctrl.isLoadingList = false;
                    if (data && data.length > 0) {
                        ctrl.raceList = data;
                    } else {
                        $mdToast.show($mdToast.simple().textContent("No Activities found."));
                    }
                    return ctrl.raceList;
                });
        }

        ctrl.playAnimation = function () {
            ctrl.nextRace();
            ctrl.intervalPromise = $interval(function () {
                ctrl.nextRace();
            }, 10000);
        };

        ctrl.pauseAnimation = function () {
            if (angular.isDefined(ctrl.intervalPromise)) {
                $interval.cancel(ctrl.intervalPromise);
                ctrl.intervalPromise = undefined;
            }
        };

        ctrl.nextRace = function () {
            if (ctrl.selectedRace === null) {
                ctrl.selectedRace = 0;
            } else if (ctrl.selectedRace < ctrl.raceList.length - 1) {
                ctrl.selectedRace++;
            } else {
                if (angular.isDefined(ctrl.intervalPromise)) {
                    $interval.cancel(ctrl.intervalPromise);
                    ctrl.intervalPromise = undefined;
                }
            }
        };

        ctrl.previousRace = function () {
            if (ctrl.selectedRace > 0) {
                ctrl.selectedRace--;
            }
        };

        ctrl.search = function () {
            searchActivities();
        };

        ctrl.clearSearch = function () {
            ctrl.searchTerm = '';
            ctrl.startDate = null;
            ctrl.endDate = null;
            ctrl.selectedRace = null;
            return searchActivities();
        };

        ctrl.onSelect = function (race) {
            ctrl.selectedRace = race;
        };

        ctrl.onClickSelected = function (race) {
            ctrl.clickedRace = angular.copy(race);
        };

    }
})();
