({
    baseUrl: './static',
    out: "main-built.js",
    name: "js/main",
    //fileExclusionRegExp: /^(r|build)\.js$/,
    optimizeCss: 'standard',
    removeCombined: false,
    paths: {
        jquery:"dist/js/jquery",
        "jquery.bootstrap": "dist/js/bootstrap.min",
        "jquery.datetimepicker": "dist/js/bootstrap-datetimepicker",
        "jquery.datetimepicker.zh": "dist/js/locales/bootstrap-datetimepicker.zh-CN",
        "angular":"dist/js/angular.min",
        "angularFileUpload":"dist/js/angular-file-upload.min",
        "uiRouter":"dist/js/angular-ui-router",
        zrender: 'dist/js/zrender',
        domReady:"dist/js/domReady",
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        },
        "jquery.datetimepicker":{
            deps: ["jquery"]
        },
        "jquery.datetimepicker.zh":{
            deps: ["jquery","jquery.datetimepicker"]
        },
        'angular':{
            exports:'angular'
        },

        "angular-animate":{
            deps:['angular'],
            exports:"angular-animate",
        },
        'uiRouter':{
            deps:['angular'],
            exports: 'uiRouter'
        }
    },
})