define([], function () {
    "use strict";
    var ViewMixin = {
        extras: {},
        render: function () {
            if (!this.template_path) {
                return this.$el;
            }
            var that = this,
                template_path = window.location.toString().split("#")[0];
            if (!this.template) {
                require(
                    ["handlebars", "text!" + template_path + "/templates/" + this.template_path, "handlebars-helpers"],
                    function (Handlebars, Path) {
                        //console.log("Template is loading asynchronously");
                        that.template = Handlebars.compile(Path);
                        that.$el.html(that.template(that.extras));
                        if (that.postRender) {
                            that.postRender(that);
                        }
                    }
                );
            } else {
                //console.log("Template loading from memory");
                this.$el.html(this.template(this.extras));
                if (this.postRender) {
                    this.postRender(this);
                }
            }
            if (this.onRender) {
                this.onRender();
            }
            return this.$el;
        },
        validate: function () {
            if (this.template === 'undefined') {
                throw new Error("template_source must be defined upon initialization");
            }
        }
    };
    return ViewMixin;
});