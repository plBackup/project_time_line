/**
 * Created by whobird on 17/4/24.
 */
define(["angular","zrender/zrender","./app.controllers","../graph/render_project","../graph/render_nodes","../graph/render_eagle"],function(angular,zrender,controllers,projectRender,nodesRender,eagleRender){

    controllers.controller("dataCtrl",["$rootScope","$scope","$http",function($rootScope,$scope,$http){

        var self=this;
        self.name="data";
        self.pid=null;
        self.nodes=null;
        self.project=null;
        self.nodesFilter=null;

        function _getNodes(nodesFilter){

            $http.get("../data/sdk!node.json",{cache:false}).then(function (res) {
                //todo：根据status做判断
                var data=res.data.data;
                self.pid=data.planId;
                self.nodes= data.nodes;

                $rootScope.$broadcast("render_nodes",{});
            });

        };

        $scope.$on("menu_filter",function(event,data){
            console.log("menu data--------");
            self.nodesFilter=data;
            _getNodes(data);
        });

        function _render(nodes){
            console.log("self pid========"+self.pid);
            console.log(nodes);
            var main_top=88;
            var main_bottom=50;
            var wrapperHeight=document.documentElement.clientHeight- main_top-main_bottom;
            $(".canvas-wrapper").css("height",wrapperHeight+"px");
            projectRender.init(nodes);
            //todo:因为后面实例均需要zr实例，但在projectRender里需要做很多前期计算才能渲染，所以把zr实例放到projectRender里，
            //通过localStorage传递zr id,来传递zr；
            var zr = zrender.getInstance(localStorage.zr);
            nodesRender.init(zr,nodes);
           eagleRender.init(zr);

        };
        $scope.$on("render_nodes",function(event,data){
            _render(self.nodes);
        });
    }]);
    //return controllers;
});