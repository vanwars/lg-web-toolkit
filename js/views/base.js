define(["underscore", "marionette", "views/view-mixin"],
    function (_, Marionette, ViewMixin) {
        "use strict";
        var BaseView = Marionette.View.extend({
            initialize: function () {
                //Note: validate and render are defined in the ViewMixin.
                this.validate();
                this.render();
            }
        });
        _.extend(BaseView.prototype, ViewMixin);
        return BaseView;
    });