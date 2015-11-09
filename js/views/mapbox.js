define(["jquery", "marionette", "mapbox-lib"],
    function ($, Marionette, L) {
        "use strict";
        var MapboxView = Marionette.CompositeView.extend({
            id: 'map',
            map: null,
            initialized: false,
            layer: null,
            initialize: function (opts) {
                // optional dataset:
                if (opts.collection) {
                    this.collection = opts.collection;
                    this.collection.fetch({ reset: true });
                    this.listenTo(this.collection, 'reset', this.renderMarkers);
                }
                this.initMap();
            },
            initMap: function () {
                //initialize the map:
                if (this.initialized) {
                    console.log("map already initialized");
                    return;
                }
                L.mapbox.accessToken = this.accessToken;
                this.map = L.mapbox.map('map', this.styleID, {
                    zoomControl: false
                }).setView([37.812, -122.294], 13);
                this.map.scrollWheelZoom.disable();
                new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
                this.initialized = true;
            },
            renderMarkers: function () {
                if (this.layer != null) { return; }
                this.layer = L.mapbox.featureLayer().addTo(this.map);
                var places = {
                        type: 'FeatureCollection',
                        features: []
                    },
                    that = this;
                this.collection.each(function (marker) {
                    var properties = {
                        id: marker.get("id"),
                        name: marker.get("name")
                    };

                    //add icon:
                    _.extend(properties, {
                        "marker-color": marker.get("color"),
                        "marker-symbol": that.markerSymbol || "",
                        "marker-size": "large"
                    });

                    //console.log(properties);
                    places.features.push({
                        geometry: marker.get("geometry"),
                        properties: properties,
                        type: "Feature"
                    });
                });
                this.layer.on('layeradd', function (e) {
                    if (e.layer.feature.properties.icon) {
                        e.layer.setIcon(L.divIcon(e.layer.feature.properties.icon));
                    }
                });
                this.layer.setGeoJSON(places);
                this.layer.on('click', function (e) {
                    that.markerClick(e);
                });
            },
            markerClick: function (e) {
                var id = e.layer.feature.properties.id,
                    route = "#/item/" + id,
                    latLng = e.layer.getLatLng();

                // load route:
                window.location.hash = route;

                // pan map:
                this.map.setView([latLng.lat, latLng.lng], this.map.getZoom());
            }
        });
        return MapboxView;
    });