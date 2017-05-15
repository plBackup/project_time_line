/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("modalCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.domain=$rootScope.domain;

            $scope.$on("shareMessage",function(e,data){
                _modal_show();
            });

            function _modal_show(){
                $("#shareModal").modal("show");
            }
            function _modal_hide(){
                $("#shareModal").modal("hide");
            }

    }]);
});