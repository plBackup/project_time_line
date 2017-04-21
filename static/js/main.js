/**
 * Created by whobird on 17/4/6.
 */
console.log("require==========");
requirejs.config({
    //baseUrl: 'static/dist',
    paths: {
        jquery:"../dist/js/jquery",
        "jquery.bootstrap": "../dist/js/bootstrap.min",
        "angular":"../dist/js/angular.min",
        "angular-route":"../dist/js/angular-ui-router",
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
    'angular',
    'angular-route',
    'jquery',
    'app',
    //'router'
],function(require,angular){
    'use strict';
   /* require(['domReady!'],function(document){
        angular.bootstrap(document,['webapp']);
    });*/
    console.log("......");


});
