/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("rightCtrl",["$rootScope","$scope","$http","$timeout",function($rootScope,$scope,$http,$timeout){

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
            self.statusOpt=null;

            self.isReply=false;
            self.isShare=false;
            self.shareMembers={};

        self.planCompleteDate='';
        self.dateDirectiveName="complete_date";
        self.setCompleteDate=function(dateObj){
            var date=dateObj.date;
            self.planCompleteDate=date;
        };


            self.close=function(){
                _panel_hide();
            };

            self.uploadFile=function($event){

            };

        self.lauchNetCom=function($event){
            $event.preventDefault();
            var nodeId=self.nodeInfo.nodeId;
            //发起网批
            if(self.statusOpt=="done"||self.statusOpt=="needdelay"){
                if(self.statusOpt=="done"){
                    var type=1;
                }else if(self.statusOpt=="needdelay"){
                    var type=2;
                }
                var search="?nodeId="+nodeId+"&type="+type;

                $http.get($rootScope.plink+'/sdk!startRes.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                    if(res.data.code==200){
                        /* $("#charger-alert-wrapper").find(".alert-success").fadeIn();
                         $timeout(function(){
                         $("#charger-alert-wrapper").find(".alert-success").fadeOut();
                         },2500);*/
                        alert("发起网批成功！");
                    }else{
                        alert("发起网批不成功，请稍后再试！");
                    }
                },function(err){
                    alert("发起网批不成功，请稍后再试！");
                });
            }
        };
            self.setFinishOnTime=function($event){

               /* $event.preventDefault();*/
                if(self.statusOpt=="done"){
                    self.formData.finishOnTime=3;
                    self.formData.operationRecord=1;

                }else if(self.statusOpt=="complete"){
                    self.formData.finishOnTime=3;
                    self.formData.operationRecord=2;
                }else if(self.statusOpt=="needdelay"||self.statusOpt=="delay"){
                    self.formData.finishOnTime=2;
                    self.formData.operationRecord=3;
                }

            }
            self.chargerCommit=function($event){
                $event.preventDefault();
                var nodeId=self.nodeInfo.nodeId;
                //责任人提交
                //?nodeId=&finishOnTime=(2|3)&delayCompleteDate=(finishOnTime==2必填)&delayReason=(finishOnTime==2必填)&influenceMainNode=(finishOnTime==2必填)
                 if(typeof self.statusOpt=="undefined"||self.statusOpt==''||self.statusOpt==null){
                     alert("必须勾选已完成、预计按期完成、预计延期完成其中一个!")
                     return;
                 }

                 if(self.formData.finishOnTime==2){
                    if(typeof self.planCompleteDate=='undefined'||self.planCompleteDate==''||typeof self.formData.delayReason=='undefined'||self.formData.delayReason==''||typeof self.formData.influenceMainNode=='undefined'||self.formData.influenceMainNode==''){
                        alert("请完整填入责任人操作表单数据！");
                        return;
                    }
                 }
                 if(self.statusOpt=='done'){
                     //发起网批
                     var confirm=window.confirm("确认发起网批？");
                     if(confirm){
                         var type=1;
                         var search="?nodeId="+nodeId+"&type="+type;

                         $http.get($rootScope.plink+'/sdk!startRes.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                             if(res.data.code==200){
                                 /* $("#charger-alert-wrapper").find(".alert-success").fadeIn();
                                  $timeout(function(){
                                  $("#charger-alert-wrapper").find(".alert-success").fadeOut();
                                  },2500);*/
                                 alert("发起网批成功！");
                                 //todo:这里成功后，应该切换至网批不可操作状态。
                             }else{
                                 alert("发起网批不成功，请稍后再试！");
                             }
                         },function(err){
                             alert("发起网批不成功，请稍后再试！");
                         });

                     }

                 }
                 if(typeof self.formData.finishOnTime!=="undefined"&&self.formData.finishOnTime!=""){
                     var feedbackSearch="?nodeId="+nodeId+"&finishOnTime="+self.formData.finishOnTime+"&delayCompleteDate="+self.planCompleteDate+"&delayReason="+self.formData.delayReason+"&influenceMainNode="+self.formData.influenceMainNode;
                     $http.get($rootScope.plink+'/sdk!feedback.action'+feedbackSearch, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                         if(res.data.code==200){
                             $("#charger-alert-wrapper").find(".alert-success").fadeIn();
                             //todo:check 提交成功后，应该进入只有已完成的状态。。
                             _loadNodeData();
                             $timeout(function(){
                                 $("#charger-alert-wrapper").find(".alert-success").fadeOut();
                             },2500);
                         }else{
                             $("#charger-alert-wrapper").find(".alert-danger").fadeIn();
                             $timeout(function(){
                                 $(".alert-wrapper").find(".alert-danger").fadeOut();
                             },2500);
                         }

                     },function(err){
                         $("#charger-alert-wrapper").find(".alert-danger").fadeIn();
                         $timeout(function(){
                             $("#charger-alert-wrapper").find(".alert-danger").fadeOut();
                         },2500);
                     });
                 }



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
                var nodeId=self.nodeInfo.nodeId;
                var content=self.message;

                if(content==""){
                    alert("消息不能为空！");
                    return;
                }
                if(self.isReply){
                    var actionCd=1003;
                    var userCds=self.replyMessager;

                }else{
                    var actionCd=1001;
                    var userCds=""
                }

                var search="?action="+actionCd+"&nodeId="+nodeId+"&content="+content+"&userCds="+userCds;

                $http.get($rootScope.plink+'/sdk!comment.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                    if(res.data.code==200){
                        $("#message-alert-wrapper").find(".alert-success").fadeIn();
                        _loadNodeData();
                        $timeout(function(){
                            $("#message-alert-wrapper").find(".alert-success").fadeOut();
                        },2500);
                    }else{
                        $("#message-alert-wrapper").find(".alert-danger").fadeIn();
                        $timeout(function(){
                            $(".alert-wrapper").find(".alert-danger").fadeOut();
                        },2500);
                    }

                },function(err){
                    $(".alert-wrapper").find(".alert-danger").fadeIn();
                    $timeout(function(){
                        $(".alert-wrapper").find(".alert-danger").fadeOut();
                    },2500);
                });

            };
            self.shareMessage=function($event){
                $event.preventDefault();
                $rootScope.$broadcast("shareMessage");


            };
            $scope.$on("shareSelect",function(e,data){
                console.log(data);
                self.isReply=false;
                self.replyMessager=null;
                self.isShare=true;
                self.shareMembers=data;
            });
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
            self.reply=function($event,messageCreator){
                $event.preventDefault();
                self.isShare=false;
                self.shareMembers={};
                self.isReply=true;
                self.replyMessager=messageCreator;
                $("#message-textarea").focus();
            };
            self.resetReply=function($event){
                $event.preventDefault();
                self.isReply=false;
                self.replyMessager=null;
                //self.replyMessager=null;

            };
            function _getPropertyCount(o){
                var n, count = 0;
                for(n in o){
                    if(o.hasOwnProperty(n)){
                        count++;
                    }
                }
                return count;
            }
            self.popShareMember=function($event,uid){
                $event.preventDefault();
                delete self.shareMembers[uid];
                if(_getPropertyCount(self.shareMembers)==0){
                    self.isShare=false;
                }
            };
           /* self.deleteAttach=function($event,attach){

            }*/
           function _loadNodeData(){
               $rootScope.loading_show();
               ///plan6/sdk!detail.action?nodeId=402834e53c6c48ab013c7afb7f8827ab
               var search="?nodeId="+self.nodeInfo.nodeId;
               $http.get($rootScope.plink+"/sdk!detail.action"+search,{cache:false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function successCallback(res) {
                   //todo：根据status做判断
                   var data=res.data.data;
                   self.formData=angular.copy(data);

                   self.chargerInfo.delayReason=angular.copy(self.formData.delayReason);
                   self.chargerInfo.influenceMainNode=angular.copy(self.formData.influenceMainNode);
                   self.chargerInfo.finishOnTime=angular.copy(self.formData.finishOnTime);

                   if(self.formData.operationRecord==3){
                       self.statusOpt="needdelay";

                   }
                   if(self.formData.finishOnTime==2){
                       self.statusOpt="delay";

                   }

                   $rootScope.loading_hide();
                   _panel_show();
               }),function errorCallback(res){

                   $rootScope.loading_hide();
                   alert("网络错误，请稍后再试");

               }
           }
            $scope.$on("showDetail",function(e,data){
                //get node data
                self.nodeInfo=angular.copy(data);
                self.planCompleteDate=self.nodeInfo.delayCompleteDate;

                _loadNodeData();
            });

            function _panel_show(){
                $("body").addClass("open-panel");
            }
            function _panel_hide(){

                $("body").removeClass("open-panel");
            }

    }]);

    });