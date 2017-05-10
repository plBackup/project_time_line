/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers",],function(angular,controllers){

    controllers.controller("mainCtrl",["$rootScope","$scope",function($rootScope,$scope){
        var self=this;
        //self.name="test";

        self.loadingShow=false;

        $rootScope.loading_show=function(){
            console.log("loading show-----------------");
            self.loadingShow=true;
        };
        $rootScope.loading_hide=function(){
            self.loadingShow=false;
        };

        $scope.$on("loadingShow",function(){
           $rootScope.loading_show();
        });
        $scope.$on("loadingHide",function(){
           $rootScope.loading_hide();
        });

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState) {
            $rootScope.loading_show();
        });
        $rootScope.$on('$viewContentLoading',
            function(event, viewConfig){
                $rootScope.loading_show();
            });
        $rootScope.$on('$stateChangeSuccess',
            function(event, toState, toParams, fromState, fromParams){
                $rootScope.loading_hide();
            });
        $scope.$on('$viewContentLoaded',
            function(event){
                $rootScope.loading_hide();
            });

    }]);
    //return controllers;
});