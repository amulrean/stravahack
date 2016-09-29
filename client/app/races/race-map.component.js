(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceMap', {
            bindings: {
                mapObject: '=',
            },
            templateUrl: 'static/app/races/race-map.html',
            controller: RaceMapController
        });

    RaceMapController.$inject = ['mapService', '$scope', '$mdMedia'];

    function RaceMapController(mapService, $scope, $mdMedia) {
        var ctrl = this;

        ctrl.initialBoundsSet = false;

        ctrl.$onInit = function () {

            // Build Leaflet Map Object
            ctrl.mapObject = mapService.getDefaultMapObject();

            ctrl.defaults = {
                    // Disable dragging on mobile
                    dragging: $mdMedia('(min-width: 840px)'),
            };

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


    }
})();
