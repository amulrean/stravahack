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

    RaceHomeController.$inject = ['stravaService', 'mapService', '$interval', '$stateParams', '$state', '$mdToast'];

    function RaceHomeController(stravaService, mapService, $interval, $stateParams, $state, $mdToast) {
        var ctrl = this;

        var numberOfRaceDataToGet = 10;

        ctrl.mapObject = {};

        ctrl.raceList = [];
        ctrl.raceListKeysNeedData = [];
        ctrl.raceTotal = 0;
        ctrl.selectedRace = 0;
        ctrl.isLoadingList = false;
        ctrl.isLoadingRaceDetails = false;
        ctrl.finishedAnimation = false;

        ctrl.totalActivities = 0;
        ctrl.totalDistance = 0;
        ctrl.totalKudos = 0;
        ctrl.totalComments = 0;


        ctrl.intervalPromise = undefined;

        ctrl.$onInit = function () {

            if ($stateParams.demo) {
                searchDemoActivities()
            } else {
                if ($stateParams.activityType == null ||
                    $stateParams.startDate == null ||
                    $stateParams.endDate == null || !stravaService.getIsAuthenticated()
                ) {
                    $state.go('welcome');
                }

                searchActivities();
            }
        };

        function searchActivities() {
            ctrl.isLoadingList = true;
            ctrl.isLoadingRaceDetails = true;
            return stravaService.searchActivities(
                $stateParams.activityType,
                $stateParams.startDate,
                $stateParams.endDate
            )
                .then(getSearchActivitiesSuccess)
                .catch(getSearchError);
        }

        function searchDemoActivities() {
            ctrl.isLoadingList = true;
            ctrl.isLoadingRaceDetails = true;
            return stravaService.searchActivitiesDemo()
                .then(getSearchActivitiesSuccess)
                .catch(getSearchError);
        }

        function getSearchActivitiesSuccess(data) {
            ctrl.isLoadingList = false;
            if (data && data.length > 0) {
                ctrl.raceList = data;
                addStats();

                if ($stateParams.demo) {
                    stravaService.activityDataDemo(ctrl.raceList[0])
                        .then(getActivityDataSuccess)
                        .catch(getSearchError);
                } else {
                    stravaService.activityData(ctrl.raceList[0])
                        .then(getActivityDataSuccess)
                        .catch(getSearchError);
                }

            } else {
                $mdToast.show($mdToast.simple().textContent("No Activities found for selected dates."));
                $state.go('welcome');
            }
            return ctrl.raceList;
        }

        function getActivityDataSuccess(data) {

            updateRaceListWithData(data);
            ctrl.isLoadingRaceDetails = false;
            getNextSetOfRaceData();
            ctrl.playAnimation();

        }

        function getSearchError(e) {
            ctrl.isLoadingList = false;
        }

        function updateRaceListWithData(data) {
            for (var raceKey in ctrl.raceList) {
                if (ctrl.raceList[raceKey].id == data.id) {
                    angular.extend(ctrl.raceList[raceKey], data);
                    break;
                }
            }
        }

        function getNextSetOfRaceData() {
            if (ctrl.selectedRace < ctrl.raceList.length) {
                var upperLimit = Math.min(ctrl.raceList.length, ctrl.selectedRace + numberOfRaceDataToGet);
                for (var current = ctrl.selectedRace + 1; current < upperLimit; current++) {
                    if (!angular.isDefined(ctrl.raceList[current].stream_data)) {
                        if ($stateParams.demo) {
                            stravaService.activityDataDemo(ctrl.raceList[current])
                                .then(getActivityDataBackgroundSuccess)
                                .catch(getSearchError);
                        } else {
                            stravaService.activityData(ctrl.raceList[current])
                                .then(getActivityDataBackgroundSuccess)
                                .catch(getSearchError);
                        }

                    }
                }
            }
        }

        function getActivityDataBackgroundSuccess(data) {
            updateRaceListWithData(data);
        }

        function animateIntroWait() {

            if (angular.equals(ctrl.raceList[ctrl.selectedRace].isPaused, true)) {
                ctrl.raceList[ctrl.selectedRace].isPaused = false;
            }
            else {
                mapService.clearOldRace(ctrl.mapObject);
                mapService.setRaceOutBounds(ctrl.mapObject, ctrl.raceList[ctrl.selectedRace]);
            }


            ctrl.intervalPromise = mapService.introWait(ctrl.mapObject, ctrl.raceList[ctrl.selectedRace]);
            ctrl.intervalPromise.then(animateIntroStartCircle);
        }

        function animateIntroStartCircle() {
            ctrl.intervalPromise = mapService.introStartCircle(ctrl.mapObject, ctrl.raceList[ctrl.selectedRace]);
            ctrl.intervalPromise.then(animateRaceRouteDisplay);
        }

        function animateRaceRouteDisplay() {
            ctrl.intervalPromise = mapService.raceRouteDisplay(ctrl.mapObject, ctrl.raceList[ctrl.selectedRace]);
            ctrl.intervalPromise.then(animatePostRouteWait);
        }

        function animatePostRouteWait() {
            ctrl.intervalPromise = mapService.postRouteWait(ctrl.mapObject, ctrl.raceList[ctrl.selectedRace]);
            ctrl.intervalPromise.then(ctrl.nextRace);
        }


        ctrl.playAnimation = function () {
            animateIntroWait();
        };

        ctrl.restartAnimation = function () {
            ctrl.selectedRace = 0;
            ctrl.finishedAnimation = false;
            resetStats();
            addStats();
            animateIntroWait();
        };

        ctrl.pauseAnimation = function () {
            if (angular.isDefined(ctrl.intervalPromise)) {
                $interval.cancel(ctrl.intervalPromise);
                ctrl.intervalPromise = undefined;
                ctrl.raceList[ctrl.selectedRace].isPaused = true;
            }
        };

        function resetStats() {
            ctrl.totalActivities = 0;
            ctrl.totalDistance = 0;
            ctrl.totalDistance = 0;
            ctrl.totalKudos = 0;
            ctrl.totalComments = 0;
        }

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
            if (ctrl.selectedRace < ctrl.raceList.length - 1) {
                // Spin until stream data is available for next race
                if (!angular.isDefined(ctrl.raceList[ctrl.selectedRace + 1].stream_data)) {
                    ctrl.isLoadingRaceDetails = true;
                    $interval(function () {
                    }, 500, 1).then(ctrl.nextRace);
                    return;
                }
                ctrl.isLoadingRaceDetails = false;

                ctrl.selectedRace++;
                addStats();
                getNextSetOfRaceData();
                animateIntroWait();
            } else {
                ctrl.finishedAnimation = true;
            }
        };


        ctrl.previousRace = function () {
            if (ctrl.selectedRace > 0) {
                subtractStats();
                ctrl.selectedRace--;
            }
        };

    }
})();
