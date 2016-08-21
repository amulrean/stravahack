(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceList', {
            bindings: {
                raceListBounded: '<',
                selectedRace: '<',
                onSelect: '&',
                onClickSelected: '&'
            },
            templateUrl: 'static/app/races/race-list.html',
            controller: RaceListController
        });
    RaceListController.$inject = ['raceService'];

    function RaceListController(raceService) {
        var ctrl = this;

    }
})();

