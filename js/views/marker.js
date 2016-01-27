define(["marionette", "underscore", "mapbox-lib"], function (Marionette, _, L) {
    "use strict";
    var Marker = Marionette.ItemView.extend({
        model: null,
        marker: null,
        markerUrl: 'https://api.mapbox.com/v4/marker/',
        modelEvents: {
            'zoom-to-marker': 'zoomTo'
        },
        initialize: function (opts) {
            _.extend(this, opts);
            var factor = 1.5;
            if (this.color) {
                this.model.set("color", this.color);
            }
            this.icon = L.icon({
                iconUrl: this.markerUrl + "pin-m+" + (this.model.get("color") || "CCC") + ".png?access_token=" + this.token,
                iconRetinaUrl: this.markerUrl + "pin-m+" + (this.model.get("color") || "CCC") + "@2x.png?access_token=" + this.token,
                iconSize: [30 * factor, 70 * factor],
                iconAnchor: [15 * factor, 35 * factor]
            });
            this.highlightIcon = L.icon({
                iconUrl: this.markerUrl + "pin-m+999.png?access_token=" + this.token,
                iconRetinaUrl: this.markerUrl + "pin-m+999@2x.png?access_token=" + this.token,
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
                url = this.markerURL.replace(":id", id);
            if (this.markerURL) {
                window.location.hash = "#/" + url;
            }
            //this.marker.setIcon(this.highlightIcon);
        },

        zoomTo: function (zoom) {
            this.map.setView(this.getCoords(), zoom, { animation: true });
        }
    });
    return Marker;
});