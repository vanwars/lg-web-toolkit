define(["underscore", "backbone"],
    function (_, Backbone) {
        "use strict";
        var Record = Backbone.Model.extend({
            urlRoot: null,
            initialize: function (opts) {
                _.extend(this, opts);
            },
            url: function () {
                /*
                Terrible hack to accomodate the Django REST Framework. Before the
                browser issues a POST, PUT, or PATCH request, it first issues an
                OPTIONS request to ensure that the request is legal. For some reason,
                the Local Ground produces an error for this OPTIONS request if a
                '/.json' footer isn't attached to the end. Hence this function overrides
                the based url() funciton in backbone
                */
                var base = _.result(this, 'urlRoot') ||
                            _.result(this.collection, 'url');
                if (this.isNew()) {
                    return base + '.json';
                }
                return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id) + '/.json';
            }

        });
        return Record;
    });
