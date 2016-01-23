define(["underscore", "marionette", "views/view-mixin"],
    function (_, Marionette, ViewMixin) {
        "use strict";
        var RecordView = Marionette.ItemView.extend({
            model: null,
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
            }
        });
        _.extend(RecordView.prototype, ViewMixin);
        return RecordView;
    });