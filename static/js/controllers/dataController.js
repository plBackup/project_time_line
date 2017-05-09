/**
 * Created by whobird on 17/4/24.
 */
define(["angular","zrender/zrender","./app.controllers","../graph/render_project","../graph/render_nodes","../graph/render_eagle"],function(angular,zrender,controllers,projectRender,nodesRender,eagleRender){

    controllers.controller("dataCtrl",["$rootScope","$scope","$http","dataNodeService","nodeData","$timeout",function($rootScope,$scope,$http,dataMenuService,nodeData,$timeout){

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

        function _focusNode(nodesFilter){


        }

        $scope.$on("menu_filter",function(event,data){
            console.log("menu data--------");
            self.nodesFilter=data;
            console.log(data);
            _getNodes(data);
        });

        $scope.$on("node_filter",function(event,data){
            console.log("menu data--------");
            self.nodesFilter=data;
            console.log(data);
            _focusNode(data);
        });


        self.closeNodeInfo=function(){
            $(".node-info").removeClass("active").hide();
        };

        self.showNodeDetail=function(){
           $rootScope.$broadcast("showDetail");
        };


        /*
        * todo:这里的这段过滤数据后的显示放到dataController中，
        * 是基于之后做创建项目节点列表页面，有相似逻辑的考虑，
        * 让render_nodes尽量保持通用。
        *
        * 数据过滤后，显示新的nodes，目前实现以下几点：
        *
        *如果第一个node节点的位置大于第一屏的x,y 50%,
        * 显示第一个node节点至第一屏的中间
        * 同时移动鹰眼坐标
        *
        * */
        function _focusNode(nodes){

            zr = zrender.getInstance(localStorage.zr);
            var zrWidth=parseInt($(".canvas-wrapper").css("width"));
            var zrHeight=parseInt($(".canvas-wrapper").css("height"));

            var nodes=zr.storage.get("node_3_group");

            if(nodes._x>(zrWidth/2)){
                var leftOffset=nodes._x-(zrWidth/2);
            }else{
                var leftOffset=0;
            }

            if(nodes._y>(zrHeight/2)){
                var topOffset=nodes._y-(zrHeight/2);
            }else{
                var topOffset=0;
            }
            console.log(leftOffset);
            console.log(topOffset);
            //x轴，y轴同步偏移
            $("#date-index").css('left',(-1)*leftOffset);
            $("#project-index").css('top',(-1)*topOffset);

            zr.modLayer('0',{position:[(-1)*leftOffset,(-1)*topOffset]});

            console.log(self.nodes);

            $.each(self.nodes, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get("node_"+i+"_group");
                console.log(node);
                node.eachChild(function (e) {
                    e.style.opacity = 0;
                    e.ignore=true;
                    e.z=0;
                });
            });

            nodes.eachChild(function (e) {
                e.style.opacity = 1;
                e.ignore=false;
                e.z=9;
            });

            var imageData=zr.toDataURL();
            zr.modShape("eagle_bg",{
                style:{
                    image: imageData,
                }

            });

            eagleRender.setPosition(zr,leftOffset,topOffset);

            zr.render();
        }


        function _render(nodes){

            var main_top=60;
            var main_bottom=0;
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

                var left=params._x+88+parseInt($("#date-index").css("left"));
                var top=params._y+params._y_plus+parseInt($("#project-index").css("top"))-25;

                if($nodeInfo.data("node")===params.id){
                    if($nodeInfo.hasClass("active")){
                        $nodeInfo.removeClass("active").fadeOut();
                    }else{
                        $nodeInfo.addClass("active").css({
                            top:top+"px",
                            left:left+"px"
                        }).fadeIn();
                    }
                }else{

                    $nodeInfo.removeClass("active").data("node",params.id).hide().css({
                        top:top+"px",
                        left:left+"px"
                    }).addClass("active").fadeIn();
                }


            }).on("zrEvent",function(e){
                console.log("******===========zr event=======================********");
                var $nodeInfo=$(".node-info");
                $nodeInfo.data("node","").removeClass("active").fadeOut();
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

        $timeout(function(){
            $rootScope.loading_hide();
        },2000);
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