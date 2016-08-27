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

    RaceHomeController.$inject = ['stravaService', 'logger'];

    function RaceHomeController(stravaService) {
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

        ctrl.$onInit = function () {
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
                ctrl.startDate,
                ctrl.endDate,
                ctrl.searchTerm
            )
                .then(function (data) {
                    ctrl.isLoadingList = false;
                    if (data && data.length > 0) {
                        ctrl.raceList = data;
                        ctrl.selectedRace = 0;
                    } else {
                        $mdToast.show($mdToast.simple().textContent("No Activities found."));
                    }
                    return ctrl.raceList;
                });
        }

        ctrl.nextRace = function () {
            if (ctrl.selectedRace < ctrl.raceList.length -1) {
                ctrl.selectedRace ++;
            }
        };

        ctrl.previousRace = function () {
            if (ctrl.selectedRace > 0) {
                ctrl.selectedRace --;
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
