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
        self.menuFilter={
            project:undefined,
            level:undefined,
            status:undefined,
            plan:undefined,
            node:undefined
        };
        self.projects=angular.copy(self.data.projects);
        self.levels=angular.copy(self.data.levels);
        self.status=angular.copy(self.data.status);
        self.plans=angular.copy(self.data.plans);


        /*func*/
        self.setModel=function(type,menu){
            self.menuFilter[type]=menu;
        };

        self.isActive=function(menu,model){
            return menu==model;
        };

        self.triggerFilter=function($event){
            $event.preventDefault();
            $rootScope.$broadcast("menu_filter",self.menuFilter);
        };



    }]);
    //return controllers;
});