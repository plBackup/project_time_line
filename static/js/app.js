/**
 * Created by whobird on 17/4/21.
 */
define(["angular","uiRouter"],function(angular){
    var app=angular.module("app",["ui.router"]).controller("mainCtrl",["$rootScope","$scope",function($rootScope,$scope){
        var self=this;

        self.name="test"
    }]);
    return app;
});
