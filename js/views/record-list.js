define(["jquery",
        "marionette",
        "collection"
    ],
    function ($, Marionette, Collection) {
        'use strict';
        /**
         * Controls a dictionary of overlayGroups
         * @class OverlayManager
         */
        //Todo: can this be a Marionette CollectionManager, since it's managing Layer models?
        var RecordList = Marionette.CompositeView.extend({

            events: {
                'click .page': 'newPage'
            },

            childViewContainer: '.data-container',

            initialize: function (opts) {
                this.collection = opts.collection;
                this.listenTo(this.collection, 'reset', this.renderWithHelpers);
                //this.listenTo(this.collection, 'change', this.renderWithHelpers);
                this.loadTemplates(opts);
            },

            loadTemplates: function (opts) {
                var that = this;
                require([
                    "handlebars",
                    "text!../templates/" + opts.collection_template_path,
                    "text!../templates/" + opts.item_template_path,
                    "handlebars-helpers"],

                    function (Handlebars, CollectionTemplatePath, ItemTemplatePath) {
                        that.childView = Marionette.ItemView.extend({
                            /*modelEvents: {
                                "change": "render"
                            },*/
                            template: Handlebars.compile(ItemTemplatePath)
                        });
                        that.template = Handlebars.compile(CollectionTemplatePath);
                        that.collection.fetch({reset: true});
                    });
            },

            renderWithHelpers: function () {
                this.templateHelpers = {
                    next: this.collection.next,
                    previous: this.collection.previous,
                    count: this.collection.count
                };
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
            }

        });

        return RecordList;
    });