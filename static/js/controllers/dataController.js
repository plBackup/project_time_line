/**
 * Created by whobird on 17/4/24.
 */
define(["angular","zrender/zrender","./app.controllers","../graph/graph","../graph/render_project","../graph/render_nodes","../graph/render_project_eagle",'../graph/render_nodes_eagle',"../graph/render_eagle"],function(angular,zrender,controllers,graph,projectRender,nodesRender,projectRenderEagle,nodeRenderEagle,eagleRender){

    controllers.controller("dataCtrl",["$rootScope","$scope","$http","dataNodeService","nodeData","$timeout",function($rootScope,$scope,$http,dataMenuService,nodeData,$timeout){

        var self=this;
        var zr;
        self.curSelectNode={
            nodeId:"",
            name:"",
            chargeOrgName:"",
            startDate:"",
            endDate:"",
            status:"",
            statusText:"",
            delayOffset:"-",

            expireStatus:"", // 过期状态
            resStatus:"",// 网批状态
            confirmStatus:"",// 确认状态
            isWarning:false,
            level:"",
            plan:$rootScope.plan.name,

            centerManagerCd: "",
            centerManagerName: "",
            departmentHeadCd: "",
            departmentHeadName: "",
            chargerCd: "",
            chargerName: "",
        };

        self.name="data";
        self.planId=null;
        self.nodes=null;
        self.project=null;
        self.nodesFilter=null;
        self.baseLink=$rootScope.plink;
        function _getNodes(nodesFilter){
            //var search="?planId="+plan+"&level=all&status=all&all=1";
            /*self.menuFilter={
                project:undefined,
                level:undefined,
                status:undefined,
                plan:undefined,
                node:undefined,
                all:0
            };*/

            var level= typeof nodesFilter.level==="undefined"?"all":nodesFilter.level;
            var status= typeof nodesFilter.status==="undefined"?"all":nodesFilter.status;
            //var status= typeof nodesFilter.all==="undefined"?"0":nodesFilter.all;
            var search="?planId="+nodesFilter.plan.id+"&level="+level+"&status="+status+"&all="+nodesFilter.all;

            $rootScope.loading_show();
            $http.get($rootScope.plink+"/sdk!node.action"+search,{cache:false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function successCallback(res) {
                //todo：根据status做判断
                var data=res.data.data;
                self.planId=data.planId;
                self.nodes= data.nodes;
                $rootScope.$broadcast("render_nodes",{});
            }),function errorCallback(res){

                $rootScope.loading_hide();
                alert("网络错误，请稍后再试");

            }

        };

        $scope.$on("menu_filter",function(event,data){
            self.nodesFilter=data;

            _getNodes(data);
        });

        $scope.$on("node_filter",function(event,data){
            self.nodesFilter=data;
            $rootScope.loading_show();
            _focusNode(data);
        });


        self.closeNodeInfo=function(){
            $(".node-info").removeClass("active").hide();
        };

        self.showNodeDetail=function(){
           $rootScope.$broadcast("showDetail",self.curSelectNode);
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
        function _filterNodes(searchStr){
                var nodesTemp=[];
                $.each(self.nodes, function (i, e) {
                    //node.style.opacity=0.3;
                    if(e['sequence']==searchStr||e.name.match(searchStr)){
                        nodesTemp.push(e);
                    }
                });
            return nodesTemp;
        }

        function _focusNode(data){

            var searchStr=data.node;
            zr = zrender.getInstance(localStorage.zr);
            zrfake = zrender.getInstance(localStorage.zrfake);
            //清除页面上的时间线和弹出层,利用页面事件的方式处理
            //因为curdateNodes用于处理点击节点时突出显示的当前时间线跨模块处理会比较冗余
            var $nodeInfo=$(".node-info");
            $nodeInfo.removeClass("active").fadeOut(300);
            $(".canvas-wrapper").trigger("removeDateLine");

            //如果查询节点为空，恢复所有节点显示
            if(typeof searchStr==="undefined" || searchStr===""){

                $.each(self.nodes, function (i, e) {
                    //node.style.opacity=0.3;

                    var node = zr.storage.get("node_"+e['sequence']+"_group");
                       if(node){
                           node.eachChild(function (e) {
                               e.style.opacity = 1;
                               e.ignore=false;
                               e.z=0;
                           });
                       }else{
                           console.log(i);
                           console.log(e['name'])
                       }

                    var fakenode = zrfake.storage.get("node_"+e['sequence']+"_group");
                    if(fakenode){
                        fakenode.eachChild(function (e) {
                            e.style.opacity = 1;
                            e.ignore=false;
                            e.z=0;
                        });
                    }else{
                        console.log(i);
                        console.log(e['name'])
                    }
                });

                var imageData=zrfake.toDataURL();

                _renderEagleBg(imageData,zrfake);

                requestAnimationFrame(function() {

                    var bgData=$("#fake-img").attr("src");
                    zr.modShape("eagle_bg",{
                        style:{
                            image: bgData,
                        }
                    });
                });

            }else{
                var zrWidth=parseInt($(".canvas-wrapper").css("width"));
                var zrHeight=parseInt($(".canvas-wrapper").css("height"));

                var nodesArr=_filterNodes(searchStr);

                if(nodesArr.length==0){
                    alert("未找到相应节点");
                    $rootScope.loading_hide();
                    return;
                }

                $.each(self.nodes, function (i, e) {
                    //node.style.opacity=0.3;
                    var node = zr.storage.get("node_"+e['sequence']+"_group");
                    var fakenode=zrfake.storage.get("node_"+e['sequence']+"_group");
                    if(node){
                        node.eachChild(function (e) {
                            e.style.opacity = 0;
                            e.ignore=true;
                            e.z=0;
                        });
                    }
                    if(fakenode){
                        fakenode.eachChild(function (e) {
                            e.style.opacity = 0;
                            e.ignore=true;
                            e.z=0;
                        });
                    }
                });
                $.each(nodesArr,function(i,e){
                    var node = zr.storage.get("node_"+e['sequence']+"_group");
                    var fakenode=zrfake.storage.get("node_"+e['sequence']+"_group");
                    if(node){
                        node.eachChild(function (e) {
                            e.style.opacity = 1;
                            e.ignore=false;
                            e.z=9;
                        });
                    }
                    if(fakenode){
                        fakenode.eachChild(function (e) {
                            e.style.opacity = 1;
                            e.ignore=true;
                            e.z=9;
                        });
                    }

                });
                var nodeFirst=zr.storage.get("node_"+nodesArr[0]['sequence']+"_group");
                if(nodeFirst._x>(zrWidth/2)){
                    var leftOffset=nodeFirst._x-(zrWidth/2);
                }else{
                    var leftOffset=0;
                }
                if(nodeFirst._y>(zrHeight/2)){
                    var topOffset=nodeFirst._y-(zrHeight/2);
                }else{
                    var topOffset=0;
                }

                //x轴，y轴同步偏移
                $("#date-index").css('left',(-1)*leftOffset);
                $("#project-index").css('top',(-1)*topOffset);

                zr.modLayer('0',{position:[(-1)*leftOffset,(-1)*topOffset]});

                var imageData=zrfake.toDataURL();
                _renderEagleBg(imageData,zrfake);

                requestAnimationFrame(function() {

                    var bgData=$("#fake-img").attr("src");
                    zr.modShape("eagle_bg",{
                        style:{
                            image: bgData,
                        }

                    });
                });


                eagleRender.setPosition(zr,leftOffset,topOffset);

            }

            zr.render();
            $rootScope.loading_hide();
        }

        function _renderEagleBg(imageData,zrfake){

            var $image=$("#fake-img");
            $image.attr("src",imageData);

            var cWidth=zrfake.getWidth();
            var cHeight=zrfake.getHeight();

            var canvas = document.createElement("canvas");
            canvas.width=500;
            canvas.height=(cHeight/cWidth)*(canvas.width);
            console.log(zrfake.getWidth());
            console.log(canvas.height);


            var ctx = canvas.getContext('2d');


            requestAnimationFrame(function() {
                ctx.drawImage($image.get(0),
                    0,//sourceX,
                    0,//sourceY,
                    cWidth,//sourceWidth,
                    cHeight,//sourceHeight,
                    0,//destX,
                    0,//destY,
                    canvas.width,//destWidth,
                    canvas.height//destHeight
                );

                //--获取base64字符串及canvas对象传给success函数。
                var base64str = canvas.toDataURL("image/png");
                $image.attr("src", base64str);
            });
        }
        function _render(nodes,phase){

            var main_top=60;
            var main_bottom=0;
            var wrapperHeight=document.documentElement.clientHeight- main_top-main_bottom;
            $(".canvas-wrapper").css("height",wrapperHeight+"px");

            var typeList=$rootScope.typeList;
            projectRender.init(nodes,typeList,phase,"main");

            projectRenderEagle.init(nodes,typeList,phase,"fake");
            var zrfake = zrender.getInstance(localStorage.zrfake);
            var imageData=zrfake.toDataURL();
            _renderEagleBg(imageData,zrfake);

            //todo:因为后面实例均需要zr实例，但在projectRender里需要做很多前期计算才能渲染，所以把zr实例放到projectRender里，
            //通过localStorage传递zr id,来传递zr；
            zr = zrender.getInstance(localStorage.zr);
            //nodesRender 用到ProjectRender数据，现在改到projectRender里处理
            //nodesRender.init(zr,nodes);

                requestAnimationFrame(function(){
                    eagleRender.init(zr);
                });

            /*事件处理要先清除，再重新绑定*/
            var $nodeInfo=$(".node-info");
            $nodeInfo.removeClass("active").fadeOut(300);

            $('body').off().on("nodeclick",function(e,params){

                var $nodeInfo=$(".node-info");
                /*todo:判断 nodeinfo 当前对应的 node id,
                * 如果nodeid不等，则销毁当前node-info数据，在新位置重新显示
                * 如果nodeid相等，则toggle显示node-info(考虑到鹰眼拖动时要隐藏node-info)
                *
                * 还有一种情况，当非node点击，需要清除当前focus数据， render_nodes.js触发一个zrEvent事件
                * 在zrEvent事件中，清空当前nodeinfo数据，并隐藏；
                * */
              /*  console.log("params==========================================");
                console.log(params);
                console.log("params==========================================");*/

                /*self.curSelectNode={
                    name:"",
                    chargeOrgName:"",
                    startDate:"",
                    endDate:"",
                    status:"",
                    delayOffset:"-",
                    plan:$rootScope.plan.name
                };*/
                $scope.$apply(function(){
                    self.curSelectNode.nodeId=params._nodeId;
                    self.curSelectNode.sequence=params._sequence;
                    self.curSelectNode.name=params._name;
                    self.curSelectNode.chargeOrgName=params._chargeOrgName;
                    self.curSelectNode.startDate=params._start_date;
                    self.curSelectNode.endDate=params._end_date;
                    self.curSelectNode.status=params._status;
                    self.curSelectNode.resNumbers=params._resNumbers;
                    self.curSelectNode.resIds=params._resIds;

                    self.curSelectNode.plan=$rootScope.plan.name;
                    //isWarning来判断责任人操作的显示和状态操作和提示信息
                    self.curSelectNode.isWarning=params._isWarning;
                    self.curSelectNode.expireStatus=params._expireStatus; // 过期状态
                    self.curSelectNode.resStatus=params._resStatus;// 网批状态
                    self.curSelectNode.confirmStatus=params._confirmStatus;// 确认状态
                    self.curSelectNode.level=params._level;

                    self.curSelectNode.centerManagerCd=params._centerManagerCd;
                    self.curSelectNode.centerManagerName=params._centerManagerName;
                    self.curSelectNode.departmentHeadCd=params._departmentHeadCd;
                    self.curSelectNode.departmentHeadName=params._departmentHeadName;
                    self.curSelectNode.chargerCd=params._chargerCd;
                     self.curSelectNode.chargerName=params._chargerName;
                    self.curSelectNode.statusText=params._statusText;
                    /*todo 判断当前节点是不是责任人，决定责任人列表的显示*/
                    self.curSelectNode.isChargeMan= $rootScope.curUser==params._chargerCd;
                    if(typeof params._delayCompleteDate!=="undefined" || params._delayCompleteDate!==""){
                        //params._delayCompleteDate 为毫秒数
                        var delayCompleteDate=new Date(params._delayCompleteDate);
                        var dStr=delayCompleteDate.getFullYear()+"-"+(delayCompleteDate.getMonth()+1)+"-"+delayCompleteDate.getDate();
                        self.delayOffset=graph.getDateOffset(params._end_date,dStr);
                    }else{
                        self.delayOffset="-";
                    }
                });


                var left=params._x+88+parseInt($("#date-index").css("left"));
                var top=params._y+params._y_plus+parseInt($("#project-index").css("top"))-25;

                if($nodeInfo.data("node")===params.id){
                    if($nodeInfo.hasClass("active")){
                        $nodeInfo.removeClass("active").fadeOut(300);
                    }else{
                        $nodeInfo.addClass("active").css({
                            top:top+"px",
                            left:left+"px"
                        }).fadeIn(300);
                    }
                }else{

                    $nodeInfo.removeClass("active").data("node",params.id).hide().css({
                        top:top+"px",
                        left:left+"px"
                    }).addClass("active").fadeIn(300);
                }


            }).on("zrEvent",function(e){
                var $nodeInfo=$(".node-info");
                $nodeInfo.data("node","").removeClass("active").fadeOut(300);
            });

            $rootScope.loading_hide();
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
            _render(self.nodes,self.phase);

        });


        function _init(){
            if(typeof nodeData !=="undefined"){
                self.phase=nodeData.data["phase"];
                self.nodes=nodeData.data["nodes"];

                _clearDom();
                _render(self.nodes,self.phase);
            }
        }

        _init();
    }]);
    //return controllers;
});