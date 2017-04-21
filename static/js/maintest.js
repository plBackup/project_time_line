/**
 * Created by whobird on 17/4/6.
 */
requirejs.config({
    //baseUrl: 'static/dist',
    paths: {
        jquery:"../dist/js/jquery",
        "jquery.bootstrap": "../dist/js/bootstrap.min",
        "angular":"../dist/js/angular.min.js",
        "angular-route":"../dist/js/angular-ui-router.js",
        zrender: '../dist/zrender-master/src',

    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        },
        'angular':{
            exports:'angular'
        },
        'angular-route':{
            deps:['angular'],
            exports: 'angular-route'
        }
    },
    urlArgs: "bust=" + (new Date()).getTime() //防止读取缓存，调试用
});

define(['require',
    //'angular',
    //'angular-route',
    'jquery',
    'app',
    //'router'
],function(require,$){
    'use strict';
    console.log("----------")
   /* require(['domReady!'],function(document){
        angular.bootstrap(document,['webapp']);
    });*/
});