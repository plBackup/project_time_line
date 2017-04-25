/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers"],function(angular,controllers){

    controllers.controller("menuCtrl",["$rootScope","$scope","menuData",function($rootScope,$scope,menuData){

        var self=this;
        self.name="menu"
        console.log("menudata")
        console.log(menuData);
        self.data=angular.copy(menuData.data);
        self.menuFilter={};
        self.projects=angular.copy(self.data.projects);

    }]);
    //return controllers;
});