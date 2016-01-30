define(["jquery", "underscore", "marionette", "views/view-mixin"],
    function ($, _, Marionette, ViewMixin) {
        "use strict";
        var RecordView = Marionette.ItemView.extend({
            model: null,
            events: {
                'click .zoom': 'zoomToMarker'
            },
            modelEvents: {
                'change': 'render'
            },
            initialize: function (opts) {
                var that = this;
                this.opts = opts;
                _.extend(this, opts);
                _.extend(this.extras, opts.params);

                // hack for Safari (json format is not automatically selected):
                this.model.url = function () {
                    return that.model.urlRoot + '?format=json';
                };
                if (this.model.isFetched) {
                    //used cached model:
                    _.extend(that.extras, that.model.toJSON());
                    that.render();
                    return;
                }
                // go get the data from the server:
                this.model.fetch({
                    success: function () {
                        that.model.isFetched = true;
                        _.extend(that.extras, that.model.toJSON());
                        that.render();
                    }
                });
            },
            onRender: function () {
                //post-render functionality:
                this.model.trigger('center-marker');
            },
            zoomToMarker: function (e) {
                var zoom = $(e.target).attr("zoom-level");
                if (!zoom) {
                    alert("Please give your zoom a \"zoom-level\" attribute.");
                }
                this.model.trigger('zoom-to-marker', zoom);
                e.preventDefault();
            }
        });
        _.extend(RecordView.prototype, ViewMixin);
        return RecordView;
    });