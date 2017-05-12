/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("setRightCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.domain=$rootScope.domain;
            /*nodeInfo为事件带过来的节点对象*/
            self.nodeInfo={};
            /*form data 为http请求数据*/
            self.formData={};
            //self.message留言
            self.message="";
            //temp 纪录之前的责任人操作数据
            self.chargerInfo={};
            //完成状态的选择
            self.statusOpt=''

            self.close=function(){
                _panel_hide();
            };

            self.uploadFile=function($event){

            };

            self.chargerCommit=function($event){
                $event.preventDefault();
            };
            self.resetCommit=function($event){
                $event.preventDefault();
                $scope.$apply(function(){
                    self.formData.delayReason=self.chargerInfo.delayReason;
                    self.formData.influenceMainNode=self.chargerInfo.influenceMainNode;
                    self.formData.delayReason=self.chargerInfo.delayReason;
                });
            };

            self.sendMessage=function($event){
                $event.preventDefault();
            };

            self.canReply=function(shareds){
                $.each(shareds,function(i,e){
                    if(self.curUser==e.sharedUserCd){
                        return true;
                    }
                });

                return false;
            };

            self.toDateStr=function(messageDateObj){
                var d=new Date(messageDateObj.time);
                return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+"  "+messageDateObj.hours+":"+messageDateObj.minutes+":"+messageDateObj.seconds;
            };
            self.reply=function($event){
                $event.preventDefault();
                $("#message-textarea").focus();
            };
           /* self.deleteAttach=function($event,attach){

            }*/
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
                    self.formData=angular.copy(data);

                    self.chargerInfo.delayReason=angular.copy(self.formData.delayReason);
                    self.chargerInfo.influenceMainNode=angular.copy(self.formData.influenceMainNode);
                    self.chargerInfo.finishOnTime=angular.copy(self.formData.finishOnTime);

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