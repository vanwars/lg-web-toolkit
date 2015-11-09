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
                _.extend(this, opts);
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