/**
 * Created by whobird on 17/4/26.
 */
/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group",'zrender/tool/area'],
    function($,zrender,graph){

        /*
        * todo:这里有一个思路是写成controller或者directive形式，
        * 目前的操作比较简单，直接用事件代理的方式处理更简洁
        *
        * */

        var nodesRenderEagle={};
        var color = require('zrender/tool/color');
        var RectangleShape = require('zrender/shape/Rectangle');
        var CircleShape=require('zrender/shape/Circle');
        var LineShape = require('zrender/shape/Line');
        var IsogonShape = require('zrender/shape/Isogon');
        var Group = require('zrender/Group');
        var TextShape = require('zrender/shape/Text');
        var Layer=require('zrender/Layer');
        var zrArea = require('zrender/tool/area');

        var zrGroup = [];//为group_id
        /*
        * todo:对节点操作补充：
        * 1.点击节点，其它节点透明化处理，当前节点突出显示，
        * 2.点击节点，toggle显示节点信息。（toggle)
        * 3.也 main其它位置点击，隐藏节点信息，删除节点日期显示
        *
        * _focus_node, _reset_node,
        * _render_curDate
        * */
        /*curdateNodes用于处理点击节点时突出显示的当前时间线*/
        var curdateNodes=[];

        var yOffsetPlus=30;

        nodesRenderEagle.render=function(zr,project){
            //end nodesRender
            //数据过滤
            //渲染
            _render_nodes(zr,project);

        };

        nodesRenderEagle.init=function(zr){
            //todo:因为angular单页刷新的缘故，需要init重置数据，render 单独做渲染操作
            //数据重置
            //渲染
            zrGroup = [];
            //nodesRender.render(zr,project);

        };

        function _render_nodes(zr,projectObject) {

            //var zrNodes = []; //为group_id ---因为计算方便，后改成gorup_id的方式
            // var zrGroup = [];//为group_id
            var getDate=graph.getDate;
            var getDateOffset=graph.getDateOffset;



            var project = projectObject; //project 绘图中确认了project 项目的startNode_Y的位置，可以为节点复用 ---目前只绘制主节点 draggable:false, hoverable:true, clickable:true

            //todo:porject_start这个值需要动态取得；
            var project_start=project.start_date;

            //todo：这里数据是放到project[nodes]中，所以要在data.init中做一层过滤处理
            var nodes = project["nodes"];

            var level1_radius = 0;
            var level2_radius = 0;

            var normal_color = "#92cddc";
            var done_color = "#439139";
            var delay_color = "#ad2726";

            $.each(nodes, function (i, e) {
                /*
                 * todo:目前节点提供了四个日期值，
                 * ScheduleStartDate, ScheduleEndDate, completeDate, delayCompleteDate
                 * 其中completeDate, delayCompleteDate为单一值，
                 * 这里应该考虑仅提供一个completeDate和一个delayStatus的状态布尔值
                 *
                 * 目前渲染时根据ScheduleStartDate来处理
                 *
                 * */
                if(e['scheduleStartDate']=='' || e['scheduleStartDate']==null || e['scheduleStartDate']==undefined){
                    //如果节点未提供开始日期数据，则根据前一个节点推算
                    if(i==0){

                        e['start_date']=getDate(project_start,20);
                        e['end_date']=getDate(e['start_date'],80);

                    }
                    else{
                        /*
                         这里做一个简单的容错处理，如果当前节点没有起始结束日期值，根据前一个节点推算一个日期值
                         绘图宽度为88像素，根据目前的4px/day计算，一个节点占日期宽度为22天,
                         pre_nodes_start_date 设为前一节点的20天，在图形上表现应该会减少重叠状态。
                         */
                        pre_item=nodes[i-1];

                        pre_nodes_start_date=getDate(pre_item.start_date,20);
                        e['start_date']=pre_nodes_start_date;
                        e['end_date']=getDate(e['start_date'],30);
                    }
                }else{
                    //根据startdate 确认x位置 数据提供的是scheduleStartDate
                    var sStartDate=new Date(e['scheduleStartDate']);
                    var sEndDate=new Date(e['scheduleEndDate']);
                    e['start_date']=sStartDate.getFullYear()+"-"+(sStartDate.getMonth()+1)+"-"+sStartDate.getDate();
                    e['end_date']=sEndDate.getFullYear()+"-"+(sEndDate.getMonth()+1)+"-"+sEndDate.getDate();
                }


                style_x = getDateOffset(project_start, e['start_date']) * graph.defaultPix+30;
                //todo:e.y_offset原设定为node自身属性，用于根据节点级别上下偏移。 目前版本未加入这个计算,设置为0；
                e.y_offset=0;

                //当节点位置产生重叠时，要产生纵向偏移来防止遮挡
                //y_plus为计算出的y轴偏移量，设为25, 目的是错开标题的显示
                //当产生点击动作时，把当前操作节点的zLevel设到最前面显示。

                var y_plus = 0;

                $.each(zrGroup, function (i, node) {
                    var zrNode_group = zr.storage.get(node);
                    // var zrNode=zr.storage.get(node.split("_")[0]+'_id');
                    var zrNode = zrNode_group.childAt(0);
                    //这里根据真实数据会出现后面节点再时间轴前面显示的问题，所以做双倍距离来判断
                    var inside = zrArea.isInside(zrNode,
                        {x: (zrNode_group.position[0] + zrNode.style.x - 8), y: (zrNode_group.position[1] + zrNode.style.y - 5), width: zrNode.style.width * 2, height: zrNode.style.height},
                        style_x, project.node_y + e.y_offset + y_plus + yOffsetPlus);

                    if (inside) {
                        //这里加入对c._level的判断，如果circleArea._level=1，把之前不等于1的点设为不可见
                        y_plus += 25;
                    }

                });

                //遍历后加入新的节点id
                //todo:目前数据提供的id有问题，暂时用'node_'+i替代
                zrGroup.push("node_"+e['sequence']+"_group");
                //zrGroup.push(e['id'] + '_group');

                //对每个节点集合建立group，方便同时改变。
                /*
                 *todo:处理的思路如下：
                 * Group作为一个容器，插入绘制node的子节点，因为Group 的变换会应用到自节点上。
                 * 所以用Group的position［0］产生时间轴（x轴）偏移,y轴始终为node类型（y轴）的起点。
                 * 绘制node子节点时，x为0，y值产生实际偏移（相对与group的position[1]y轴。
                 *
                 * 这样的设计也为之后操作节点偏移计算提供方便；
                 *
                 * 节点width=88,height:45;
                 *
                 */
                var g = new Group({
                        //todo:目前数据提供的id有问题，暂时用'node_'+i替代
                        //id: e['id'] + '_group',
                        id:'node_'+e['sequence']+'_group',
                        position: [style_x, project.node_y],//project.node_y为node分类(y轴）的起始位置
                        //todo:这里_x,_y的值是记录绘制关系节点时的起始位置，目前没有提供相关数据，为以后扩展，保持数据记录
                        _x: style_x,
                        _y: project.node_y + e.y_offset + 25 + yOffsetPlus,
                        _level: e['level'],//节点级别
                        _width: 88,
                        _height: 45,
                        _nodeId: e['id'],
                        _sequence:e["sequence"],

                        }
                );

                //var radius, color, style_x;
                var radius, color, text_color,text_name_color;

                if (e['level'] == 0) {
                    radius = level1_radius;
                    color = "#00aaff";
                    text_color="#fff"
                } else if (e['level'] == 1) {
                    radius = level1_radius;
                    color = "#5ab46e";
                    text_color="#fff"
                } else if (e['level'] == 2) {
                    radius = level1_radius;
                    color = "#f48a50";
                    text_color="#fff"
                }else if (e['level'] == 3) {
                    radius = level1_radius;
                    color = "#fbc44d";
                    text_color="#fff"
                }else if (e['level'] == 4) {
                    radius = level1_radius;
                    color = "#fbc44d";
                    text_color="#fff"
                }else if (e['level'] == 5) {
                    radius = level1_radius;
                    color = "#fbc44d";
                    text_color="#fff"
                }else if (e['level'] == all) {
                    radius = level1_radius;
                    color = "#92cddc";
                    text_color="#fff"
                }else {
                    radius = level2_radius;
                    color = "#fff";
                    text_color="#333"
                }//radius 定义

                if (e['start_date'] == undefined) {
                    color = "#ddd";
                }

                //g._y += y_plus;

                var stroke_color= '';
                //todo:根据e['status']判断节点的颜色
                //节点状态有4种：'complete', 'delay', 'on', 'unstart'
                switch( e['status']){
                    case 'complete':
                        stroke_color="#ddd";
                        text_name_color="#333";
                        break;
                    case 'delay':
                        stroke_color="#fd4239";
                        text_name_color="#333";
                        break;

                    case 'on':
                        stroke_color="#ddd";
                        text_name_color="#333";
                        break;
                    case 'unstart':
                        stroke_color="#ddd";
                        text_name_color="#333";
                        break;
                    default:
                        stroke_color="#ddd";
                        text_name_color="#333";
                        break;
                }


                var nodeTitle="  "+e['sequence'];
                g.addChild(new RectangleShape(
                    {
                        id:'node_'+e['sequence']+'_id',
                        style: {
                            //  x: style_x,
                            x: 0,
                            //y: project.node_y+ e.y_offset+yOffsetPlus,
                            y: e.y_offset + yOffsetPlus + y_plus,
                            width: 88,
                            height: 70,

                            radius: [radius, radius, 0, 0],
                            brushType: 'both',
                            color: color,          // rgba supported
                            strokeColor: stroke_color,
                            lineWidth: 6,
                            lineJoin: 'round',
                        },
                        //  z: 9,
                        hoverable: false,   // default true
                        draggable: false,   // default false
                        clickable: true,   // default false

                        _name: e['name'],
                        _group: 'node_'+e['sequence']+'_group',
                    }
                ));//add cricle


                //把group加入到zr中
                zr.addGroup(g);
                //zr.update();
            });//end each nodes

        };

        function _focusNode(zr,nodeGroup){
            //透明所有节点，突出显示当前节点
            $.each(zrGroup, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 0.3;
                    e.z=0;
                });
            });

            nodeGroup.eachChild(function (e) {
                e.style.opacity = 1;
                e.z=9;
            });

        };

        function _resetNode(zr){
            //恢复节点显示
            $.each(zrGroup, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 1;
                    e.z=0;
                });
            });

            $.each(curdateNodes, function (i, e) {
                zr.delShape(e);
            });
            //zr.update();

            curdateNodes = [];
        }

        return nodesRenderEagle;
    });