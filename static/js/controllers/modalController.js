/**
 * Created by whobird on 17/5/5.
 */
define(["jquery","angular","zrender/zrender","./app.controllers",],function($,angular,zrender,controllers){

    controllers.controller("modalCtrl",["$rootScope","$scope","$http","modalData",function($rootScope,$scope,$http,modalData){

            var self=this;
            self.baseLink=$rootScope.plink;
            self.domain=$rootScope.domain;
            console.log("modal data======================");
            console.log(modalData);
            self.modalData=modalData.data;

            self.departmentMemebers=[];
            self.selectedMembers={};
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
                console.log(member);
                console.log(member.uiid);
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
                console.log(uid);
                console.log(self.selectedMembers[uid])
                console.log(self.selectedMembers[uid].checked)
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