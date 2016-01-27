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
            this.model.set("color", "eb6627");
            this.icon = L.icon({
                iconUrl: this.markerUrl + "pin-m+" + (this.model.get("color") || "CCC") + "@2x.png?access_token=" + this.token,
                iconRetinaUrl: this.markerUrl + "pin-m+" + (this.model.get("color") || "CCC") + ".png?access_token=" + this.token,
                iconSize: [30, 70],
                iconAnchor: [15, 35]
            });
            this.highlightIcon = L.icon({
                iconUrl: this.markerUrl + "pin-m+999@2x.png?access_token=" + this.token,
                iconRetinaUrl: this.markerUrl + "pin-m+999.png?access_token=" + this.token,
                iconSize: [30, 70],
                iconAnchor: [15, 35]
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
            var id = e.target.options.id;
            if (this.clickRoute) {
                window.location.hash = "#/" + this.clickRoute + "/" + id;
            }
            //this.marker.setIcon(this.highlightIcon);
        },

        zoomTo: function (zoom) {
            this.map.setView(this.getCoords(), zoom, { animation: true });
        }
    });
    return Marker;
});