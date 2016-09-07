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

    RaceHomeController.$inject = ['stravaService', '$interval', '$stateParams', '$state', '$scope', '$mdToast'];

    function RaceHomeController(stravaService, $interval, $stateParams, $state, $scope, $mdToast) {
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

        ctrl.totalActivities = 0;
        ctrl.totalDistance = 0;
        ctrl.totalKudos = 0;
        ctrl.totalComments = 0;


        ctrl.intervalPromise = undefined;

        ctrl.$onInit = function () {
            if ($stateParams.activityType == null ||
                $stateParams.startDate == null ||
                $stateParams.endDate == null) {
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
            return stravaService.searchActivities(
                $stateParams.activityType,
                $stateParams.startDate,
                $stateParams.endDate
            )
                .then(function (data) {
                    ctrl.isLoadingList = false;
                    if (data && data.length > 0) {
                        ctrl.raceList = data;
                        ctrl.playAnimation();
                    } else {
                        $mdToast.show($mdToast.simple().textContent("No Activities found for selected dates."));
                        $state.go('welcome');
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

        // Run this after changing selected race
        function addStats() {
            ctrl.totalActivities = ctrl.totalActivities + 1;
            ctrl.totalDistance = +ctrl.totalDistance + +ctrl.raceList[ctrl.selectedRace].distance;
            ctrl.totalDistance = ctrl.totalDistance.toFixed(1);
            ctrl.totalKudos = +ctrl.totalKudos + +ctrl.raceList[ctrl.selectedRace].kudos_count;
            ctrl.totalComments = +ctrl.totalComments + +ctrl.raceList[ctrl.selectedRace].comment_count;
        }

        function showComments() {
            for (var kudo_key in ctrl.raceList[ctrl.selectedRace].kudos) {
                var kudo = ctrl.raceList[ctrl.selectedRace].kudos[kudo_key];
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(kudo.firstname)
                        .position('bottom left')
                        .hideDelay(100)
                );
            }

        }

        // Run this before changing selected race.
        function subtractStats() {
            ctrl.totalDistance = +ctrl.totalDistance - +ctrl.raceList[ctrl.selectedRace].distance;
            ctrl.totalDistance = ctrl.totalDistance.toFixed(1);
            ctrl.totalKudos = +ctrl.totalKudos - +ctrl.raceList[ctrl.selectedRace].kudos_count;
            ctrl.totalComments = +ctrl.totalComments - +ctrl.raceList[ctrl.selectedRace].comment_count;
        }

        ctrl.nextRace = function () {
            if (ctrl.selectedRace === null) {
                ctrl.selectedRace = 0;
                addStats();
                showComments();
            } else if (ctrl.selectedRace < ctrl.raceList.length - 1) {
                ctrl.selectedRace++;
                addStats();
            } else {
                if (angular.isDefined(ctrl.intervalPromise)) {
                    $interval.cancel(ctrl.intervalPromise);
                    ctrl.intervalPromise = undefined;
                }
            }
        };

        ctrl.previousRace = function () {
            if (ctrl.selectedRace > 0) {
                subtractStats();
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
