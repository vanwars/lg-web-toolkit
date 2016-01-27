define(["jquery", "marionette", "mapbox-lib", "views/marker"],
    function ($, Marionette, L, MarkerView) {
        "use strict";
        var MapboxView = Marionette.CollectionView.extend({
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
                new L.Control.Zoom({ position: 'topright' }).addTo(this.map);
                //this.map.scrollWheelZoom.disable();
                this.initialized = true;
            },
            renderMarkers: function () {
                var itemView,
                    that = this;
                if (this.layer != null) {
                    this.map.removeLayer(this.layer);
                }
                this.layer = new L.FeatureGroup();
                this.collection.each(function (model) {
                    itemView = new MarkerView({
                        map: that.map,
                        model: model,
                        token: that.accessToken,
                        clickRoute: that.clickRoute
                    });
                    that.layer.addLayer(itemView.marker);
                });
                this.map.addLayer(this.layer);

                if (this.postRender) {
                    this.postRender(this);
                }
            },

            fitMapToLayer: function () {
                if (this.layer) {
                    this.map.fitBounds(this.layer.getBounds());
                }
            },

            onDestroy: function () {
                this.undelegateEvents();
                $(this.el).empty();
            }
        });
        return MapboxView;
    });