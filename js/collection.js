define(["underscore", "backbone", "lib/sqlParser"],
    function (_, Backbone, SqlParser) {
        "use strict";
        /**
         * An "abstract" Backbone Collection; the root of all of the other
         * localground.collections.* classes. Has some helper methods that help
         * Backbone.Collection objects more easily interat with the Local Ground
         * Data API.
         * @class localground.collections.Base
         */
        var Base = Backbone.Collection.extend({
            key: null,
            next: null,
            previous: null,
            count: 0,
            page_size: 100,
            defaults: {
                isVisible: true
            },
            initialize: function (opts) {
                _.extend(this, opts);
                this.url = this.api_endpoint + '?page_size=' + this.page_size;
                this.url += '&format=json';
                if (this.server_query) {
                    this.url += "&query=" + this.server_query;
                }
            },
            parse: function (response) {
                this.count = response.count;
                this.next = response.next;
                this.previous = response.previous;
                //console.log(this.next, this.previous, this.count);
                return response.results;
            },

            applyFilter: function (sql) {
                var sqlParser = new SqlParser(sql);
                this.each(function (model) {
                    if (sqlParser.checkModel(model)) {
                        model.set("hidden", false);
                    } else {
                        model.set("hidden", true);
                    }
                });
                this.trigger('filter-applied');
            },

            clearFilter: function () {
                //console.log("clearFilter");
                this.each(function (model) {
                    model.set("hidden", false);
                });
                this.trigger('filter-applied');
            }

        });

        return Base;
    });
