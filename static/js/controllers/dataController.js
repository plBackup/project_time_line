/**
 * Created by whobird on 17/4/24.
 */
define(["angular","zrender/zrender","./app.controllers","../graph/render_project","../graph/render_nodes","../graph/render_eagle"],function(angular,zrender,controllers,projectRender,nodesRender,eagleRender){

    controllers.controller("dataCtrl",["$rootScope","$scope","$http","dataNodeService","nodeData",function($rootScope,$scope,$http,dataMenuService,nodeData){

        var self=this;
        var zr;
        self.name="data";
        self.planId=null;
        self.nodes=null;
        self.project=null;
        self.nodesFilter=null;

        function _getNodes(nodesFilter){

            $http.get("../data/sdk!node.json",{cache:false}).then(function (res) {
                //todo：根据status做判断
                var data=res.data.data;
                self.planId=data.planId;
                self.nodes= data.nodes;
                $rootScope.$broadcast("render_nodes",{});
            });

        };

        $scope.$on("menu_filter",function(event,data){
            console.log("menu data--------");
            self.nodesFilter=data;
            console.log(data);
            _getNodes(data);
        });

        function _render(nodes){

            var main_top=88;
            var main_bottom=50;
            var wrapperHeight=document.documentElement.clientHeight- main_top-main_bottom;
            $(".canvas-wrapper").css("height",wrapperHeight+"px");
            projectRender.init(nodes);
            //todo:因为后面实例均需要zr实例，但在projectRender里需要做很多前期计算才能渲染，所以把zr实例放到projectRender里，
            //通过localStorage传递zr id,来传递zr；
            zr = zrender.getInstance(localStorage.zr);
            //nodesRender 用到ProjectRender数据，现在改到projectRender里处理
            //nodesRender.init(zr,nodes);
            eagleRender.init(zr);


            /*事件处理要先清除，再重新绑定*/
            $('body').off().on("nodeclick",function(e,params){
                console.log("node click---------------================");
                console.log(params);
                var $nodeInfo=$(".node-info");
                /*todo:判断 nodeinfo 当前对应的 node id,
                * 如果nodeid不等，则销毁当前node-info数据，在新位置重新显示
                * 如果nodeid相等，则toggle显示node-info(考虑到鹰眼拖动时要隐藏node-info)
                *
                * 还有一种情况，当非node点击，需要清除当前focus数据， render_nodes.js触发一个zrEvent事件
                * 在zrEvent事件中，清空当前nodeinfo数据，并隐藏；
                * */
               /* if($nodeInfo.data("node")===params.){
                    if($nodeInfo.hasClass("active")){
                        $nodeInfo.removeClass("active").fadeOut();
                    }else{
                        $nodeInfo.addClass("active").fadeIn();
                    }
                }else{
                    $nodeInfo.removeClass("a")
                }*/


            }).on("zrEvent",function(e){
                console.log("******===========zr event=======================********");
            });


        };

        /*var defer=undefined;
        $(window).on("resize",function(){
            clearTimeout(defer);
            console.log("resize====================")
            defer=undefined;
            if(!defer){
                defer=setTimeout(function(){
                    console.log("rerender====================")
                    zr.dispose();
                    _render(nodes);

                },200);
            }
        });*/

        function _clearDom(){
            if(typeof zr !=="undefined"){
                zr.dispose();
                zr=undefined;
            }
            $("#date-index").empty().css("left",0);
            $("#project-index").empty().css("top",0);
        };

        $scope.$on("render_nodes",function(event,data){
            _clearDom();
            _render(self.nodes);
        });




        function _init(){
            if(typeof nodeData !=="undefined"){
                self.nodes=nodeData.data["nodes"];
                _clearDom();
                _render(self.nodes);
            }
        }

        _init();
    }]);
    //return controllers;
});