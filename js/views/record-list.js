define(["jquery",
        "marionette"
    ],
    function ($, Marionette) {
        'use strict';
        var RecordList = Marionette.CompositeView.extend({
            extras: {},
            events: {
                'click .page': 'newPage'
            },

            childViewContainer: '.data-container',

            initialize: function (opts) {
                this.opts = opts;
                _.extend(this.extras, opts.params);
                this.applyBindVariablesToQuery();
                this.collection = opts.collection;
                this.listenTo(this.collection, 'reset', this.renderWithHelpers);
                this.loadTemplates(opts);
            },

            applyBindVariablesToQuery: function () {
                var that = this;
                _.each(this.params, function (val, key) {
                    that.client_query = that.client_query.replace(":" + key, val);
                });
            },

            // overriding the "addChild" method so that only data elements
            // that are visible render:
            addChild: function (child, ChildView, index) {
                if (!child.get('hidden')) {
                    return Marionette.CollectionView.prototype.addChild.call(this, child, ChildView, index);
                }
                return null;
            },

            loadTemplates: function (opts) {
                var that = this,
                    template_path = window.location.toString().split("#")[0];
                require([
                    "handlebars",
                    "text!" + template_path + "/templates/" + opts.collection_template_path,
                    "text!" + template_path + "/templates/" + opts.item_template_path,
                    "handlebars-helpers"],

                    function (Handlebars, CollectionTemplatePath, ItemTemplatePath) {
                        that.childView = Marionette.ItemView.extend({
                            template: Handlebars.compile(ItemTemplatePath),
                            serializeData: function () {
                                var data = Marionette.ItemView.prototype.serializeData.apply(this, arguments);
                                _.extend(data, that.extras);
                                return data;
                            }
                        });
                        that.template = Handlebars.compile(CollectionTemplatePath);
                        // Only fetch from server if a server query hasn't yet been issued:
                        if (!that.collection.fetched) {
                            that.collection.fetch({reset: true, success: function () {
                                that.collection.fetched = true;
                            }});
                        } else {
                            that.renderWithHelpers();
                        }
                    });
            },

            renderWithHelpers: function () {
                if (this.client_query) {
                    this.collection.applyFilter(this.client_query);
                } else {
                    this.collection.clearFilter();
                }
                this.templateHelpers = {
                    next: this.collection.next,
                    previous: this.collection.previous,
                    count: this.collection.count
                };
                _.extend(this.templateHelpers, this.extras);
                this.collection.sort();
                this.render();
            },

            newPage: function (e) {
                var page_num = $(e.target).attr('page-num'),
                    that = this;
                this.collection.fetch({
                    data: $.param({ page: page_num }),
                    success: function () {
                        that.renderWithHelpers();
                    }
                });
                e.preventDefault();
            },

            onDestroy: function () {
                this.undelegateEvents();
                $(this.el).empty();
                //console.log("destroyed");
            }

        });

        return RecordList;
    });