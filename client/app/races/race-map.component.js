(function () {
    'use strict';

    angular
        .module('app.races.components')
        .component('raceMap', {
            bindings: {
                raceList: '<',
                selectedRace: '<',
                clickedRace: '<',
                onMapBoundsUpdate: '&',
                onSelect: '&',
                onClickSelected: '&'
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

            //Add Event Actions
            $scope.$on('leafletDirectiveMarker.raceMap.mouseover', function (event, args) {

                ctrl.onSelect({race: args.model.raceObj});
            });

            $scope.$on('leafletDirectiveMarker.raceMap.click', function (event, args) {

                ctrl.onClickSelected({race: args.model.raceObj});
            });

            $scope.$on('leafletDirectivePath.raceMap.mouseover', function (event, args) {

                var raceObj = mapService.getPathRaceObjectById(ctrl.mapObject, args.modelName);

                ctrl.onSelect({race: raceObj});
            });

            $scope.$on('leafletDirectivePath.raceMap.click', function (event, args) {

                var raceObj = mapService.getPathRaceObjectById(ctrl.mapObject, args.modelName);

                ctrl.onClickSelected({race: raceObj});
            });

        };

        ctrl.$onChanges = function (changesObj) {

            if (changesObj.raceList && changesObj.raceList.currentValue != changesObj.raceList.previousValue) {
                mapService.updateRacesAndRoutes(ctrl.mapObject, changesObj.raceList.currentValue);
            }

            if (changesObj.selectedRace &&
                changesObj.selectedRace.currentValue != changesObj.selectedRace.previousValue) {
                mapService.updateSelectedRacePath(ctrl.mapObject, changesObj.selectedRace.currentValue);
            }

            if (changesObj.clickedRace &&
                changesObj.clickedRace.currentValue != changesObj.clickedRace.previousValue) {
                mapService.toggleRaceRoute(ctrl.mapObject, changesObj.clickedRace.currentValue);
            }
        };


        $scope.$watch('$ctrl.mapObject.bounds', _.debounce(function (newValue, oldValue) {
            if (newValue != oldValue && ctrl.initialBoundsSet === true) {
                ctrl.onMapBoundsUpdate({bounds: ctrl.mapObject.bounds});
            }
            // When the page is rendered bounds are intially set to the size of the page, we don't want to use those bounds to search
            if (ctrl.initialBoundsSet === false) {
                ctrl.initialBoundsSet = true;
            }

        }, 1000));


    }
})();
