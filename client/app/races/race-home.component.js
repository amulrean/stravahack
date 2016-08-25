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

    RaceHomeController.$inject = ['stravaService'];

    function RaceHomeController(stravaService) {
        var ctrl = this;

        ctrl.bounderQuery = null;

        ctrl.raceList = [];
        ctrl.raceListBounded = [];
        ctrl.raceTotal = 0;
        ctrl.raceTotalBounded = 0;
        ctrl.selectedRace = null;
        ctrl.clickedRace = null;
        ctrl.searchTerm = '';
        ctrl.startDate = null;
        ctrl.endDate = null;
        ctrl.isLoadingList = false;
        ctrl.isLoadingBoundedList = false;
        ctrl.profile = {};

        ctrl.$onInit = function () {
            if (stravaService.getIsAuthenticated()) {
                //searchActivities();

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
                    ctrl.raceList = data;
                    return ctrl.raceList;
                });
        }

        function searchBoundedRaces(bounds) {
            ctrl.raceListBounded = [];
            ctrl.raceTotalBounded = 0;
            // ctrl.isLoadingBoundedList = true;
            //
            // return raceService.searchBounded(
            //     ctrl.startDate,
            //     ctrl.endDate,
            //     ctrl.searchTerm,
            //     bounds
            //     )
            //     .then(function (data) {
            //         ctrl.raceListBounded = data.hits;
            //         ctrl.raceTotalBounded = data.total;
            //         ctrl.isLoadingBoundedList = false;
            //         return ctrl.raceListBounded;
            //     });
        }

        ctrl.search = function () {
            searchActivities();
        };

        ctrl.clearSearch = function () {
            ctrl.searchTerm = '';
            ctrl.startDate = null;
            ctrl.endDate = null;
            ctrl.selectedRace = null;
            ctrl.raceListBounded = [];
            ctrl.raceTotalBounded = 0;
            return searchActivities();
        };

        ctrl.onSelect = function (race) {
            ctrl.selectedRace = race;
        };

        ctrl.onClickSelected = function (race) {
            ctrl.clickedRace = angular.copy(race);
        };

        ctrl.onMapBoundsUpdate = function (bounds) {
            ctrl.raceListBounded = [];
            ctrl.bounderQuery = searchBoundedRaces(bounds);
        };

    }
})();
