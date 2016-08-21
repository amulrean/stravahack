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

    RaceHomeController.$inject = ['raceService'];

    function RaceHomeController(raceService) {
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

        ctrl.$onInit = function () {
            // searchRaces();
        };

        function searchRaces() {
            ctrl.isLoadingList = true;
            ctrl.isLoadingBoundedList = true;
            return raceService.search(
                ctrl.startDate,
                ctrl.endDate,
                ctrl.searchTerm
                )
                .then(function (data) {
                    ctrl.isLoadingList = false;
                    ctrl.raceList = data.hits;
                    ctrl.raceTotal = data.total;
                    return ctrl.raceList;
                });
        }

        function searchBoundedRaces(bounds) {
            ctrl.raceListBounded = [];
            ctrl.raceTotalBounded = 0;
            ctrl.isLoadingBoundedList = true;

            return raceService.searchBounded(
                ctrl.startDate,
                ctrl.endDate,
                ctrl.searchTerm,
                bounds
                )
                .then(function (data) {
                    ctrl.raceListBounded = data.hits;
                    ctrl.raceTotalBounded = data.total;
                    ctrl.isLoadingBoundedList = false;
                    return ctrl.raceListBounded;
                });
        }

        ctrl.search = function () {
            searchRaces();
        };

        ctrl.clearSearch = function () {
            ctrl.searchTerm = '';
            ctrl.startDate = null;
            ctrl.endDate = null;
            ctrl.selectedRace = null;
            ctrl.raceListBounded = [];
            ctrl.raceTotalBounded = 0;
            return searchRaces();
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
