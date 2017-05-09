/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers"],function(angular,controllers){

    controllers.controller("menuCtrl",["$rootScope","$scope","$location","menuData","dataMenuService",function($rootScope,$scope,$location,menuData,dataMenuService){

        var self=this;
        self.name="menu";
        console.log("menudata");
        console.log(menuData);
        self.data=angular.copy(menuData.data);
        self.menuFilter={
            project:undefined,
            level:undefined,
            status:undefined,
            plan:undefined,
            node:undefined
        };
        self.projects=angular.copy(self.data.projects);
        self.levels=angular.copy(self.data.levels);
        self.status=angular.copy(self.data.status);
        self.plans=angular.copy(self.data.plans);


        /*func*/
        self.setModel=function(type,menu){
            self.menuFilter[type]=menu;
        };
        self.setProject=function(project){
            /**/
            self.setModel("project",project);
            var projectCd=project.id;
            console.log("projectCd===="+projectCd)
            $location.path("/main/"+projectCd);
        };

        self.setPlan=function(plan){
            /**/
            self.setModel("plan",plan);
            var planId=plan.id;

            if(typeof self.menuFilter.project !=="undefined"){
                var projectCd=self.menuFilter.project.id;
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
                $rootScope.$broadcast("menu_filter",self.menuFilter);
            }

        };

        function _init(){
           var pid=$rootScope.pid;
            console.log("-----------init");
            console.log(pid);
            var curProject=undefined;
            $.each(self.projects,function(i,e){
                if(e.id==pid){
                    curProject=e;
                }
            });
            console.log(curProject);
            self.setModel("project",curProject);

            var plan=$rootScope.plan;

            console.log("plane-----------------------");
            if(typeof plan !=="undefined"){
               var curPlan=undefined;
               $.each(self.plans,function(i,e){
                   if(e.id==plan){
                       curPlan=e;
                   }
               });
               self.setModel("plan",curPlan);
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