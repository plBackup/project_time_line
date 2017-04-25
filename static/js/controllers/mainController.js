/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers",],function(angular,controllers){

    controllers.controller("mainCtrl",["$rootScope","$scope",function($rootScope,$scope){
        var self=this;
        self.name="test";
    }]);
    //return controllers;
});