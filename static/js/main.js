/**
 * Created by whobird on 17/4/6.
 */
console.log("require==========");
requirejs.config({
    baseUrl: '../static',
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
    urlArgs: "bust=" + (new Date()).getTime() //防止读取缓存，调试用
});

define(['require',
    'jquery',

    'angular',
    'uiRouter',
    "jquery.bootstrap",
    "jquery.datetimepicker",
    "jquery.datetimepicker.zh",
    //'angular-animate',
    'js/app',
    'js/route',
    //"js/controllers/app.controllers",

],function(require,$,angular){
    'use strict';
    require(['domReady!'],function(document){

       angular.bootstrap(document,["app"]);
    });

});
