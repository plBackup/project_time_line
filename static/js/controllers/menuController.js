/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers"],function(angular,controllers){

    controllers.controller("menuCtrl",["$rootScope","$scope","$location","menuData","dataMenuService",function($rootScope,$scope,$location,menuData,dataMenuService){

        var self=this;
        self.name="menu";

        if(typeof menuData.data.uuid==undefined ||menuData.data.uuid==""){
            location.href=$rootScope.plink;
        }
        $rootScope.curUser=menuData.data.uuid;


        self.data=angular.copy(menuData.data);
        self.menuFilter={
            project:undefined,
            level:undefined,
            status:undefined,
            plan:undefined,
            node:undefined,
            all:1
        };
        self.projects=angular.copy(self.data.projects);
        self.levels=angular.copy(self.data.levels);
        self.status=angular.copy(self.data.status);
        self.plans=angular.copy(self.data.plans);


        /*这里把业态和状态映射 放到全局访问*/
        $rootScope.status=angular.copy(self.data.status);
        console.log($rootScope.status);
        self.typeList=angular.copy(self.data.type);

        /*func*/
        self.setModel=function(type,menu){
            self.menuFilter[type]=menu;
        };
        self.setProject=function(project){
            /**/
            self.setModel("project",project);
            var projectCd=project.projectCd;

            $location.path("/main/"+projectCd);
        };

        self.setPlan=function(plan){
            /**/
            self.setModel("plan",plan);
            var planId=plan.id;

            if(typeof self.menuFilter.project !=="undefined"){
                var projectCd=self.menuFilter.project.projectCd;
                $location.path("/main/"+projectCd+"/"+planId);
            }

        };
        self.isActive=function(menu,model){
            return menu==model;
        };

        self.triggerFilter=function($event){
            $event.preventDefault();

            if(self.menuFilter.node!==undefined && self.menuFilter.node!==""){
                $rootScope.$broadcast("node_filter",self.menuFilter);
            }else{
                //$rootScope.$broadcast("menu_filter",self.menuFilter);
                /*alert("请输入节点名称或节点序列查询");*/
                self.menuFilter.node=undefined;
                $rootScope.$broadcast("node_filter",self.menuFilter);
            }
        };

        self.triggerMenuFilter=function(type,menu,$event){
            //$event.preventDefault();
            self.menuFilter.node=undefined;
            self.setModel(type,menu);
            $rootScope.$broadcast("menu_filter",self.menuFilter);
        };

        function _init(){
           var pid=$rootScope.pid;

            var curProject=undefined;
            $.each(self.projects,function(i,e){
                if(e.projectCd==pid){
                    curProject=e;
                }
            });

            self.setModel("project",curProject);

            var plan=$rootScope.plan;

            if(typeof plan !=="undefined"){
               var curPlan=undefined;
               $.each(self.plans,function(i,e){
                   if(e.id==plan){
                       curPlan=e;
                   }
               });
               self.setModel("plan",curPlan);

                /*todo: render project 时需要typeList数据*/
                $rootScope.typeList=self.typeList;
                /*这里把业态映射 放到全局访问*/
                $rootScope.plan=curPlan;
            }else{

                //如果无计划节点时，激活显示计划节点
                $("#dropdown-plan").dropdown("toggle");
            }
        }

        if($rootScope.pid){
            _init();
        }

    }]);
    //return controllers;
});