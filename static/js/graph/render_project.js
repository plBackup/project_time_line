/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","./data_init","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group"],
    function($,zrender,graph,data){

        var project_start=data.start_date;//起始日期，视数据接口情况改成动态值
        console.log("zrender---------");
        var projectRender={};

        var color = require('zrender/tool/color');
        var RectangleShape = require('zrender/shape/Rectangle');
        var LineShape = require('zrender/shape/Line');
        var IsogonShape = require('zrender/shape/Isogon');
        var Group = require('zrender/Group');
        var TextShape = require('zrender/shape/Text');
        var Layer=require('zrender/Layer');


        //简化变量

        var getDateOffset=graph.getDateOffset;
        var default_pix=graph.defaultPix;
        var start_offset=graph.startOffset;
        var getDate=graph.getDate;
        var gd=graph.gd;
        //初始化project
        function _init_project(zrObject,w) {
            var zr = zrObject;
            var project_count = 0;
            var zrWidth = zr.getWidth();
            console.log("zrWidth------------------------------------------------");
            console.log(zrWidth);
            var project_y = 30;//绘制y高度的起始位置，随着遍历project累加project 高度

            var startOffset=graph.startOffset;

            $.each(data.rows, function (i, e) {
                //e:project
                var project = e;
                var id = project.id;

                var startNode_x = startOffset;//偏移量
                var endNode_x = w - startOffset;
                var startNode_y = project["height"] + project_y;
                console.log("startNode_y========================="+  startNode_y+"---"+endNode_x);
                //标记project_y为新的位置，作为下级的起点
                project_y = startNode_y;
                var endNode_y = startNode_y;

                //绘制背景线段--底部分割线
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


                //添加项目名称 --左侧--绝对定位，以便永远浮动在最上层
                $('<div class="project-name" id="' + id + '">' + project.name + '</div>').appendTo("#project-index").css({
                    "top": startNode_y - project['height'] / 2 - 15,
                    "left": -project['height'] / 2 + 15,
                    "width": project['height'],
                    "height": 30
                });

                project.node_y = startNode_y - project['height'];//为顶部的高度30px;

                //绘制nodes方法；
                //init_nodes(project);

                project_count += 1;
            });
        }//end 初始化project

        //绘制当前的时间点
        function _render_curDate(zrObject){
            var zr=zrObject;
            //绘制当前的时间点
            var startDate=new Date();
            var curDate=startDate;

            var d=new Date(curDate);
            var curDate_String= d.getFullYear()+'-'+ (parseInt(d.getMonth())+1)+'-'+ d.getDate();


            
            //正三角形 绘制指针
            zr.addShape(new IsogonShape({
                style : {
                    x : getDateOffset(project_start,curDate_String)*default_pix+start_offset,
                    y : 40,
                    r : 10,
                    n : 3,
                    brushType : 'fill',
                    color : '#ff8113'          // rgba supported
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
                    x :getDateOffset(project_start,curDate_String)*default_pix+start_offset-41,
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
                    xStart :getDateOffset(project_start,curDate_String)*default_pix+start_offset,
                    yStart : 0,
                    xEnd :getDateOffset(project_start,curDate_String)*default_pix+start_offset,
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
        }//end 绘制当前的时间点

        projectRender.render=function(){
            //根据日期设置 初始化画布和时间轴宽度
            //x轴计算宽度加30是把左侧栏的宽度计算上
            var w=(graph.init_status.status4.x_end-graph.init_status.status0.x_start)*(graph.defaultPix)+graph.startOffset*2+30;
            console.log("w=========="+w);
            var canvas_w =parseInt( $(".navbar").css("width"));
            var mainTop=88;
            var canvas_h = document.documentElement.clientHeight- mainTop;
            var h=30;
            $.each(data.rows,function(i,e){
                h+=e.height;
            });
            var main = document.getElementById('main');

            main.style.width = w+ 'px';
            main.style.height = h + 'px';

            $("#date-index").css({
                "width": w + 'px',
                "padding-left": (graph.startOffset+30)+ 'px',
                "padding-right": graph.startOffset + 'px'
            });

            //设置绘制基本变量
            var start_offset = graph.startOffset;//startOffset为绘图时考虑dom定位产生的差异做的调节变量，默认为0；
            var init_bg = graph.init_status;
            var default_pix = graph.defaultPix;//每天代表的像素单位，默认为4，根据调节变大（根据点的大小，如果日期点精确表示天的话，默认像素大小需要为20-30px
            var day_offset = graph.dayOffset;//日期偏移量，在绘图时辅助绘图起始位置计算

            var zr = zrender.init(document.getElementById("main"));

            //横向阶段绘制
            $.each(init_bg, function (k, v) {
                var x_start = (v.x_start + day_offset) * default_pix + start_offset+30;
                var rect_width = (v.x_end - v.x_start) * default_pix;


                var d_plus = 20;//每20天标注一个日期节点
                var d_width = d_plus * default_pix;
                var d_count = parseInt(rect_width / d_width);
                for (i = 0; i < d_count; i++) {
                    var d = v.x_start + d_plus * i;
                    $('<span class="date-day" id="' + v.id + '-' + i + '">'+"<i>" + d+"</i>" + '</span>').appendTo("#date-index").css("width", d_width + "px");
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
                //
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
                        lineWidth : 0,
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
                var dateline_width = dateline_plus * default_pix;
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
                            x : getDateOffset(project_start,curDate_point)*default_pix+start_offset+30,
                            y : 43,
                            r : 10,
                            n : 3,
                            brushType : 'fill',
                            color :color_draw        // rgba supported

                        },

                        draggable : false,
                        hoverable:false,
                        clickable:false
                    }));
                    //绘制日期
                    zr.addShape(new RectangleShape({
                        style : {
                            x :getDateOffset(project_start,curDate_point)*default_pix+start_offset-41+30,
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

                // 文本

                zr.addShape(new TextShape({
                    style : {
                        x : x_start+rect_width / 2 ,
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
                    },
                    rotation:[Math.PI*3/2,x_start+rect_width-10,95],
                    draggable : false,
                    hoverable:false,
                    clickable:false
                }));



            });

            //绘制项目分割；
            _init_project(zr,w);
            //绘制当前的时间点
            _render_curDate(zr);

            //绘画
            console.log(zr);
            zr.render();
    };

        projectRender.init=function(nodes){
           console.log("project render -----init===========================");
            //数据过滤
            console.log(nodes);
           //渲染
           projectRender.render();

    };


        return projectRender;
});