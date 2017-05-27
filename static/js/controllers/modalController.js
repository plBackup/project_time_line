/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("modalCtrl",["$rootScope","$scope","$http","modalData","$timeout",function($rootScope,$scope,$http,modalData,$timeout){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.domain=$rootScope.domain;

            self.modalData=modalData.data;
            self.curDepartment="宝龙集团";
            self.curSearch="";
            self.departmentMemebers=[];
            self.selectedMembers={};
            self.itemSelect=function(id,name){
                var search="?orgCd="+id;
                self.curDepartment=name;
                $http.get($rootScope.plink+'/sdk!quick.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function(res){
                    console.log(res.data);

                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                       /* $scope.$apply(function(){

                        });*/
                        self.departmentMemebers=res.data.data;
                        $.each(self.departmentMemebers,function(i,member){
                            if(self.selectedMembers[member.uiid]){
                                member.checked=true;
                            }
                        });

                    }
                });

            };

            self.toggleSelect=function($event,member){
                $event.preventDefault();

                if(member.checked==true){
                    member.checked=false;
                    delete self.selectedMembers[member.uiid];
                }else{
                    member.checked=true;
                    self.selectedMembers[member.uiid]=member;
                    self.selectedMembers[member.uiid]['checked']=true;
                }
            };

            self.selectedToggleCheck=function($event,uid){
                $event.preventDefault();
                if(self.selectedMembers[uid].checked==true){
                    self.selectedMembers[uid].checked=false;
                }else{
                    self.selectedMembers[uid].checked=true;
                }
            };

            self.selectAll=function(){
                $.each(self.selectedMembers,function(uid,person){
                   person.checked=true;
                });
            };
            self.removeUnchecked=function(){
                $.each(self.selectedMembers,function(uid,person){
                   if( person.checked==false){
                       $.each(self.departmentMemebers,function(i,member){
                          if(member.uiid==uid){
                              member.checked=false;
                          }
                       });
                       delete self.selectedMembers[uid];
                   }
                });
            };
            self.removeAllSelected=function(){
                $.each(self.departmentMemebers,function(i,member){
                    member.checked=false;
                });
                self.selectedMembers={};
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

        /*self.getShares=function(shareds){
                $.each(shareds,function(i,member){

                })
        };*/
        self.setShare=function(){

                if(_getPropertyCount(self.selectedMembers)>0){
                    $rootScope.$broadcast("shareSelect",self.selectedMembers);
                }
                _modal_hide();
            };

            var defer=undefined;
            self.quickSearch=function($event){
                if(typeof defer=="undefined"){
                    defer=setTimeout(function(){
                        var search="?term="+self.curSearch+"&size=10";
                        if(self.curSearch!==''){
                            self.curDepartment="快速搜索";
                            $http.get($rootScope.plink+'/sdk!quick.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function(res){
                                console.log(res.data);
                                self.departmentMemebers=null;
                                self.departmentMemebers=res.data.data;
                                $.each(self.departmentMemebers,function(i,member){
                                    if(self.selectedMembers[member.uiid]){
                                        member.checked=true;
                                    }
                                });
                            });

                            defer=undefined;
                        }else{
                            alert("查询内容不能为空");
                            defer=undefined;
                        }
                    },300);
                }

            };

            $scope.$on("shareMessage",function(e,data){
                _modal_show();
                self.departmentMemebers=null;
                self.curSearch="";
                self.shareMembers=data;
            });

            function _modal_show(){
                $("#shareModal").modal("show");
            }
            function _modal_hide(){
                $("#shareModal").modal("hide");
            }

    }]);
});