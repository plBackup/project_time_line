/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("modalCtrl",["$rootScope","$scope","$http","modalData",function($rootScope,$scope,$http,modalData){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.domain=$rootScope.domain;
            console.log("modal data======================")
            console.log(modalData);
            self.modalData=modalData.data;

            self.departmentMemebers=[];

            self.itemSelect=function(id){
                 console.log(id);
                var search="?orgCd="+id;
                $http.get($rootScope.plink+'/sdk!quick.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function(res){
                    console.log(res.data);

                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                       /* $scope.$apply(function(){

                        });*/
                        self.departmentMemebers=res.data.data;
                    }
                });

            };

            self.setShare=function(){
                _modal_hide();
            };

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