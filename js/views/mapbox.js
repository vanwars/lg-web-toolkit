define(["jquery", "marionette", "mapbox-lib"],
    function ($, Marionette, L) {
        "use strict";
        var MapboxView = Marionette.CompositeView.extend({
            id: 'map',
            map: null,
            initialized: false,
            markerRoute: null,
            layer: null,
            initialize: function (opts) {
                // optional dataset:
                this.opts = opts;
                var that = this;
                if (opts.collection) {
                    this.collection = opts.collection;
                    // Only fetch from server if a server query hasn't yet been issued:
                    if (!this.collection.fetched) {
                        this.collection.fetch({
                            reset: true,
                            success: function () { that.collection.fetched = true; }
                        });
                    } else {
                        that.collectionReset();
                    }
                    this.listenTo(this.collection, 'reset', this.collectionReset);
                    this.listenTo(this.collection, 'filter-applied', this.filterApplied);
                }
                this.initMap();
            },
            collectionReset: function () {
                this.renderMarkers();
            },
            filterApplied: function () {
                this.renderMarkers();
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
                }).setView(this.opts.center, this.opts.zoom);
                //this.map.scrollWheelZoom.disable();
                new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
                this.initialized = true;
            },
            centerMap: function () {
                alert("hi");
            },
            renderMarkers: function () {
                if (this.layer != null) { 
                    this.map.removeLayer(this.layer);
                }
                this.layer = L.mapbox.featureLayer().addTo(this.map);
                var places = {
                        type: 'FeatureCollection',
                        features: []
                    },
                    that = this;
                this.collection.each(function (model) {
                    if (model.get("hidden")) {
                        return;
                    }
                    var properties = {
                        id: model.get("id"),
                        name: model.get("name")
                    };

                    //add icon:
                    _.extend(properties, {
                        "marker-color": model.get("color"),
                        "marker-symbol": that.markerSymbol || "",
                        "marker-size": "large"
                    });

                    //console.log(properties);
                    places.features.push({
                        geometry: model.get("geometry"),
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
                //this.map.fitBounds(this.layer.getBounds());
                this.layer.on('click', function (e) {
                    that.markerClick(e);
                });
                if (this.postRender) {
                    this.postRender(this);
                }
            },
            markerClick: function (e) {
                var id = e.layer.feature.properties.id,
                    latLng = e.layer.getLatLng();

                // pan map:
                //this.map.setView([latLng.lat, latLng.lng], this.map.getZoom());

                // load route:
                if (this.clickRoute) {
                    window.location.hash = "#/" + this.clickRoute + "/" + id;
                }

            },

            zoomTo: function (coords, zoom) {
                /*var that = this;
                this.map.panTo(coords, {animate: true, duration: 1.0});
                setTimeout(function () {
                    that.map.setZoom(zoom, { animate: true });
                }, 1000);
                */
                this.map.setView(coords, zoom, { animation: true });
            },

            fitMapToLayer: function () {
                this.map.fitBounds(this.layer.getBounds());
            },

            onDestroy: function () {
                this.undelegateEvents();
                $(this.el).empty();
            }
        });
        return MapboxView;
    });