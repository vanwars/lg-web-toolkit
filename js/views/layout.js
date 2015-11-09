define(["marionette",
        "underscore",
        "jquery"
    ],
    function (Marionette, _, $) {
        'use strict';
        /**
         * A class that handles display and rendering of the
         * data panel and projects menu
         * @class DataPanel
         */
        var Layout = Marionette.LayoutView.extend({
            el: "body",

            events: {
                'click a': 'sayHi'
            },
            regions: {
                leftMenu: ".globalnav",
                helpMenu: ".vcenter",
                mainContent: ".section-content",
                spokesMenu: ".explore_mainnav"
            },
            initialize: function (opts) {
                this.app = opts.app;
                this.opts = opts;
                opts.app.vent.on("adjust-layout", this.resize.bind(this));
            },
            sayHi: function () {
                alert("hi!");
            },

            onShow: function () {
                /*this.projectMenu.show(new ProjectsMenu(this.opts));
                this.projectTags.show(new ProjectTags(this.opts));
                this.itemList.show(new ItemListManager(this.opts));
                this.shareModalWrapper.show(new ShareModal(this.opts));
                this.listenTo(this.shareModalWrapper.currentView, 'load-snapshot', this.loadSnapshot);*/
            }
        });
        return Layout;
    });
