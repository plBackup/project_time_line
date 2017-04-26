/**
 * Created by whobird on 17/4/24.
 */
define(["angular","./app.controllers","../graph/render_project"],function(angular,controllers,projectRender){

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
            console.log("menu data--------")
            self.nodesFilter=data;
            _getNodes(data);
        });

        function _render(){
            console.log("self pid========"+self.pid);
            console.log(self.nodes);
            projectRender.init();
        };
        $scope.$on("render_nodes",function(event,data){
            _render();
        });
    }]);
    //return controllers;
});