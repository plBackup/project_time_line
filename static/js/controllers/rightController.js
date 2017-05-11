/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("rightCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.nodeInfo={};
            self.formData={};
            self.close=function(){
                _panel_hide();
            };

            self.uploadFile=function($event){

            };

            $scope.$on("showDetail",function(e,data){
                //get node data
                console.log(data)
                self.nodeInfo=angular.copy(data);
                $rootScope.loading_show();
                ///plan6/sdk!detail.action?nodeId=402834e53c6c48ab013c7afb7f8827ab
                var search="?nodeId="+data.nodeId;
                $http.get($rootScope.plink+"/sdk!detail.action"+search,{cache:false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function successCallback(res) {
                    //todo：根据status做判断
                    var data=res.data.data;
                    console.log(data)
                    $rootScope.loading_hide();
                    _panel_show();
                }),function errorCallback(res){

                    $rootScope.loading_hide();
                    alert("网络错误，请稍后再试");

                }
            });

            function _panel_show(){
                $("body").addClass("open-panel");
            }
            function _panel_hide(){

                $("body").removeClass("open-panel");
            }

    }]);
    });