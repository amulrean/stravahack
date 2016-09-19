(function () {
    'use strict';

    angular
        .module('app.races.services')
        .factory('mapService', mapService);

    mapService.$inject = ['leafletBoundsHelpers', '$interval'];

    function mapService(leafletBoundsHelpers, $interval) {
        var mapService = {
            getDefaultMapObject: getDefaultMapObject,
            addBaseLayer: addBaseLayer,
            addOverlay: addOverlay,
            updateBounds: updateBounds,
            updateRacesAndRoutes: updateRacesAndRoutes,
            addRaceMarker: addRaceMarker,
            addRaceRoute: addRaceRoute,
            toggleRaceRoute: toggleRaceRoute,
            removeRaceRoute: removeRaceRoute,
            updateSelectedRacePath: updateSelectedRacePath,
            getPathRaceObjectById: getPathRaceObjectById,
            resetMap: resetMap,
            baselayers: {
                mapboxRunBikeHike: {
                    name: 'MapBoxRunBikeHike',
                    type: 'xyz',
                    url: 'http://{s}.tiles.mapbox.com/v4/{map}/{z}/{x}/{y}.png?access_token={access_token}',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        access_token: 'pk.eyJ1IjoiYW5kcmV3aHVtYW5nZW8iLCJhIjoiY2lvNXU0NWhpMDIzbHcxa3EyOXJrMGYzeCJ9.H9GEdE7i7Jz1H4yH-v8Csw',
                        map: 'mapbox.run-bike-hike',
                    }
                },
                openStreetMap: {
                    name: 'OpenStreetMap',
                    url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                    }
                },
                openCycle: {
                    name: 'OpenCycleMap',
                    url: 'http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true
                    }
                },
                mapQuestOpen: {
                    name: 'MapQuestOpen',
                    url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        subdomains: '1234',
                        type: 'osm',
                    }
                },
                mapQuestOpenAerial: {
                    name: 'MapQuestOpenAerial',
                    url: 'http://otile{s}.mqcdn.com/tiles/1.0.0/{type}/{z}/{x}/{y}.png',
                    type: 'xyz',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        subdomains: '1234',
                        type: 'sat',
                    }
                },
                mapboxLight: {
                    name: 'MapBoxLight',
                    type: 'xyz',
                    url: 'http://{s}.tiles.mapbox.com/v4/{map}/{z}/{x}/{y}.png?access_token={access_token}',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        access_token: 'pk.eyJ1IjoiYW5kcmV3aHVtYW5nZW8iLCJhIjoiY2lvNXU0NWhpMDIzbHcxa3EyOXJrMGYzeCJ9.H9GEdE7i7Jz1H4yH-v8Csw',
                        map: 'mapbox.light',
                    }
                },
                mapboxDark: {
                    name: 'MapBoxDark',
                    type: 'xyz',
                    url: 'http://{s}.tiles.mapbox.com/v4/{map}/{z}/{x}/{y}.png?access_token={access_token}',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        access_token: 'pk.eyJ1IjoiYW5kcmV3aHVtYW5nZW8iLCJhIjoiY2lvNXU0NWhpMDIzbHcxa3EyOXJrMGYzeCJ9.H9GEdE7i7Jz1H4yH-v8Csw',
                        map: 'mapbox.dark',
                    }
                },
                mapboxSat: {
                    name: 'MapBoxSat',
                    type: 'xyz',
                    url: 'http://{s}.tiles.mapbox.com/v4/{map}/{z}/{x}/{y}.png?access_token={access_token}',
                    layerOptions: {
                        "chunkedLoading": true,
                        "removeOutsideVisibleBounds": true,
                        access_token: 'pk.eyJ1IjoiYW5kcmV3aHVtYW5nZW8iLCJhIjoiY2lvNXU0NWhpMDIzbHcxa3EyOXJrMGYzeCJ9.H9GEdE7i7Jz1H4yH-v8Csw',
                        map: 'mapbox.satellite',
                    }
                }
            },
            overlays: {
                races: {
                    name: "Races",
                    type: "markercluster",
                    visible: true,
                    layerOptions: {
                        disableClusteringAtZoom: 15,
                        maxClusterRadius: 70
                    }
                },
                routes: {
                    name: "Course Routes",
                    type: "group",
                    visible: true
                },
                selectedRace: {
                    name: "Selected Race",
                    type: "group",
                    visible: true
                }
            },
            bounds: {
                northEasterUS: {
                    "northEast": {
                        "lat": 34.8866,
                        "lng": -92.4877
                    },
                    "southWest": {
                        "lat": 42.723,
                        "lng": -70.9863
                    }
                }
            }
        };
        return mapService;

        function getDefaultMapObject() {
            var defaultMapObject = {
                center: {},
                layers: {
                    baselayers: {},
                    overlays: {}
                },
                bounds: {},
                markers: {},
                paths: {},
                events: {
                    map: {
                        enable: ['moveend', 'popupopen'],
                        logic: 'emit'
                    },
                    marker: {
                        enable: [],
                        logic: 'emit'
                    },
                    path: {
                        enable: [],
                        logic: 'emit'
                    }
                },
                watchOptions: {
                    markers: {
                        type: null,
                        individual: {
                            type: null
                        }
                    }
                }
            };

            return defaultMapObject;
        }

        function addBaseLayer(mapObject, layerKey, layerObject) {
            mapObject.layers.baselayers[layerKey] = layerObject;
        }

        function addOverlay(mapObject, overlayKey, overlayObject) {
            mapObject.layers.overlays[overlayKey] = overlayObject;
        }

        function updateBounds(mapObject, newBounds) {
            angular.extend(mapObject.bounds, newBounds);
        }

        function updateRacesAndRoutes(mapObject, raceList) {

            //Clear old markes and races
            mapObject.markers = {};
            mapObject.paths = {};

            var outsideBoundsLatLongArray = [[180, 180], [-180, -180]];

            for (var race in raceList) {
                var raceObj = raceList[race];

                if (raceObj._source.location != null) {

                    addRaceMarker(mapObject, raceObj);
                    extendBoundsIfNeeded(outsideBoundsLatLongArray, raceObj._source.location.lat, raceObj._source.location.lon);
                }
            }

            var routeBounds = leafletBoundsHelpers.createBoundsFromArray(outsideBoundsLatLongArray);
            updateBounds(mapObject, routeBounds);
        }

        function extendBoundsIfNeeded(currentBoundArray, lat, lng) {
            if (lat < currentBoundArray[0][0]) {
                currentBoundArray[0][0] = lat;
            }
            if (lng < currentBoundArray[0][1]) {
                currentBoundArray[0][1] = lng;
            }
            if (lat > currentBoundArray[1][0]) {
                currentBoundArray[1][0] = lat;
            }
            if (lng > currentBoundArray[1][1]) {
                currentBoundArray[1][1] = lng;
            }

        }

        function addRaceMarker(mapObject, raceObj) {
            mapObject.markers[raceObj._id] = {
                layer: "races",
                lat: raceObj._source.location.lat,
                lng: raceObj._source.location.lon,
                label: {
                    message: raceObj._source.title,
                },
                raceObj: raceObj
            };
        }

        function addRaceRoute(mapObject, raceObj) {
            if (raceObj._source.route != null) {

                if (mapObject.paths[raceObj._id] == null) {
                    mapObject.paths[raceObj._id] = {
                        layer: "routes",
                        latlngs: [],
                        weight: 10,
                        opacity: .4,
                        color: '#800000',
                        raceObj: raceObj
                    };

                    var outsideBoundsLatLongArray = [[180, 180], [-180, -180]];
                    for (var latlonId in raceObj._source.route.coordinates) {
                        var currentLatlon = raceObj._source.route.coordinates[latlonId];
                        var lat = currentLatlon[1];
                        var lng = currentLatlon[0];

                        mapObject.paths[raceObj._id].latlngs.push({lat: lat, lng: lng});
                        extendBoundsIfNeeded(outsideBoundsLatLongArray, lat, lng);

                    }
                    var routeBounds = leafletBoundsHelpers.createBoundsFromArray(outsideBoundsLatLongArray);
                    updateBounds(mapObject, routeBounds);
                }
            }
        }

        function removeRaceRoute(mapObject, raceObj) {
            delete mapObject.paths[raceObj._id];
        }

        function toggleRaceRoute(mapObject, raceObj) {
            if (raceObj._source.route != null) {

                if (mapObject.paths[raceObj._id] == null) {
                    addRaceRoute(mapObject, raceObj);
                } else {
                    removeRaceRoute(mapObject, raceObj);
                }
            }
        }

        function updateSelectedRacePath(mapObject, raceObj) {
            if (raceObj) {
                mapObject.paths["selectedRace"] = {
                    layer: "selectedRace",
                    type: "circleMarker",
                    latlngs: [0, 0],
                    radius: 200,
                    color: '#EF6C00'
                };
            } else {
                mapObject.paths["selectedRace"] = {};
            }

            mapObject.paths['raceDetailRoute'] = {
                latlngs: [],
                weight: 10,
                color: '#800000'
            };

            if (raceObj.hasOwnProperty("stream_data")) {

                var outsideBoundsLatLongArray = [[180, 180], [-180, -180]];

                var pathLatLngs = angular.copy(raceObj.stream_data.latlng);

                for (var latlonId in pathLatLngs) {
                    var currentLatlon = pathLatLngs[latlonId];
                    var lat = currentLatlon[0];
                    var lng = currentLatlon[1];
                    extendBoundsIfNeeded(outsideBoundsLatLongArray, lat, lng);
                }
                var routeBounds = leafletBoundsHelpers.createBoundsFromArray(outsideBoundsLatLongArray);
                updateBounds(mapObject, routeBounds);


                $interval(function () {
                }, 500, 1).then(function () {
                    $interval(function () {
                        mapObject.paths['selectedRace'].latlngs = [pathLatLngs[0][0], pathLatLngs[0][1]];
                        var oldRadius = mapObject.paths['selectedRace'].radius;
                        mapObject.paths['selectedRace'].radius = oldRadius - 1;
                    }, 5, 180).then(function () {
                            $interval(function () {
                                var currentLatlon = pathLatLngs.shift();
                                var lat = currentLatlon[0];
                                var lng = currentLatlon[1];
                                mapObject.paths['raceDetailRoute'].latlngs.push({lat: lat, lng: lng});
                                mapObject.paths['selectedRace'].latlngs = [lat, lng];
                            }, 50, pathLatLngs.length);
                        }
                    )
                });
            }


        }

        function addNextPoint(mapObject, raceObject) {


        }

        function getPathRaceObjectById(mapObject, raceObjId) {
            return mapObject.paths[raceObjId].raceObj;
        }

        function resetMap(mapObject) {
            updateBounds(mapObject, mapService.bounds.northEasterUS);
            mapObject.markers = {};
            mapObject.paths = {};
        }
    }
})();