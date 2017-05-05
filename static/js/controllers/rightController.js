/**
 * Created by whobird on 17/5/5.
 */
define(["angular","zrender/zrender","./app.controllers",],function(angular,zrender,controllers){

    controllers.controller("rightCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){

            var self=this;

            self.close=function(){
                _panel_hide();
            };

            console.log("right contrller====================");
            $scope.on("showDetail",function(e,obj){
                //get node data

                _panel_show();
            });

            function _panel_show(){
                $("body").addClass("open-panel");
            }
            function _panel_hide(){

                $("body").removeClass("open-panel");
            }

    }]);
    });