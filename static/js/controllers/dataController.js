/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers"],function(angular,controllers){
    console.log("main ctrl-==================")
    controllers.controller("dataCtrl",["$rootScope","$scope",function($rootScope,$scope){
        console.log("main ctrl-----")
        var self=this;
        self.name="data"
    }]);
    //return controllers;
});