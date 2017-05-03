/**
 * Created by user on 2015/3/31.
 */

var project_start='2015-2-1';
defalutPix=4;
function gd(year,month,day){
    return new Date(year,month,day).getTime();
}
//dateString 格式2015-3-15 dateOffset为int格式
function getDate(dateString,dateOffset){
    //2015-1-3
    var date=dateString.split("-");

    var curDate=gd(parseInt(date[0]),parseInt(date[1])-1,parseInt(date[2]));
    var dateOffset=parseInt(dateOffset);//日期有0天
    var newDate_millSecond=curDate+dateOffset*24*60*60*1000;

    var newDate=new Date();
    newDate.setTime(newDate_millSecond);

    var newDateString=newDate.getFullYear()+'-'+(newDate.getMonth()+1)+'-'+newDate.getDate();
    return newDateString;

};

//getDate('2015-3-12',5);
function getDateOffset(project_start,cur_date){
    if(cur_date!=undefined){
        var sDate=project_start.split('-');
        var startDate=gd(parseInt(sDate[0]),parseInt(sDate[1])-1,parseInt(sDate[2]));
        var date=cur_date.split("-");
        var curDate=gd(parseInt(date[0]),parseInt(date[1])-1,parseInt(date[2]));
        var offset=parseInt((curDate-startDate)/(24*60*60*1000));
        return offset;
    }else{
        return 0;
    }
}
//a=getDate('2015-3-12',5);


function level_init() {
    //var mainTop=parseInt($("#main").offset().top);
    var mainTop = 88;

    var dragallowed = false;
    var developMode = true;
    var curX, curY;
    if (developMode) {
        // for develop
        require.config({
            packages: [
                {
                    name: 'zrender',
                    location: 'src',
                    main: 'zrender'
                }
            ]
        });
    }
    else {
        // for echarts online home page
        var fileLocation = 'src';

        require.config({
            paths: {
                zrender: fileLocation,
                'zrender/shape/Rose': fileLocation,
                'zrender/shape/Trochoid': fileLocation,
                'zrender/shape/Circle': fileLocation,
                'zrender/shape/Sector': fileLocation,
                'zrender/shape/Ring': fileLocation,
                'zrender/shape/Ellipse': fileLocation,
                'zrender/shape/Rectangle': fileLocation,
                'zrender/shape/Text': fileLocation,
                'zrender/shape/Heart': fileLocation,
                'zrender/shape/Droplet': fileLocation,
                'zrender/shape/Line': fileLocation,
                'zrender/shape/Image': fileLocation,
                'zrender/shape/Star': fileLocation,
                'zrender/shape/Isogon': fileLocation,
                'zrender/shape/BezierCurve': fileLocation,
                'zrender/shape/Polyline': fileLocation,
                'zrender/shape/Path': fileLocation,
                'zrender/shape/Polygon': fileLocation
            }
        });
    }//end config

    var w = (init_status.status5.x_end-init_status.status1.x_start)*defalutPix+startOffset*2;

    console.log("w-------------------"+w);
    var canvas_w =parseInt( $(".navbar").css("width"));
  //  var canvas_w=w;
    var date_w = w;

 //   var h = window.innerHeight - mainTop;
    var h=2820;
 //   var canvas_h =window.innerHeight - mainTop;
    var canvas_h = document.documentElement.clientHeight- mainTop;
    var pi = Math.PI;
    var main = document.getElementById('main');

   // main.style.width = canvas_w + 'px';
    main.style.width = w+ 'px'
    //main.style.height = canvas_h + 'px';
    main.style.height = h + 'px';
 //设置日期index css/

    $("#date-index").css({
        "width": date_w + 'px',
        "padding-left": startOffset + 'px',
        "padding-right": startOffset + 'px'
    });


    require(['zrender',"zrender/Layer", "zrender/Painter",'zrender/tool/area', 'zrender/shape/Circle', 'zrender/shape/Rectangle', "zrender/shape/Text", 'zrender/tool/color', 'zrender/Group', 'zrender/shape/Line', 'zrender/shape/Isogon', 'zrender/shape/Polyline', 'zrender/Group'], function (zrender) {
        var zr = zrender.init(main);

        var color = require('zrender/tool/color');
        var colorIdx = 4;
        var zrArea = require('zrender/tool/area');
        var CircleShape = require('zrender/shape/Circle');
        var RectangleShape = require('zrender/shape/Rectangle');
        var LineShape = require('zrender/shape/Line');
        var IsogonShape = require('zrender/shape/Isogon');
        var Group = require('zrender/Group');
        var TextShape = require('zrender/shape/Text');
        var PolylineShape = require('zrender/shape/Polyline');
        var Layer=require('zrender/Layer');

        var ImageShape = require('zrender/shape/Image');


        var width = Math.ceil(zr.getWidth());
        var height = Math.ceil(zr.getHeight());
        var layer_move_x=0;
        var layer_move_y=0;
        var eagle_width,eagle_height,eagle_eye_width,eagle_eye_height,eagle_positionX,eagle_positionY;
        eagle_width=450;
        eagle_height=eagle_width*(canvas_h/canvas_w);

        eagle_eye_width=(eagle_width/date_w)*eagle_width;
        eagle_eye_height=(eagle_height/h)*eagle_height;

        //eagle_positionX=width-eagle_width-20-eagle_eye_width;
        eagle_positionX=canvas_w-eagle_width-20-eagle_eye_width
        //eagle_positionY=height-eagle_height-20-eagle_eye_height;
        eagle_positionY=canvas_h-eagle_height-20-eagle_eye_height;

        var coef_x= (date_w-canvas_w)/(eagle_width);
        var coef_y= (h-canvas_h)/(eagle_height);
        console.log("conf----------------------------------------");
        console.log(date_w);

        console.log(coef_x);
        console.log(coef_y);
        var zrNodes = []; //为group_id ---因为计算方便，后改成gorup_id的方式
        var zrGroup = [];//为group_id
        var nodesContainer = [];//判断节点重合状态，在节点生成时添加--全局保存，不必清空 --代替原来的zrNodes

        var tempNodes = [];
        var tempLines = [];

        var line_nodes_temp = undefined;
        var pre_nodes_temp = [];
        var date_nodes = [];
        //start draw bg

        var start_offset = startOffset;
        var init_bg = init_status;
        var defalut_pix = defalutPix;//每天代表的像素单位，默认为2，根据调节变大（根据点的大小，如果日期点精确表示天的话，默认像素大小需要为20-30px
        var day_offset = dayOffset;//日期偏移量，在绘图时辅助绘图起始位置计算
//zr_wrapper

        $.each(init_bg, function (k, v) {

            var x_start = (v.x_start + day_offset) * defalut_pix + start_offset;
            var rect_width = (v.x_end - v.x_start) * defalut_pix;
            // var rect_width=w;
            //根据背景生成日期
            //  var d_count= v.date_count;
            //   var d_plus=(v.x_end- v.x_start)/d_count;

            var d_plus = 20;
            var d_width = d_plus * defalut_pix;
            var d_count = parseInt(rect_width / d_width);
            for (i = 0; i < d_count; i++) {
                var d = v.x_start + d_plus * i;
                $('<span class="date-day" id="' + v.id + '-' + i + '">' + d + '</span>').appendTo("#date-index").css("width", d_width + "px");
            }

            zr.addShape(new RectangleShape({
                style: {
                    x: x_start,
                    y: 0,
                    width: rect_width,
                    height: h,

                    brushType: 'fill',
                    color: v.bg,
                    //strokeColor : color.getColor(colorIdx++),
                    lineWidth: 0
                    // lineJoin : 'round',
                    // text : 'rectangle'
                },

                draggable: false,
                hoverable: false,
                clickable: false
            }));



            //垂直纵贯线

             zr.addShape(new LineShape({
             style : {
             xStart : x_start,
             yStart : 0,
             xEnd :x_start,
             yEnd : h,//绘图高度--项目整体高度
             strokeColor : "#ddd",
             lineWidth : 2,
             lineType : 'solid'    // default solid
             //text : 'line'
             },

             draggable : false,
             hoverable:false,
             clickable:false
             }));

             //文本背景
             zr.addShape(new RectangleShape({
             style : {
             x : x_start ,
             y :1,
             width :rect_width+2,
             height: 30,
             //  radius: [20, 50],
             brushType : 'both',
             color : '#dbeef3',
             strokeColor : '#333',
             lineWidth : 2,
             lineJoin : 'butt',
             text :  v.name,
             textColor:"#333",
             textPosition:'inside',
             textFont : 'bold 15px verdana',
             textAlign : 'center',
             textBaseline : 'middle'
             },
             draggable : false,
             hoverable:false,
             clickable:false
             }));
            //绘制 date 时间线
            var dateline_plus = 20;
            var dateline_width = dateline_plus * defalut_pix;
            var  dateline_count = parseInt(rect_width /dateline_width);

            for(i=0;i<dateline_count;i++){
                //正三角形 绘制指针
                var curDate_point=getDate(project_start,dateline_plus*i+day_offset+ v.x_start);
                curDate_array=curDate_point.split("-");
                var today=(new Date()).getTime();

                var curDate_timing=gd(parseInt(curDate_array[0]),parseInt(curDate_array[1])-1,parseInt(curDate_array[2]));

                var color_draw=(curDate_timing>today)?'#0072bb':"#ddd";
                zr.addShape(new IsogonShape({
                    style : {
                        x : getDateOffset(project_start,curDate_point)*defalut_pix+start_offset,
                        y : 45,
                        r : 10,
                        n : 3,
                        brushType : 'fill',
                        color :color_draw        // rgba supported

                        // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
                        // lineWidth : 9,
                        // text :'正n边形',
                        //  textPosition :'inside'
                    },

                    //rotation:[Math.PI/2,x_start+10,95],
                    draggable : false,
                    hoverable:false,
                    clickable:false
                }));
                //绘制日期
                zr.addShape(new RectangleShape({
                    style : {
                        x :getDateOffset(project_start,curDate_point)*defalut_pix+start_offset-41,
                        y : 38,
                        width :82,
                        height: 22,

                        brushType : 'fill',
                        color : color_draw,
                        radius: 3,
                        //strokeColor : color.getColor(colorIdx++),
                        //lineWidth : 0
                        // lineJoin : 'round',
                        text : curDate_point,
                        textFont:"10px verdana",
                        textColor:"#fff",
                        textPosition:"inside",
                        textAlign:"center",
                        textBaseline:"middle"
                    },
                    draggable : false,
                    hoverable:false,
                    clickable:false
                }));
            }



            //垂直纵贯线
            /*
             zr.addShape(new LineShape({
             style : {
             xStart : x_start+1,
             yStart : 0,
             xEnd :x_start+1,
             yEnd : height,
             strokeColor : "#333",
             lineWidth : 2,
             lineType : 'solid'    // default solid
             //text : 'line'
             },
             draggable : false,
             hoverable:false,
             clickable:false
             }));

             zr.addShape(new LineShape({
             style : {
             xStart : x_start+rect_width-1,
             yStart : 0,
             xEnd :x_start+rect_width-1,
             yEnd : height,
             strokeColor : "#333",
             lineWidth : 2,
             lineType : 'solid'    // default solid
             //text : 'line'
             },
             draggable : false,
             hoverable:false,
             clickable:false
             }));
             */
            // 文本

             zr.addShape(new TextShape({
             style : {
             x : x_start+rect_width / 2,
             y : 78,
             brushType : 'fill',
             color : '#9a9a9a',
             // shadowColor : 'yellow',
             //  shadowBlur : 10,
             lineWidth : 3,
             text : v.name,
             textFont : 'normal 15px verdana',
             textAlign : 'center',
             textBaseline : 'middle'
             },
             draggable : false,
             hoverable:false,
             clickable:false
             }));

             // 直线
             zr.addShape(new LineShape({
             style : {
             xStart : x_start+10,
             yStart : 95,
             xEnd :x_start+rect_width-10,
             yEnd : 95,
             strokeColor : "#eaeaea",
             lineWidth : 8,
             lineType : 'solid'    // default solid
             //text : 'line'
             },
             draggable : false,
             hoverable:false,
             clickable:false
             }));
             //正三角形
             zr.addShape(new IsogonShape({
             style : {
             x : x_start+10,
             y : 95,
             r : 10,
             n : 3,
             brushType : 'fill',
             color : '#eaeaea'          // rgba supported

             // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
             // lineWidth : 9,
             // text :'正n边形',
             //  textPosition :'inside'
             },
             rotation:[Math.PI/2,x_start+10,95],
             draggable : false,
             hoverable:false,
             clickable:false
             }));

             zr.addShape(new IsogonShape({
             style : {
             x :x_start+rect_width-10,
             y : 95,
             r : 10,
             n : 3,
             brushType : 'fill',
             color : '#eaeaea'          // rgba supported

             // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
             // lineWidth : 9,
             // text :'正n边形',
             //  textPosition :'inside'
             },
             rotation:[Math.PI*3/2,x_start+rect_width-10,95],
             draggable : false,
             hoverable:false,
             clickable:false
             }));



        });

        //绘制项目时间线；
        init_project(zr);

        //绘制当前的时间点
        var startDate=new Date();
        // alert(new Date(startDate));
        var curDate=startDate;

        var d=new Date(curDate);
        // alert(d);
        var curDate_String= d.getFullYear()+'-'+ (parseInt(d.getMonth())+1)+'-'+ d.getDate();
        // alert(curDate_String);
        // console.llog(curDate_String);
        //正三角形 绘制指针
        zr.addShape(new IsogonShape({
            style : {
                x : getDateOffset(project_start,curDate_String)*defalut_pix+start_offset,
                y : 40,
                r : 10,
                n : 3,
                brushType : 'fill',
                color : '#ff8113'          // rgba supported

                // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
                // lineWidth : 9,
                // text :'正n边形',
                //  textPosition :'inside'
            },

            //rotation:[Math.PI/2,x_start+10,95],
            draggable : false,
            hoverable:false,
            clickable:false
        }));
        //绘制日期
        //矩形
        zr.addShape(new RectangleShape({
            style : {
                x :getDateOffset(project_start,curDate_String)*defalut_pix+start_offset-41,
                y : 38,
                width :82,
                height: 22,

                brushType : 'fill',
                color : '#ff8113',
                radius: 3,
                //strokeColor : color.getColor(colorIdx++),
                //lineWidth : 0
                // lineJoin : 'round',
                text : curDate_String,
                textFont:"10px verdana",
                textColor:"#fff",
                textPosition:"inside",
                textAlign:"center",
                textBaseline:"middle"
            },
            draggable : false,
            hoverable:false,
            clickable:false
        }));
        //绘制纵向线
        zr.addShape(new LineShape({
            style : {
                xStart :getDateOffset(project_start,curDate_String)*defalut_pix+start_offset,
                yStart : 0,
                xEnd :getDateOffset(project_start,curDate_String)*defalut_pix+start_offset,
                yEnd : zr.getHeight(),
                strokeColor : "#ff8113",
                lineWidth : 1,
                lineType : 'solid'    // default solid
                //text : 'line'
            },
            draggable : false,
            hoverable:false,
            clickable:false
        }));

        //end 绘制当前的时间点

        //绘画
        zr.render();


        //初始化project --level 1
        function init_project(zrObject) {
            var zr = zrObject;
            var project_count = 0;
            var zrWidth = zr.getWidth();
            console.log("zrWidth------------------------------------------------");
            console.log(zrWidth);
            var project_y = 30;
            var heightOffset = 100;
            $.each(init_data_level1, function (i, e) {
                //e:project

                var project = e;
                var id = project.id;

                var startNode_x = startOffset;//偏移量

                 var endNode_x = date_w - startOffset;

                // var startNode_y=project["height"]*(project_count+1)+project["offset"]*project_count+heightOffset;
                var startNode_y = project["height"] + project_y;
                //标记project_y为新的位置，作为下级的起点
                project_y = startNode_y;
                var endNode_y = startNode_y;

                //绘制背景线段  --基础线段

                zr.addShape(new LineShape({
                    style: {
                        xStart: startNode_x,
                        yStart: startNode_y,
                        xEnd: endNode_x,
                        yEnd: endNode_y,
                        strokeColor: "#333",
                        lineWidth: 2,
                        lineType: 'solid'    // default solid
                        //text : 'line'
                    },
                    draggable: false,
                    hoverable: false,
                    clickable: false
                }));

                //绘制背景线段  --当前日期线段
                /*
                 zr.addShape(new LineShape({
                 style : {
                 xStart :startNode_x-10,
                 yStart : startNode_y,
                 xEnd :startNode_x+(cur_day+day_offset)*defalutPix,
                 yEnd : endNode_y,
                 strokeColor : "#0072bb",
                 lineWidth : 4,
                 lineType : 'solid'    // default solid
                 //text : 'line'
                 },
                 draggable : false,
                 hoverable:false,
                 clickable:false
                 }));
                 */
                //绘制背景线段  --当前完成状态
                /*
                 zr.addShape(new LineShape({
                 style : {
                 xStart :startNode_x-10,
                 yStart : startNode_y,
                 xEnd :startNode_x+(project['cur_done']+day_offset)*defalutPix,
                 yEnd : endNode_y,
                 strokeColor : "#459139",
                 lineWidth : 4,
                 lineType : 'solid'    // default solid
                 //text : 'line'
                 },
                 draggable : false,
                 hoverable:false,
                 clickable:false
                 }));
                 */
                //添加项目名称 --绝对定位，以便永远浮动在最上层
                $('<div class="project-name" id="' + id + '">' + project.name + '</div>').appendTo("#project-index").css({
                    "top": startNode_y - project['height'] / 2 - 15,
                    "left": -project['height'] / 2 + 15,
                    "width": project['height'],
                    "height": 30
                });

                project.node_y = startNode_y - project['height'];//为顶部的高度30px;

                /*

                 //绘制项目keypoint
                 $.each(init_bg,function(k,v) {

                 var x_start = (v.x_start + day_offset) * defalut_pix + start_offset;
                 var rect_width = (v.x_end - v.x_start) * defalut_pix;

                 zr.addShape(new RectangleShape({
                 style : {
                 x :  x_start-13,
                 y : project.node_y+project['height']/2-50,
                 width : 26,
                 height: 100,

                 brushType : 'both',
                 color : "#333"

                 },
                 draggable : false,
                 hoverable:false,
                 clickable:false

                 }));

                 zr.addShape(new TextShape({
                 style : {
                 x :  x_start,
                 y : project.node_y+project['height']/2,
                 brushType : 'fill',
                 color : '#fff',
                 // shadowColor : 'yellow',
                 //  shadowBlur : 10,
                 //lineWidth : 3,
                 text : v.key_point.split('').join("\n"),
                 textFont : 'bold 16px Microsoft Yahei',
                 textAlign : 'center',
                 textBaseline : 'middle',
                 textColor : '#000'

                 },
                 draggable : false,
                 hoverable:false,
                 clickable:false
                 }));

                 });//end each
                 */


                //绘制nodes方法；
                init_nodes(project);

                project_count += 1;
            });
        }//end //初始化project

        //初始化 nodes方法，应用于初始化project内部
        function init_nodes(projectObject) {
            var project = projectObject; //project 绘图中确认了project 项目的startNode_Y的位置，可以为节点复用 ---一级只绘制主节点 draggable:false, hoverable:true, clickable:true
            var nodes = project["nodes"];

            var level1_radius = 6;
            var level2_radius = 6;

            var normal_color = "#92cddc";
            var done_color = "#439139";
            var delay_color = "#ad2726";

            $.each(nodes, function (i, e) {



                if(e['start_date']=='' ||e['start_date']==null||e['start_date']==undefined){

                    if(i==0){
                        e['start_date']=getDate(project_start,20);
                        e['end_date']=getDate(e['start_date'],80);
                    }
                    else{

                        pre_item=nodes[i-1];
                        pre_nodes_start_date=getDate(pre_item.start_date,38);
                        e['start_date']=pre_nodes_start_date;
                        e['end_date']=getDate(e['start_date'],30);
                    }
                }

                // if(e['start_date']!=undefined){

                //计算node 的x位置；
                //style_x=(e['x']+day_offset)*defalut_pix+start_offset;
                //根据startdate 确认x位置
                style_x = getDateOffset(project_start, e['start_date']) * defalut_pix;

                //如果没有数据，根据之前关联点的位置+ 100来绘制style_x;


                //id
                var y_plus = 0;
                var ix = 0;

                $.each(zrNodes, function (i, node) {
                    var zrNode_group = zr.storage.get(node);
                    // var zrNode=zr.storage.get(node.split("_")[0]+'_id');
                    var zrNode = zrNode_group.childAt(0);

                    ix += 1;

                    //这里根据真实数据会出现后面节点再时间轴前面显示的问题，所以做双倍距离来判断
                    var inside = zrArea.isInside(zrNode, {x: (zrNode_group.position[0] + zrNode.style.x - 88), y: (zrNode_group.position[1] + zrNode.style.y - 5), width: zrNode.style.width * 2, height: zrNode.style.height}, style_x, project.node_y + e.y_offset + y_plus + 120);


                    if (inside) {
                        //这里加入对c._level的判断，如果circleArea._level=1，把之前不等于1的点设为不可见
                        y_plus += 25;
                    }


                });

                //遍历后加入新的节点id,目前两个数据有重合，重构需注意重新整合
                zrNodes.push(e['id'] + '_group');
                zrGroup.push(e['id'] + '_group');


                //对每个节点集合建立group，方便同时改变。
                /*
                 var g=new Group();
                 g.id=e['id']+'_group';
                 g.position[0]=style_x;
                 g.position[1]=project.node_y;
                 g._nodeId=e['id'];
                 g.onclick(function(){
                 });
                 */


                var g = new Group({
                        id: e['id'] + '_group',
                        position: [style_x, project.node_y],
                        _x: style_x,
                        _y: project.node_y + e.y_offset + 25 + 120,
                        _level: e['level'],
                        _width: 88,
                        _height: 45,
                        _nodeId: e['id'],
                        _name: e['name'],
                        _status: e['cur_status'],
                        _data: e['description'],
                        _main_duty_company: e['main_duty_company'],
                        _type_name: e['type_name'],
                        _start_date: e['start_date'],
                        _end_date: e['end_date'],
                        _offset: e['offset'],
                        _last: e['last'],
                        _comments: e['comments'],
                        _pre_rel_nodes: e['pre_rel_node'],
                        _rel_nodes: e['rel_nodes'],
                        _y_plus: y_plus,
                        onclick: function (params) {

                            //每次点击时，把记录本次移动的cur_x（天数）归零，此参数是用于取消操作时，各个数据的归位操作
                            this.cur_x = 0;
                            var yPlus = this._y_plus;
                            pre_node = '';
                            $.each(tempNodes, function (i, e) {
                                zr.delShape(e);
                            });
                            $.each(tempLines, function (i, e) {
                                zr.delShape(e);
                            });
                            $.each(date_nodes, function (i, e) {
                                zr.delShape(e);
                            });
                            //zr.update();
                            tempNodes = [];
                            tempLines = [];
                            pre_nodes_temp = [];
                            date_nodes = [];
                            line_nodes_temp = undefined;
                            if (this._pre_rel_nodes[0] != null) {
                                //pre_node='';
                                for (i in this._pre_rel_nodes) {
                                    pre_node += this._pre_rel_nodes[i] + ":" + zr.storage.get(this._pre_rel_nodes[i])._name + "<br>";
                                }
                            }

                            getRelations(this.id);

                            if ($('.canvas-wrapper .node-info').get(0) == undefined) {

                                var tDiv = [
                                    '<div class="node-info">',
                                    '<h3>',
                                    this._name,
                                    '</h3>',
                                    '<div><span>前置节点：</span><span>',
                                    pre_node,
                                    '</span></div>',
                                    '<div><span>主责方：</span><span>',
                                    this._main_duty_company,
                                    '</span></div>',
                                    // '<div><span>状态：</span><span>未启动</span></div>',
                                    '<div><span>开始日期：</span><span>',
                                    this._start_date,
                                    '</span></div>',
                                    '<div><span>结束日期：</span><span>',
                                    this._end_date,
                                    '</span></div>',
                                    '<div class="edit"><span id="',
                                        this._status == 'complete' ? 'confirm-cancel' : "edit-node",
                                    '"><a href="">',
                                        this._status == 'complete' ? '确认' : "调整",
                                    '</a></span>',
                                        this._status == 'complete' ? '' : '<span id="confirm-cancel"><a href="">关闭</a></span>',
                                    '</div>',
                                    '<span class="arrow"></span>',
                                    '</div>'
                                ].join('');

                                $(tDiv).appendTo(".canvas-wrapper").css({
                                    top: this._y + this.childAt(0).position[1]+layer_move_y,
                                    left: this._x + 66 + this.childAt(0).position[0]+layer_move_x
                                }).attr("data-target", this.id.split('_')[0]).fadeIn();
                            } else {
                                if (params.target.id.split('_')[0] == $('.canvas-wrapper .node-info').attr('data-target')) {
                                    $('.canvas-wrapper .node-info').remove();
                                } else {
                                    $('.canvas-wrapper .node-info').remove();
                                    var tDiv = [
                                        '<div class="node-info">',
                                        '<h3>',
                                        this._name,
                                        '</h3>',
                                        '<div><span>前置节点：</span><span>',
                                        pre_node,
                                        '</span></div>',
                                        '<div><span>主责方：</span><span>',
                                        this._main_duty_company,
                                        '</span></div>',
                                        // '<div><span>状态：</span><span>未启动</span></div>',
                                        '<div><span>开始日期：</span><span>',
                                        this._start_date,
                                        '</span></div>',
                                        '<div><span>结束日期：</span><span>',
                                        this._end_date,
                                        '</span></div>',
                                        '<div class="edit"><span id="',
                                            this._status == 'complete' ? 'confirm-cancel' : "edit-node",
                                        '"><a href="">',
                                            this._status == 'complete' ? '确认' : "调整",
                                        '</a></span>',
                                            this._status == 'complete' ? '' : '<span id="confirm-cancel"><a href="">关闭</a></span>',
                                        '</div>',
                                        '<span class="arrow"></span>',
                                        '</div>'
                                    ].join('');

                                    $(tDiv).appendTo(".canvas-wrapper").css({
                                        top: this._y + this.childAt(0).position[1]+layer_move_y,
                                        left: this._x + 66 + this.childAt(0).position[0]+layer_move_x
                                    }).attr("data-target", params.target.id.split('_')[0]).fadeIn();
                                }
                            }

                            //绘制当前的时间点
                            // var startDate=new Date();

                            //  var curDate=startDate+cur_day*24*60*60*1000;
                            //var d=new Date(curDate);

                            // var curDate_String= d.getFullYear()+'-'+ (parseInt(d.getMonth())+1)+'-'+ d.getDate();
                            var curDate_String = this._start_date;
                            var date_left = this._x + this.childAt(0).position[0];
                            //正三角形 绘制指针
                            zr.addShape(new IsogonShape({
                                id: e['id'] + '_date_tri',
                                style: {
                                    x: date_left,
                                    // y : project.node_y+e.y_offset+86+22,
                                    y: project.node_y + e.y_offset + 86 + 22 + yPlus,
                                    r: 10,
                                    n: 3,
                                    brushType: 'fill',
                                    color: '#f01f42'          // rgba supported

                                    // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
                                    // lineWidth : 9,
                                    // text :'正n边形',
                                    //  textPosition :'inside'
                                },

                                rotation: [Math.PI, date_left, project.node_y + e.y_offset + 86 + 22 + yPlus],
                                draggable: false,
                                hoverable: false,
                                clickable: false
                            }));
                            date_nodes.push(e['id'] + '_date_tri');
                            //绘制日期
                            //矩形
                            zr.addShape(new RectangleShape({
                                id: e['id'] + '_date',
                                style: {
                                    x: date_left - 15,
                                    y: project.node_y + e.y_offset + 86 + yPlus,
                                    width: 103,
                                    height: 22,

                                    brushType: 'fill',
                                    color: '#f01f42',
                                    radius: 5,
                                    //strokeColor : color.getColor(colorIdx++),
                                    //lineWidth : 0
                                    // lineJoin : 'round',
                                    text: curDate_String == undefined ? '信息暂不完整' : curDate_String,
                                    textFont: "10px verdana",
                                    textColor: "#fff",
                                    textPosition: "inside",
                                    textAlign: "center",
                                    textBaseline: "middle"
                                },
                                draggable: false,
                                hoverable: false,
                                clickable: false
                            }));
                            date_nodes.push(e['id'] + '_date');
                            //垂直纵贯线

                            zr.addShape(new LineShape({
                                id: e['id'] + '_date_line',
                                style: {
                                    xStart: date_left,
                                    yStart: 0,
                                    xEnd: date_left,
                                    yEnd: height,
                                    strokeColor: "#f01f42",
                                    lineWidth: 1,
                                    lineType: 'solid'    // default solid
                                    //text : 'line'
                                },
                                draggable: false,
                                hoverable: false,
                                clickable: false
                            }));
                            date_nodes.push(e['id'] + '_date_line');

                        }, //end on click function
                        ondragstart: function (e) {

                                $('.node-info').remove();

                        },//end ondrag start,


                        ondragend: function (params) {

                            var node_id = params.target.id.split("_")[0];
                            console.log("node_id------------------")
                            console.log(node_id);
                            var node = zr.storage.get(node_id + '_group');
                            console.log(node);
                            node.eachChild(function (e) {
                                e.clickable = true;
                                e.draggable = false;
                            });

                            //根据target节点判断所有节点的最终状态
                            var wconfirm = window.confirm('确认更改？');
                            if (wconfirm) {
                                // alert(this.childAt(0).position[0]/defalut_pix)
                                //发送节点数据-------
                                var sendData = [];
                                sendData.push({
                                    "node_id": this.id.split('_clone')[0],
                                    'start_date':zr.storage.get(this.id)._start_date,
                                    "move": parseInt(this.position[0] / defalut_pix),
                                    'node_name':zr.storage.get(this.id)._name,
                                    'isStartNode': true
                                });

                                var showTag = false;//用showTag来展示回调成功，对节点进行重绘
                                updateData(sendData, 1);

                            }//end if(wconfirm)
                            else {
                                this.eachChild(function (e) {
                                    e.position[0] = 0;
                                });
                            }

                            //处理结束后清空clone数据
                            //恢复节点显示
                            $.each(zrNodes, function (i, e) {
                                //node.style.opacity=0.3;
                                var node = zr.storage.get(e);
                                node.eachChild(function (e) {
                                    e.style.opacity = 1
                                });
                            });
                            //清空clone数据
                            $.each(tempNodes, function (i, e) {
                                zr.delShape(e);
                            });
                            $.each(tempLines, function (i, e) {
                                zr.delShape(e);
                            });
                            $.each(date_nodes, function (i, e) {
                                zr.delShape(e);
                            });
                            //zr.update();
                            tempNodes = [];
                            tempLines = [];
                            line_nodes_temp = undefined;

                            pre_nodes_temp = [];
                            date_nodes = [];
                        }//end ondrag end
                    }
                );

                //   var radius, color,style_x;
                var radius, color,text_color;
                if (e['level'] == 1.0) {
                    radius = level1_radius;
                    color = "#0069a0";
                    text_color="#3f9ad6"
                } else if (e['level'] == 2.0) {
                    radius = level1_radius;
                    color = "#92cddc";
                    text_color="#333"
                } else {
                    radius = level2_radius;
                    color = "#fff";
                    text_color="#333"
                }//radius 定义

                if (e['start_date'] == undefined) {
                    color = "#ddd";
                }

                /*
                 if (e['cur_status'] == 'complete') {
                 if (e['delay'] > 0){
                 color=delay_color;
                 } else{
                 color=done_color;
                 }
                 }else{
                 color=normal_color;
                 }//color 定义
                 */
                //draw node


                // g.position[1]+=y_plus;
                g._y += y_plus;
                var stroke_color= '';
               switch( e['cur_status']){
                   case 'complete':
                       stroke_color="#78b7db";
                       text_color="#333";
                       break;
                   case 'delay':
                       stroke_color="#fd4239";
                       text_color="#fd4239";
                       break;

                   case 'on':
                       stroke_color="#23ac38";
                       text_color="#23ac38";
                       break;
                   case 'unstart':
                       stroke_color="#fd4239";
                       text_color="#fd4239";
                       break;
                   default:
                       stroke_color="#333";
                       break;
               }

                g.addChild(new RectangleShape(
                    {
                        id: e['id'] + '_id',
                        style: {
                            //  x: style_x,
                            x: 0,
                            //   y: project.node_y+ e.y_offset+120,
                            y: e.y_offset + 120 + y_plus,
                            width: 88,
                            height: 25,

                            radius: [radius, radius, 0, 0],
                            brushType: 'both',
                            color: color,          // rgba supported
                            strokeColor: stroke_color,
                            lineWidth: 2,
                            lineJoin: 'round',
                            text: e['id'],

                            textPosition: 'inside',
                            textAlign: "center",
                            textFont: 'bold 12px verdana',
                            textAlign: 'center',
                            textBaseline: 'middle',
                            textColor: text_color

                            //strokeColor: color.getColor(colorIdx++),  // getColor from default palette
                            // lineWidth: 5,
                            //  text: 'circle',
                            // textPosition: 'inside'

                        },
                        //  z: 9,
                        hoverable: false,   // default true
                        draggable: false,   // default false
                        clickable: true,   // default false

                        _name: e['name'],
                        _group: e['id'] + '_group',
                        _data: e['datadescription'],
                        _main_duty_company: e['main_duty_company'],
                        _type_name: e['type_name'],
                        _start_date: e['start_date'],
                        _end_date: e['end_date'],
                        ondrift: function (dx, dy) {


                            var curId = this.id.split('_')[0];
                            var aNode = zr.storage.get(curId);
                            aNode.position[0] += dx;
                            this.position[1] = 0;
                            this.position[0] += dx;

                            $.each(pre_nodes_temp, function (i, e) {
                                var preNode = zr.storage.get(curId + '_' + e + '_' + "c1");
                                var preLine = zr.storage.get(curId + '_' + e + '_' + 'line');
                                preNode.position[0] += dx;
                                preLine.style.xStart += dx;
                            });

                            var line_nodes = line_nodes_temp[curId + '_group'];

                            $.each(line_nodes, function (i, e) {
                                var lineNode = zr.storage.get(curId + '_' + e.split('_')[0] + '_' + "c1");
                                var linkLine = zr.storage.get(curId + '_' + e.split('_')[0] + '_' + 'line');
                                lineNode.position[0] += dx;
                                linkLine.style.xStart += dx;
                            });

                            //更新日期
                            var date_offset = 0;
                            $.each(date_nodes, function (i, e) {
                                var date_node = zr.storage.get(e);
                                date_node.position[0] += dx;

                            });
                            date_offset = parseInt(this.position[0] / defalut_pix);
                            //更新日期 显示
                            var date_node = zr.storage.get(curId + "_date");
                            date_node.style.text = getDate(this._start_date, date_offset);

                            zr.refreshNextFrame();
                            //zr.refresh();
                            return true;

                        }//end ondrift


                        /*
                         onclick: function (params) {
                         // alert('hello');

                         }//end on click function
                         */
                    }
                ));//add cricle

                g.addChild(new RectangleShape(
                    {
                        id: e['id'],
                        style: {
                            // x: style_x,
                            // y: project.node_y+e.y_offset+25+120,
                            x: 0,
                            y: e.y_offset + 25 + 120 + y_plus,
                            width: 88,
                            height: 45,
                            radius: [0, 0, radius, radius],

                            brushType: 'both',
                            color: "#fff",          // rgba supported
                            strokeColor: stroke_color,
                            lineWidth: 2,
                            lineJoin: 'round',
                            // text : e['name'],
                            // text:e['name'].length>6?(e['name'].substr(0,6)+'\n'+e['name'].substr(6,12)):e['name'],
                            text: e['name'].length > 6 ? (e['name'].substr(0, 6) + '\n' + e['name'].substr(6, 6)) : e['name'],
                            textPosition: 'inside',
                            textAlign: "center",
                            textFont: 'bold 12px verdana',
                            textAlign: 'center',
                            textBaseline: 'middle',
                            textColor: text_color

                            //strokeColor: color.getColor(colorIdx++),  // getColor from default palette
                            // lineWidth: 5,
                            //  text: 'circle',
                            // textPosition: 'inside'

                        },
                        //z: 9,
                        hoverable: false,   // default true
                        draggable: false,   // default false
                        clickable: true, // default false

                        _name: e['name'],
                        _group: e['id'] + '_group',
                        _data: e['description'],
                        _main_duty_company: e['main_duty_company'],
                        _type_name: e['type_name'],
                        _start_date: e['start_date'],
                        _end_date: e['end_date'],
                        _offset: e['offset'],
                        _last: e['last'],
                        _comments: e['comments'],
                        _pre_rel_nodes: e['pre_rel_node'],
                        _rel_nodes: e['rel_nodes'],
                        ondrift: function (dx, dy) {

                            var curId = this.id;
                            var aNode = zr.storage.get(curId + '_id');
                            aNode.position[0] += dx;
                            this.position[1] = 0;
                            this.position[0] += dx;

                            $.each(pre_nodes_temp, function (i, e) {
                                var preNode = zr.storage.get(curId + '_' + e + '_' + "c1");
                                var preLine = zr.storage.get(curId + '_' + e + '_' + 'line');
                                preNode.position[0] += dx;
                                preLine.style.xStart += dx;
                            });

                            try {
                                var line_nodes = line_nodes_temp[curId + '_group'];
                                $.each(line_nodes, function (i, e) {
                                    var lineNode = zr.storage.get(curId + '_' + e.split('_')[0] + '_' + "c1");
                                    var linkLine = zr.storage.get(curId + '_' + e.split('_')[0] + '_' + 'line');
                                    lineNode.position[0] += dx;
                                    linkLine.style.xStart += dx;
                                });

                            } catch (e) {

                            }

                            //更新日期
                            $.each(date_nodes, function (i, e) {
                                var date_node = zr.storage.get(e);
                                date_node.position[0] += dx;
                            });
                            //更新日期-显示
                            //  var date_node=zr.storage.get(curId+"_date");
                            //  date_node.style.text=getDate(date_node.style.text,dx);
                            date_offset = parseInt(this.position[0] / defalut_pix);
                            //更新日期 显示
                            var date_node = zr.storage.get(curId + "_date");
                            date_node.style.text = getDate(this._start_date, date_offset);

                            zr.refreshNextFrame();
                            return true;

                        }//end ondrift
                    }
                ));//add cricle

                //把group加入到zr中
                zr.addGroup(g);
                //zr.update();


            });//end each nodes


        }

        //end初始化 nodes方法，应用于初始化project内部
        //折线先不画
        function drawRelations() {

            $.each(relations, function (i, e) {

                var node1 = zr.storage.get(e[0]);
                var node2 = zr.storage.get(e[1]);
                drawLines(node1, node2, true);
            });

        }

        console.log("painter==========")
        var imageData=zr.toDataURL();
        /*console.log(imageData);*/


        //鹰眼绘图

       var eagle_group= new Group({
               id: 'eagle_eye',
               position: [eagle_positionX,eagle_positionY]
           }
       );

      /*  var image = new ImageShape({
            style: {
                image: 'test.jpg',
                x: 100,
                y: 100
            }
        });
        zr.addShape(image);*/

        eagle_group.addChild(new ImageShape({
            style: {
                brushType:'both',
                image: imageData,
                x: 0,
                y: 0,
                width: eagle_width+eagle_eye_width,
                height: eagle_height+eagle_eye_height,
                color:'rgba(255,255,255,0.9)',
                strokeColor:'#29ABE4',
                lineWidth:3,
                radius: 0
            },
            //  zlevel:12,
            clickable:false,
            draggable:false,
            hoverable:false,
            onclick:function(e){
                console.log(zr);
                e.cancelBubble=true;

            }

        }));

        eagle_group.addChild(new RectangleShape({
            style: {
                brushType:'both',
                x: 0,
                y: 0,
                width: eagle_width+eagle_eye_width,
                height: eagle_height+eagle_eye_height,
                color:'rgba(255,255,255,0.6)',
                strokeColor:'#29ABE4',
                lineWidth:3,
                radius: 0
            },
          //  zlevel:12,
            clickable:false,
            draggable:false,
            hoverable:false,
            onclick:function(e){
                console.log(zr);
                e.cancelBubble=true;

            }
        }));
        eagle_group.addChild(new RectangleShape({
            id:'eagle',
            style: {
                brushType:'both',
                x: 0,
                y: 0,
                width: eagle_eye_width,
                height: eagle_eye_height,
                color:'rgba(255,0,0,0.9)',
               // strokeColor:'#29ABE4',
                //lineWidth:3,
                radius: 0
            },
           // zlevel:12,
            clickable:false,
            draggable:true,
            hoverable:false,
            ondragstart: function (e) {
                $('.node-info').remove();

            },//end ondrag start,
            ondrift:function(dx,dy){
                movePix=defalut_pix;
                if(this.position[0]<0){
                    this.position[0]=0;
                }else if(this.position[0]> (eagle_width)){
                    this.position[0]=eagle_width;
                }
                if(this.position[1]<0){
                    this.position[1]=0;
                }else if(this.position[1]> (eagle_height)){
                    this.position[1]=eagle_height;
                }
                layer_move_x=(-coef_x)*this.position[0];
                layer_move_y=(-coef_y)*this.position[1];
                console.log("position----------------------")
                console.log(this.position[0]);
                console.log(this.position[1]);
                console.log("layer----------------------")
                console.log( layer_move_x);
                console.log( layer_move_y);
              //  var eagle_position_x=zr.storage.get("eagle_eye").position[0]+layer_move_x;
              //  var eagle_position_y=zr.storage.get("eagle_eye").position[1]+layer_move_y;

                var eagle_position_x=eagle_positionX-layer_move_x;
                var eagle_position_y=eagle_positionY-layer_move_y;
                $("#date-index").css('left',layer_move_x);
                $("#project-index").css('top',layer_move_y);

                zr.modLayer('0',{position:[layer_move_x,layer_move_y]});

                zr.modGroup("eagle_eye",{position:[eagle_position_x,eagle_position_y]});

                zr.refresh("0");
                }
        }));
        zr.addGroup(eagle_group);



        //drawRelations();

        //绘制关系折线
        //箭头折线  //取消
        function drawLines(node1, node2, drawArrow) {
            var arrowCase = 1;
            var drawArrowBoolean = drawArrow == null ? false : true;
            if (node2.style.x > node1.style.x && node2.style.y > node1.style.y) {
                var s1_x = node1.style.x + node1.style.width / 2;
                var s1_y = node1.style.y + node1.style.height;
                var s2_x = node2.style.x;
                var s2_y = node2.style.y + 8;
                arrowCase = 1;
            } else if (node2.style.y > node1.style.y && node2.style.x < node1.style.x) {
                var s1_x = node1.style.x + node1.style.width / 2;
                var s1_y = node1.style.y + node1.style.height;
                var s2_x = node2.style.x + node2.style.width;
                var s2_y = node2.style.y + 8;
                arrowCase = 2;
            } else if (node2.style.y < node1.style.y && node2.style.x < node1.style.x) {
                var s2_x = node2.style.x + node2.style.width / 2;
                var s2_y = node2.style.y + node2.style.height;
                var s1_x = node1.style.x;
                var s1_y = node1.style.y + 8;
                arrowCase = 3;
            } else {
                var s2_x = node2.style.x + node2.style.width / 2;
                var s2_y = node2.style.y + node2.style.height;
                var s1_x = node1.style.x + node1.style.width;
                var s1_y = node1.style.y + 8;
                arrowCase = 4;
            }


            // 折线
            var point_list = null;
            switch (arrowCase) {
                case 1:
                    point_list = [
                        [s1_x, s1_y ],
                        [s1_x, s2_y],
                        [s2_x, s2_y]
                    ];
                    break;
                case 2:
                    point_list = [
                        [s1_x, s1_y ],
                        [s1_x, s2_y],
                        [s2_x, s2_y]
                    ];
                    break;
                case 3:
                    point_list = [
                        [s1_x, s1_y ],
                        [s2_x, s1_y],
                        [s2_x, s2_y]
                    ];
                    break;
                case 4:
                    point_list = [
                        [s1_x, s1_y ],
                        [s2_x, s1_y],
                        [s2_x, s2_y]
                    ];
                    break;

            }
            zr.addShape(new PolylineShape({
                style: {
                    pointList: point_list,
                    strokeColor: "#bf0008",
                    lineWidth: 3,
                    text: ''
                },

                draggable: false,
                hoverable: false,
                clickable: false
            }));
            if (drawArrowBoolean == true) {
                var rotation_deg, isogon_x, isogon_y;

                switch (arrowCase) {
                    case 1:
                        isogon_x = s2_x - 10;
                        isogon_y = s2_y;
                        rotation_deg = [Math.PI * 3 / 2, isogon_x, isogon_y];
                        break;
                    case 2:
                        isogon_x = s2_x + 10;
                        isogon_y = s2_y;
                        rotation_deg = [Math.PI / 2, isogon_x, isogon_y];
                        break;
                    case 3:
                        isogon_x = s2_x;
                        isogon_y = s2_y + 10;
                        rotation_deg = [0, isogon_x, isogon_y];
                        break;
                    case 4:
                        isogon_x = s2_x;
                        isogon_y = s2_y + 10;
                        rotation_deg = [0, isogon_x, isogon_y];
                        break;

                }

                zr.addShape(new IsogonShape({
                    style: {
                        x: isogon_x,
                        y: isogon_y,
                        r: 10,
                        n: 3,
                        brushType: 'fill',
                        color: '#bf0008'          // rgba supported

                        // strokeColor : color.getColor(colorIdx++),   // getColor from default palette
                        // lineWidth : 9,
                        // text :'正n边形',
                        //  textPosition :'inside'
                    },
                    rotation: rotation_deg,
                    draggable: false,
                    hoverable: false,
                    clickable: false
                }));
            }

        }

        //直连线
        function drawLinksLines(node1, node2, color) { //node1, node2为group node
            var arrowCase = 1;
            var color = color == null ? 'rgba(220, 20, 60, 0.65)' : color;

            var node1Node = zr.storage.get(node1._nodeId);
            var node2Node = zr.storage.get(node2._nodeId);
            var node1_p = node1Node.position[0];
            var node2_p = node2Node.position[0];
            // var drawArrowBoolean= drawArrow==null?false:true;
            if (node2._x > node1._x && node2._y > node1._y) {
                /*
                 var s1_x=node1._x+node1._width+node1.position[0];
                 var s1_y=node1._y+node1._height+node1.position[1];
                 var s2_x=node2._x+node2.position[0];
                 var s2_y=node2._y-25+node2.position[1];
                 */

                var s1_x = node1._x + node1._width + node1_p;
                var s1_y = node1._y + node1._height;
                var s2_x = node2._x + node2_p;
                var s2_y = node2._y;
                arrowCase = 1;
            } else if (node2._y > node1._y && node2._x < node1._x) {
                /*
                 var s1_x=node1._x+node1.position[0];
                 var s1_y=node1._y+node1._height+node1.position[1];
                 var s2_x=node2._x+node2._width+node2.position[0];
                 var s2_y=node2._y-25+node2.position[1];
                 */
                var s1_x = node1._x + node1_p;
                var s1_y = node1._y + node1._height;
                var s2_x = node2._x + node2._width + node2_p;
                var s2_y = node2._y;
                arrowCase = 2;
            } else if (node2._y < node1._y && node2._x < node1._x) {
                /*
                 var s2_x=node2._x+node2._width+node2.position[0];
                 var s2_y=node2._y+node2._height+node2.position[1];
                 var s1_x=node1._x+node1.position[0];
                 var s1_y=node1._y-25+node1.position[1];
                 */
                var s2_x = node2._x + node2._width + node2_p;
                var s2_y = node2._y + node2._height;
                var s1_x = node1._x + node1_p;
                var s1_y = node1._y;
                arrowCase = 3;
            } else if (node2._y == node1._y) {
                if (node2._x > node1._x) {
                    /*
                     var s1_x=node1._x+node1._width+node1.position[0];
                     var s1_y=node1._y+node1.position[1];
                     var s2_x=node2._x+node2.position[0];
                     var s2_y=node2._y+node2.position[1];
                     */
                    var s1_x = node1._x + node1._width + node1_p;
                    var s1_y = node1._y;
                    var s2_x = node2._x + node2_p;
                    var s2_y = node2._y;
                } else {
                    /*
                     var s1_x=node1._x+node1.position[0];
                     var s1_y=node1._y+node1.position[1];
                     var s2_x=node2._x+node2._width+node2.position[0];
                     var s2_y=node2._y+node2.position[1];
                     */
                    var s1_x = node1._x + node1_p;
                    var s1_y = node1._y;
                    var s2_x = node2._x + node2._width + node2_p;
                    var s2_y = node2._y;
                }
            } else {
                /*
                 var s2_x=node2._x+node2.position[1];
                 var s2_y=node2._y+node2._height+node2.position[1];
                 var s1_x=node1._x+node1._width+node1.position[0];
                 var s1_y=node1._y-25+node1.position[1];
                 */
                var s2_x = node2._x + node2_p;
                var s2_y = node2._y + node2._height;
                var s1_x = node1._x + node1._width + node1_p;
                var s1_y = node1._y - 25;
                arrowCase = 4;
            }

            // 直线
            zr.addShape(new LineShape({
                id: node1._nodeId + '_' + node2._nodeId + "_line",
                style: {
                    xStart: s1_x,
                    yStart: s1_y,
                    xEnd: s2_x,
                    yEnd: s2_y,
                    strokeColor: color,
                    lineWidth: 1,
                    lineType: 'solid'   // default solid
                    //  text : 'line'
                },
                draggable: false,
                hoverable: false,
                clickable: false
            }));
            tempLines.push(node1._nodeId + '_' + node2._nodeId + "_line");

            zr.addShape(new CircleShape({
                id: node1._nodeId + '_' + node2._nodeId + "_c1",
                style: {
                    x: s1_x,
                    y: s1_y,
                    r: 8,
                    brushType: 'fill',
                    color: color          // rgba supported
                    //strokeColor : color.getColor(colorIdx++),  // getColor from default palette
                    //lineWidth : 5,
                    //text :'circle',
                    //textPosition :'inside'
                },
                draggable: false,
                hoverable: false,
                clickable: false
            }));
            tempNodes.push(node1._nodeId + '_' + node2._nodeId + "_c1");

            zr.addShape(new CircleShape({
                id: node1._nodeId + '_' + node2._nodeId + "_c2",
                style: {
                    x: s2_x,
                    y: s2_y,
                    r: 8,
                    brushType: 'fill',
                    color: color           // rgba supported
                    //strokeColor : color.getColor(colorIdx++),  // getColor from default palette
                    //lineWidth : 5,
                    //  text :'circle',
                    // textPosition :'inside'
                },
                draggable: false,
                hoverable: false,
                clickable: false
            }));

            tempNodes.push(node1._nodeId + '_' + node2._nodeId + "_c2");

        }

        //function  get relations --向上追溯pre-rel-node 一级， 下溯全部关联
        function getRelations(nodeId) { //nodeId 为group id

            var curNodeId = nodeId;
            var node = zr.storage.get(curNodeId);
            var pre_nodes = node._pre_rel_nodes;
            pre_nodes_temp = pre_nodes;

            var nodeKeys = [];
            var line_nodes = {};

            function findLinks(nodeId) {//nodeId 为group id
                var rel_nodes = [];//groupId
                //  var nodeId=nodeId;
                //  var node=zr.storage.get(nodeId);

                if ($.inArray(nodeId, nodeKeys) == -1) {
                    //var node=zr.storage.get(nodeId);
                    $.each(zrNodes, function (i, e) { //zrNodes,为groupId

                        var node = zr.storage.get(e);

                        if ($.inArray(nodeId.split('_')[0], node._pre_rel_nodes) != -1) {
                            rel_nodes.push(e);
                        }
                    });
                    // node._rel_nodes=rel_nodes;
                    line_nodes[nodeId] = rel_nodes;
                    nodeKeys.push(nodeId);
                    $.each(rel_nodes, function (i, e) {
                        findLinks(e);
                    });


                }
            }


            findLinks(curNodeId);
            line_nodes_temp = line_nodes;
            //全部节点灰度化，之后再遍历当前关联节点， opacity改成1
            $.each(zrNodes, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 0.3
                });

            });

            $.each(pre_nodes, function (i, e) {
                var node1 = zr.storage.get(curNodeId);
                var node2 = zr.storage.get(e + "_group");

                drawLinksLines(node1, node2, 'rgba(26, 186, 83, 0.65)');
                node1.eachChild(function (e) {
                    e.style.opacity = 1;
                });
                node2.eachChild(function (e) {
                    e.style.opacity = 1;
                });
            });


            $.each(line_nodes, function (startNode, targetNodes) {
                var node1 = zr.storage.get(startNode);
                $.each(targetNodes, function (i, targetNode) {
                    var node2 = zr.storage.get(targetNode);
                    drawLinksLines(node1, node2);
                    node2.eachChild(function (e) {
                        e.style.opacity = 1;
                    });
                });

                node1.eachChild(function (e) {
                    e.style.opacity = 1;
                });

            });

        }

        //html 事件
        //事件
        $('.canvas-wrapper').on('click', '#edit-node>a', function (e) {
            e.preventDefault();
            var target = $(this).closest('.node-info').attr("data-target");

            var node = zr.storage.get(target + '_group');


            //如果节点是完成状态， clone node不可拖动
            var dragable_status = node._status;
            node.eachChild(function (e) {
                e.draggable = dragable_status == "complete" ? false : true;
                e.clickable = false;
            });

            // node.draggable=zr.storage.get(target)._status=="complete"?false:true;
            // node.clickable=false;

            //清空目前元素，加入新元素
            insideHtml = $(this).closest('.node-info').html();
            // console.llog(insideHtml);
            $(this).closest('.node-info').fadeOut(function () {
                $(this).closest('.node-info').empty();
                var controlHtml = [
                    '<div class="ctrl clearfix">' ,
                    '<span class="scale" id="node-minus"><a href="">-</a></span>',
                    '<input type="text" id="date-change" value="0"/>',
                    '<span class="scale" id="node-plus"><a href="">+</a></span>',
                    '</div>',
                    '<div class="edit"><span id="confirm"><a href="">确认更改</a></span><span id="cancel"><a href="">取消</a></span></div>',
                    '<span class="arrow"></span>'
                ].join('');

                $(controlHtml).appendTo('.node-info');
                $('.node-info').fadeIn();

            });
        });

        ///confrim-cancel  -finish
        $('.canvas-wrapper').on('click', '#confirm-cancel>a', function (e) {
            e.preventDefault();

            var target = $(this).closest('.node-info').attr('data-target');
            var node = zr.storage.get(target + '_group');
            node.cur_x = 0;
            //恢复节点显示
            $.each(zrNodes, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 1
                });
            });

            $(this).closest('.node-info').fadeOut(function () {
                //清空clone数据
                // console.llog(this.id);
                //   zr.delShape(target+'_ghost');
                $.each(tempNodes, function (i, e) {
                    zr.delShape(e);
                });
                $.each(tempLines, function (i, e) {
                    zr.delShape(e);
                });
                $.each(date_nodes, function (i, e) {
                    zr.delShape(e);
                });
                //zr.update();
                tempNodes = [];
                tempLines = [];
                line_nodes_temp = undefined;
                pre_nodes_temp = [];
                date_nodes = [];
                $('.node-info').remove();
                //清空目前元素
            });
        });

        //取消按钮--finish
        $('.canvas-wrapper').on("click", '#cancel', function (e) {
            e.preventDefault();
            var target = $(this).closest('.node-info').attr('data-target');

            var node = zr.storage.get(target + '_group');

            //如果节点是完成状态， clone node不可拖动
            //  var dragable_status=node._status;
            node.eachChild(function (e) {
                e.draggable = false;
                e.clickable = true;
                e.position[0] -= node.cur_x * defalut_pix;
            });

            //恢复节点显示
            $.each(zrNodes, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 1
                });
            });

            $(this).closest('.node-info').fadeOut(function () {
                //清空clone数据
                // console.llog(this.id);
                //   zr.delShape(target+'_ghost');
                $.each(tempNodes, function (i, e) {
                    zr.delShape(e);
                });
                $.each(tempLines, function (i, e) {
                    zr.delShape(e);
                });
                $.each(date_nodes, function (i, e) {
                    zr.delShape(e);
                });
                //zr.update();
                tempNodes = [];
                tempLines = [];
                line_nodes_temp = undefined;
                pre_nodes_temp = [];
                date_nodes = [];
                $('.node-info').remove();

                //清空目前元素
            });

        });
        //confirm按钮  --ajax交互部分
        $('.canvas-wrapper').on("click", '#confirm', function (e) {
            e.preventDefault();
            /*显示所有更改信息 改成modal形式
             $(this).closest('.node-info').fadeOut(function () {
             $(this).closest('.node-info').empty().append(insideHtml).fadeIn();
             });
             */

            var target = $(this).closest('.node-info').attr("data-target");
            var node = zr.storage.get(target + '_group');

            //恢复节点操作状态
            var dragable_status = node._status;
            node.eachChild(function (e) {
                e.draggable = false;
                e.clickable = true;
            });

            // node.style.x = oriX+curVal*default_pix;

            //根据target节点判断所有节点的最终状态---发送sendData 数据，ajax 回调更新
            //var sendData=[];
            //updateData(sendData,1);//ajax回调；
            //realNode重绘
            //根据target节点判断所有节点的最终状态
            var wconfirm = window.confirm('确认更改？');
            if (wconfirm) {
                // alert(this.childAt(0).position[0]/defalut_pix)
                //发送节点数据-------
                var sendData = [];
                var curNode_id=$(this).closest(".node-info").attr('data-target');
                var curNode=zr.storage.get(curNode_id);

                sendData.push({
                    "node_id": curNode_id,
                    'node_name':curNode._name,
                    "move": parseInt(curNode.position[0] / defalut_pix),
                    "start_date":curNode._start_date,
                    'isStartNode': true
                });

                var showTag = false;//用showTag来展示回调成功，对节点进行重绘
                updateData(sendData, 1);

            }//end if(wconfirm)
            else {
                var curNode_id=$(this).closest(".node-info").attr('data-target');

                var curNode=zr.storage.get(curNode_id+'_group');
                curNode.eachChild(function (e) {
                    e.position[0] = 0;
                });
            }

            //end-modal

            //恢复节点显示
            $.each(zrNodes, function (i, e) {
                //node.style.opacity=0.3;
                var node = zr.storage.get(e);
                node.eachChild(function (e) {
                    e.style.opacity = 1
                });
            });


            //处理结束后清空clone数据
            $(this).closest('.node-info').fadeOut(function () {
                //清空clone数据
                $.each(tempNodes, function (i, e) {
                    zr.delShape(e);
                });
                $.each(tempLines, function (i, e) {
                    zr.delShape(e);
                });
                $.each(date_nodes, function (i, e) {
                    zr.delShape(e);
                });
                //zr.update();
                tempNodes = [];
                tempLines = [];
                line_nodes_temp = undefined;
                pre_nodes_temp = [];
                date_nodes = [];
                $('.node-info').remove();

                //清空目前元素
            });
        });
        //minus plus


        $('.canvas-wrapper').on('keyup', '#date-change', function (e) {
            clearTimeout(keyTimeOut);
            var keyTimeOut = setTimeout(function (e) {

                var curVal = parseInt($('#date-change').val()) ? parseInt($('#date-change').val()) : 0;
                var target = $('.node-info').attr('data-target');

                //  var ori=0;//根据与最初点的差值进行修改
                var node = zr.storage.get(target + '_group');


                var ori_posX = node.childAt(0).position[0];


                //根据与最初点的差值进行修改

                if (node.cur_x != undefined) {
                    var ori = node.cur_x;
                } else {
                    var ori = 0;
                }

                var ani_x = (curVal - ori) * defalut_pix;
                node.cur_x = curVal;
                var cur_x = ori_posX + ani_x;

                node.eachChild(function (e) {
                    e.position[0] = cur_x;
                    zr.modShape(e);
                });

                //同时更新.node-info的left位置。
                //alert($(".node-info").css("left"));
                var left = parseInt($(".node-info").css("left"));
                $(".node-info").css("left", left + ani_x);

                $.each(pre_nodes_temp, function (i, e) {
                    var preNode = zr.storage.get(target + '_' + e + '_' + "c1");
                    var preLine = zr.storage.get(target + '_' + e + '_' + 'line');
                    preNode.position[0] += ani_x;
                    preLine.style.xStart += ani_x;
                });

                var line_nodes = line_nodes_temp[target + '_group'];

                $.each(line_nodes, function (i, e) {
                    var lineNode = zr.storage.get(target + '_' + e.split('_')[0] + '_' + "c1");
                    var linkLine = zr.storage.get(target + '_' + e.split('_')[0] + '_' + 'line');
                    lineNode.position[0] += ani_x;
                    linkLine.style.xStart += ani_x;
                });

                //更新日期
                $.each(date_nodes, function (i, e) {
                    var date_node = zr.storage.get(e);
                    date_node.position[0] += ani_x;
                });

                //更新日期 显示
                var date_node = zr.storage.get(target + "_date");
                date_node.style.text = getDate(node._start_date, curVal);

                zr.refreshNextFrame();
            }, 350);
        });
        $('.canvas-wrapper').on("click", '#node-minus', function (e) {
            //这里最终确认后写整体方法，--minus--plus 公用
            e.preventDefault();
            e.stopPropagation();
            var val = parseInt($('#date-change').val()) ? parseInt($('#date-change').val()) : 0;

            $('#date-change').val(val - 1);
            var curVal = parseInt($('#date-change').val());

            //这里最终确认后写整体方法，--minus--plus 公用
            var target = $('.node-info').attr('data-target');

            //  var ori=0;//根据与最初点的差值进行修改
            var node = zr.storage.get(target + '_group');

            var ori_posX = node.childAt(0).position[0];


            //根据与最初点的差值进行修改

            if (node.cur_x != undefined) {
                var ori = node.cur_x;
            } else {
                var ori = 0;
            }

            var ani_x = (curVal - ori) * defalut_pix;
            node.cur_x = curVal;
            var cur_x = ori_posX + ani_x;


            node.eachChild(function (e) {
                e.position[0] = cur_x;
                zr.modShape(e);
            });

            //同时更新.node-info的left位置。
            //alert($(".node-info").css("left"));
            var left = parseInt($(".node-info").css("left"));
            $(".node-info").css("left", left + ani_x);

            $.each(pre_nodes_temp, function (i, e) {
                var preNode = zr.storage.get(target + '_' + e + '_' + "c1");
                var preLine = zr.storage.get(target + '_' + e + '_' + 'line');
                preNode.position[0] += ani_x;
                preLine.style.xStart += ani_x;
            });

            var line_nodes = line_nodes_temp[target + '_group'];

            $.each(line_nodes, function (i, e) {
                var lineNode = zr.storage.get(target + '_' + e.split('_')[0] + '_' + "c1");
                var linkLine = zr.storage.get(target + '_' + e.split('_')[0] + '_' + 'line');
                lineNode.position[0] += ani_x;
                linkLine.style.xStart += ani_x;
            });
            //更新日期
            $.each(date_nodes, function (i, e) {
                var date_node = zr.storage.get(e);
                date_node.position[0] += ani_x;
            });
            //更新日期 显示
            var date_node = zr.storage.get(target + "_date");
            date_node.style.text = getDate(node._start_date, curVal);

            zr.refreshNextFrame();

        });
        $('.canvas-wrapper').on("click", '#node-plus', function (e) {
            //这里最终确认后写整体方法，--minus--plus 公用
            e.preventDefault();
            e.stopPropagation();
            //  alert('test');
            var val = parseInt($('#date-change').val());

            $('#date-change').val(val + 1);
            var curVal = parseInt($('#date-change').val());
            //这里最终确认后写整体方法，--minus--plus 公用
            var target = $('.node-info').attr('data-target');

            //  var ori=0;//根据与最初点的差值进行修改
            var node = zr.storage.get(target + '_group');

            var ori_posX = node.childAt(0).position[0];


            //根据与最初点的差值进行修改

            if (node.cur_x != undefined) {
                var ori = node.cur_x;
            } else {
                var ori = 0;
            }

            var ani_x = (curVal - ori) * defalut_pix;
            node.cur_x = curVal;
            //原来位置 + 偏移位置
            var cur_x = ori_posX + ani_x;

            node.eachChild(function (e) {
                e.position[0] = cur_x;
                zr.modShape(e);
            });

            //同时更新.node-info的left位置。
            //alert($(".node-info").css("left"));
            var left = parseInt($(".node-info").css("left"));
            $(".node-info").css("left", left + ani_x);

            $.each(pre_nodes_temp, function (i, e) {
                var preNode = zr.storage.get(target + '_' + e + '_' + "c1");
                var preLine = zr.storage.get(target + '_' + e + '_' + 'line');
                preNode.position[0] += ani_x;
                preLine.style.xStart += ani_x;
            });

            var line_nodes = line_nodes_temp[target + '_group'];

            $.each(line_nodes, function (i, e) {
                var lineNode = zr.storage.get(target + '_' + e.split('_')[0] + '_' + "c1");
                var linkLine = zr.storage.get(target + '_' + e.split('_')[0] + '_' + 'line');
                lineNode.position[0] += ani_x;
                linkLine.style.xStart += ani_x;
            });
            //更新日期
            $.each(date_nodes, function (i, e) {
                var date_node = zr.storage.get(e);
                date_node.position[0] += ani_x;
            });
            //更新日期 显示
            var date_node = zr.storage.get(target + "_date");

            date_node.style.text = getDate(node._start_date, curVal);

            zr.refreshNextFrame();
        });

        //按节点激活--click--选择重复节点，暂时没做
        /*
         $('.canvas-wrapper').on("click",'.node-select',function(e) {
         e.preventDefault();
         var node_id=$(this).attr('id');
         cur_op_node=node_id+'_clone';
         var opNode= zr.storage.get(node_id);

         opNode.dispatch('click');


         });
         */

        //end html事件


        //全局zr事件

        $("#level-filter a").on("click",function(e){
            e.preventDefault();

            var target_level=parseInt($(this).attr("id").split('-')[2]);


            $.each(zrNodes,function(i,node_group){

                var nodeGroup=zr.storage.get(node_group);

                if( parseInt(nodeGroup._level)>target_level && target_level!=0){

                    nodeGroup.eachChild(function(e){
                        e.style.opacity =0;
                    });
                }else {

                    nodeGroup.eachChild(function (e) {
                        e.style.opacity = 1;
                    });
                 }
            });
            zr.render();
        });
        $('.time-arrow-left').on('click',function(e){

            var layer_position=zr.painter.getLayer("0").position;

            var layer_position_x=layer_position[0];
            var layer_position_y=layer_position[1];

            zr.modLayer('0',{position:[layer_position_x-100,layer_position_y]});

            zr.refreshNextFrame();
        });


        zr.on('click', function (params) {
            var node_id = $(".node-info").attr("data-target");

            if (params.target) {
            }
            else {

                if (node_id != undefined) {
                    var node = zr.storage.get(node_id + '_group');
                    node.eachChild(function (e) {

                        e.clickable = true;
                        e.draggable = false;
                        if (node.cur_x != undefined) {
                            e.position[0] -= node.cur_x * defalut_pix;

                        }

                    });
                }
                //恢复节点显示
                $.each(zrNodes, function (i, e) {
                    //node.style.opacity=0.3;
                    var node = zr.storage.get(e);
                    node.eachChild(function (e) {
                        e.style.opacity = 1
                    });
                });

                $.each(tempNodes, function (i, e) {
                    zr.delShape(e);
                });
                $.each(tempLines, function (i, e) {
                    zr.delShape(e);
                });
                $.each(date_nodes, function (i, e) {
                    zr.delShape(e);
                });
                //zr.update();
                tempNodes = [];
                tempLines = [];
                line_nodes_temp = undefined;
                date_nodes = [];
                pre_nodes_temp = [];
                $('.node-info').remove();
            }
        });

        function updateData(sendData,i) {
            var send_data = sendData;
            var url = '';

            $([
                '<tr>',
                '<td>',
                send_data[0]['node_name'] ,
                '</td>',
                '<td>',
                send_data[0]['node_id'].split('_')[0],
                '</td>',
                '<td>',
                send_data[0]['start_date'],
                '</td>',
                '<td>',
                send_data[0]['move'],
                '</td>',
                '</tr>'
            ].join('')).appendTo('#info-modal tbody');
            $('#info-modal').modal('show');

            /*
             $.ajax({
             url:url,
             type:"POST",
             //data:"data=1",
             //data:"data="+JSON.stringify(init_data_level1).replace(/\"/g,"'"),
             data:send_data[0],
             success:function(data,status) {
             //data格式 {K,v} [{node_id:'' , node_move:''}, {node_id:'' , node_move:''}, ]
             $.each(data,function(i,node_data){
             var node_data=node_data;
             var node=zr.storage.get(node_data['node_id']);
             node.style.x += parseInt(node_data['node_move'])*defalutPix;
             });
             var cur_data_x=send_data['move'];
             var start_node=zr.storage.get(send_data['node_id']);
             start_node.position[0]=0;
             start_node.style.x += cur_data_x*defalutPix;

             //清空clone数据
             $.each(tempNodes,function(i,e){
             zr.delShape (e);
             });
             $.each(tempLines, function (i, e) {
             zr.delShape(e);
             });
             $.each(date_nodes,function(i,e){
             zr.delShape(e);
             });
             //zr.update();
             tempNodes = [];
             tempLines=[];
             line_nodes_temp=undefined;
             pre_nodes_temp=[];
             date_nodes=[];
             $('.node-info').remove();
             //清空目前元素
             //显示更新状态
             $.each(data,function(i,e){
             if(icount>=5){
             return false;
             }else{
             var baseNode=zr.storage.get(e['node_id']);
             //   var realNode=zr.storage.get(e['node_id']+"_real");
             var nodeName=baseNode._name;

             $([
             '<tr>',
             '<td>',
             nodeName,
             '</td>',
             '<td>',
             baseNode.id,
             '</td>',
             '<td>',
             baseNode._start_date,
             '</td>',
             '<td>',
             parseInt(e.move),
             '</td>',
             '</tr>'
             ].join('')).appendTo('#info-modal tbody');
             icount+=1;
             }
             });


             $('#info-modal').modal('show');//end-modal
             },
             error:function(data,status) {
             //data格式
             zr.storage.get(send_data['node_id']).position=0;
             alert('存储失败，请重试');

             }
             });
             */
            //end ajax
            //清空clone数据
            $.each(tempNodes,function(i,e){
                zr.delShape (e);
            });
            $.each(tempLines, function (i, e) {
                zr.delShape(e);
            });
            $.each(date_nodes,function(i,e){
                zr.delShape(e);
            });
            //zr.update();
            tempNodes = [];
            tempLines=[];
            line_nodes_temp=undefined;
            pre_nodes_temp=[];
            date_nodes=[];
            $('.node-info').remove();
            //清空目前元素
        }//end updateData;
        //事件
    });  //end require zrender;

//ajax 发送数据，
    /*
     sendData.push({
     "node_id":this.id.split('_clone')[0],
     "move":parseInt(this.position[0]/default_pix),
     'isStartNode':true
     });

    $(".canvas-wrapper").on("click",".project-name",function(e){
        $(this).closest(".canvas-wrapper").fadeOut();
        window.location.href='level2.html';
    });

    $('.time-arrow-right').on('click',function(e){
        var tLeft=$('.canvas-wrapper').scrollLeft()+100;
        $('.canvas-wrapper').scrollLeft(tLeft);
        var scrollX=parseInt($(".canvas-wrapper").scrollLeft());
    });

    $('.time-arrow-left').on('click',function(e){
        var tLeft=$('.canvas-wrapper').scrollLeft()-100;
        $('.canvas-wrapper').scrollLeft(tLeft);
        var scrollX=parseInt($(".canvas-wrapper").scrollLeft());
    });
     */
}
//end level_init
$(document).ready(function(){
    init_data();
    level_init();
});
