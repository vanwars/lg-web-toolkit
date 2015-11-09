define(["underscore",
        "jquery",
        "backbone",
        "marionette",
        "views/base",
        "views/record-list",
        "views/record-detail",
        "views/mapbox",
        "collection",
        "model",
        "functions"
    ],
    function (_, $, Backbone, Marionette, BaseView, RecordListView, RecordDetailView, MapboxView, Collection, Model) {
        "use strict";
        var App = new Marionette.Application();
        _.extend(App, {
            datasets: {},
            routePageMap: {},
            routes: {},
            appRouter: null,
            defaultRegion: '.section-content',

            buildViews: function (pages) {
                var that = this;
                /* Dynamically builds Backbone Views from the config file */
                _.each(pages, function (page) {
                    var View = that.getView(page),
                        v;
                    if (!page.url && page.url != "") {
                        v = new View(page);
                        $(page.region || that.defaultRegion).html(v.el);
                        v.delegateEvents();
                    }
                });
            },

            getView: function (page) {
                switch (page.type) {
                case "list":
                    this.attachDataset(page);
                    return RecordListView.extend(page);
                case "detail":
                    this.attachModelFromDataset(page);
                    return RecordDetailView.extend(page);
                case "mapbox":
                    //dataset optional:
                    if (page.dataset) {
                        this.attachDataset(page);
                    }
                    return MapboxView.extend(page);
                default:
                    return BaseView.extend(page);
                }
            },

            attachDataset: function (page) {
                if (!page.dataset) {
                    alert(page.type + " view must have dataset defined in the config file");
                    return;
                }
                var dataset = this.getDataset(page);
                _.extend(page, dataset);
            },

            attachModelFromDataset: function (page) {
                if (!page.dataset) {
                    alert(page.type + " view must have dataset defined in the config file");
                    return;
                }
                var dataset = this.getDataset(page);
                page.model = dataset.collection.get(page.modelID);
                if (!page.model) { page.model = new Model({ id: page.modelID }); }
                page.model.urlRoot = dataset.api_endpoint;
            },

            getDataset: function (page) {
                var dataset = this.datasets[page.dataset];
                if (!dataset.collection) {
                    dataset.collection = new Collection({
                        api_endpoint: dataset.api_endpoint,
                        page_size: dataset.page_size || 10,
                        comparator: dataset.ordering_field || "id",
                        filter: dataset.filter
                    });
                }
                return dataset;
            },

            buildRoutes: function (pages) {
                var that = this;
                /* Dynamically builds Backbone Routes from the config file */
                _.each(pages, function (page) {
                    page.vent = that.vent;
                    if (!that.routePageMap[page.url]) {
                        that.routePageMap[page.url] = [];
                    }
                    that.routePageMap[page.url].push(page);

                    // Note: more than one page can be loaded per route.
                    // Uses the "routePageMap," which associates each route
                    // with a list of pages:
                    that.routes[page.url] = function (arg1, arg2, arg3) {
                        _.each(that.routePageMap[page.url], function (p) {
                            p.args = [arg1, arg2, arg3];
                            that.loadView(p);
                            that.executeTransition(p);
                        });
                    };
                });
            },

            loadView: function (page) {
                this.processRouteArguments(page);
                // Caches the view by attaching the view object to the page.
                // Not yet sure if this is a good idea:
                if (!page.view || page.type == "detail") {
                    var View = this.getView(page);
                    page.view = new View(page);
                }
                $(page.region || this.defaultRegion).html(page.view.el);
                page.view.delegateEvents();
            },

            processRouteArguments: function (page) {
                if (!page.url) { return; }
                var re = /:(\w+)/g,
                    results,
                    names = [];
                while ((results = re.exec(page.url)) !== null) {
                    names.push(results[1]);
                }
                page.params = _.object(names, page.args);
                page.modelID = page.params.id;
            },

            applyRoutingHacks: function () {
                $('a').click(function () {
                    if ('#/' + Backbone.history.fragment == $(this).attr('href')) {
                        Backbone.history.loadUrl(Backbone.history.fragment);
                    }
                });
            },

            executeTransition: function (page) {
                if (page.transition) {
                    eval(page.transition + "(page)");
                }
            }
        });

        App.addInitializer(function (opts) {
            this.datasets = opts.datasets;
            this.buildViews(opts.pages);
            this.buildRoutes(opts.pages);
            var AppRouter = Backbone.Router.extend({
                routes: this.routes
            });
            this.appRouter = new AppRouter();
            Backbone.history.start();
            this.applyRoutingHacks();
        });
        return App;
    });

