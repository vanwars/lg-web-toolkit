define(["marionette", "underscore", "mapbox-lib"], function (Marionette, _, L) {
    "use strict";
    var Marker = Marionette.ItemView.extend({
        model: null,
        marker: null,
        modelEvents: {
            'zoom-to-marker': 'zoomTo',
            'center-marker': 'centerMarker'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            this.markerOpts = this.markerOpts || {};
            var factor = 1.5,
                baseIconURL = 'https://api.mapbox.com/v4/marker/';
            if (this.markerOpts.icon) {
                this.icon = L.icon(this.markerOpts.icon);
            } else {
                if (this.markerOpts.color) {
                    this.model.set("color", this.markerOpts.color);
                }
                this.icon = L.icon({
                    iconUrl: baseIconURL + "pin-m+" + (this.model.get("color") || "CCC") + ".png?access_token=" + this.token,
                    iconRetinaUrl: baseIconURL + "pin-m+" + (this.model.get("color") || "CCC") + "@2x.png?access_token=" + this.token,
                    iconSize: [30 * factor, 70 * factor],
                    iconAnchor: [15 * factor, 35 * factor]
                });
            }
            this.highlightIcon = L.icon({
                iconUrl: baseIconURL + "pin-m+999.png?access_token=" + this.token,
                iconRetinaUrl: baseIconURL + "pin-m+999@2x.png?access_token=" + this.token,
                iconSize: [30 * factor, 70 * factor],
                iconAnchor: [15 * factor, 35 * factor]
            });
            this.marker = L.marker(this.getCoords(), this.getProperties());
            this.marker.on('click', this.markerClick.bind(this));
        },

        getCoords: function () {
            return [
                this.model.get("geometry").coordinates[1],
                this.model.get("geometry").coordinates[0]
            ];
        },

        getProperties: function () {
            return {
                id: this.model.get("id"),
                name: this.model.get("name"),
                "icon": this.icon
            };
        },

        markerClick: function (e) {
            var id = e.target.options.id,
                url = this.markerOpts.clickURL;
            if (url) {
                url = url.replace(":id", id);
                window.location.hash = "#/" + url;
            }
        },

        zoomTo: function (zoom) {
            this.map.setView(this.getCoords(), zoom, { animation: true });
        },

        centerMarker: function () {
            var zoom = this.map.getZoom();
            if (zoom < this.markerOpts.zoomLevelDetail) {
                zoom = this.markerOpts.zoomLevelDetail;
            }
            this.map.setView(this.getCoords(), zoom, { animation: true });
        }
    });
    return Marker;
});