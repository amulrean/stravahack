(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceMap', {
            bindings: {
                raceList: '<',
                selectedRace: '<',
            },
            templateUrl: 'static/app/races/race-map.html',
            controller: RaceMapController
        });

    RaceMapController.$inject = ['mapService', '$scope'];

    function RaceMapController(mapService, $scope) {
        var ctrl = this;

        ctrl.mapObject = {};
        ctrl.initialBoundsSet = false;

        ctrl.$onInit = function () {

            // Build Leaflet Map Object
            ctrl.mapObject = mapService.getDefaultMapObject();

            mapService.addBaseLayer(ctrl.mapObject, 'mapboxRunBikeHike', mapService.baselayers.mapboxRunBikeHike);
            mapService.addBaseLayer(ctrl.mapObject, 'openStreetMap', mapService.baselayers.openStreetMap);
            mapService.addBaseLayer(ctrl.mapObject, 'openCycle', mapService.baselayers.openCycle);
            mapService.addBaseLayer(ctrl.mapObject, 'mapQuestOpen', mapService.baselayers.mapQuestOpen);
            mapService.addBaseLayer(ctrl.mapObject, 'mapQuestOpenAerial', mapService.baselayers.mapQuestOpenAerial);
            mapService.addBaseLayer(ctrl.mapObject, 'mapboxLight', mapService.baselayers.mapboxLight);
            mapService.addBaseLayer(ctrl.mapObject, 'mapboxDark', mapService.baselayers.mapboxDark);
            mapService.addBaseLayer(ctrl.mapObject, 'mapboxSat', mapService.baselayers.mapboxSat);

            mapService.addOverlay(ctrl.mapObject, 'races', mapService.overlays.races);
            mapService.addOverlay(ctrl.mapObject, 'routes', mapService.overlays.routes);
            mapService.addOverlay(ctrl.mapObject, 'selectedRace', mapService.overlays.selectedRace);

            mapService.updateBounds(ctrl.mapObject, mapService.bounds.northEasterUS);


        };

        ctrl.$onChanges = function (changesObj) {

            if (changesObj.selectedRace && changesObj.selectedRace.currentValue !== null &&
                changesObj.selectedRace.currentValue != changesObj.selectedRace.previousValue) {
                mapService.updateSelectedRacePath(ctrl.mapObject, ctrl.raceList[changesObj.selectedRace.currentValue]);
            }
        };


    }
})();
