/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers"],function(angular,controllers){

    controllers.controller("dataCtrl",["$rootScope","$scope","menuData",function($rootScope,$scope,menuData){

        var self=this;
        self.name="data"

        console.log(menuData);
    }]);
    //return controllers;
});