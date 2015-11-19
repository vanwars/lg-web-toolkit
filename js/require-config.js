require.config({
    baseUrl: "js",
    paths: {
        'backbone': 'external/backbone-min',
        'handlebars': 'external/handlebars.min',
        'jquery': '//code.jquery.com/jquery-2.1.4',
        'jquery.bootstrap': '//netdna.bootstrapcdn.com/twitter-bootstrap/2.0.4/js/bootstrap.min',
        'text': 'external/text',
        'marionette': 'external/backbone.marionette',
        'underscore': 'external/underscore-min',
        'mapbox-lib': 'http://api.mapbox.com/mapbox.js/v2.2.3/mapbox'
    },
    shim: {
        'underscore': {
            exports: "_"
        },
        'mapbox-lib': {
            exports: 'L'
        },
        'backbone': {
            deps: [ "jquery", "underscore" ],
            exports: "Backbone"
        },
        'marionette': {
            deps: [ "backbone" ],
            exports: "Marionette"
        },
        'handlebars': {
            exports: "Handlebars"
        },
        'jquery.bootstrap': {
            deps: ['jquery']
        }
    },
    urlArgs: "bust=" + (new Date()).getTime()
});


