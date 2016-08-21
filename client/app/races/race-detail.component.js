(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceDetail', {
            bindings: {
                selectedRace: '<'
            },
            templateUrl: 'static/app/races/race-detail.html',
            controller: RaceDetailController
        });

    RaceDetailController.$inject = ['mapService'];

    function RaceDetailController(mapService) {
        var ctrl = this;

        ctrl.mapObject = {};

        ctrl.$onInit = function () {

            ctrl.mapObject = mapService.getDefaultMapObject();

            mapService.addBaseLayer(ctrl.mapObject, 'mapboxLight', mapService.baselayers.mapboxLight);
            mapService.addBaseLayer(ctrl.mapObject, 'mapboxSat', mapService.baselayers.mapboxSat);

        };

        ctrl.$onChanges = function (changesObj) {

            if (changesObj.selectedRace && changesObj.selectedRace.currentValue != changesObj.selectedRace.oldValue) {
                mapService.updateSelectedRaceDetailRoute(ctrl.mapObject, changesObj.selectedRace.currentValue);
            }

        };

    }
})();
