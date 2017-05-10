/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","./data_init","./render_nodes","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group"],
    function($,zrender,graph,data,nodesRender){

        var project_start=data.start_date;//todo:起始日期，视数据接口情况改成动态值--后面用phase的值重新赋给
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
        function _init_project(zrObject,w,nodes,typeList) {
            var zr = zrObject;
            var project_count = 0;
            var project_y = 80;//绘制y高度的起始位置，随着遍历project累加project 高度

            var startOffset=graph.startOffset;

            var projectStart,projectEnd;

            //todo: data init
            data.init(nodes);
            nodesRender.init(zr);


            $.each(data.rows, function (i, e) {
                //e:project
                var project = e;
                //todo:这里的start_date在node绘图中会用到，为了避免冗余传值,每个project遍历是附加上一个属性start_date
                project.start_date=project_start;

                var id = project.id;

                var startNode_x = startOffset;//偏移量
                var endNode_x = w - startOffset;

                if(i==0){
                    var startNode_y = project["height"] + project_y;
                }else{
                    var startNode_y = project["height"] + project_y;
                }

                //标记project_y为新的位置，作为下级的起点
                project_y = startNode_y;
                var endNode_y = startNode_y;

                //绘制背景线段--底部分割线
                zr.addShape(new LineShape({
                    style: {
                        xStart: startNode_x,
                        yStart: startNode_y,
                        xEnd: endNode_x+startOffset,
                        yEnd: endNode_y,
                        strokeColor: "#ddd",
                        lineWidth: 1,
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
                //init_nodes(zr,project);
                //todo:nodesRender
                console.log("project--------------------------------"+project.name);
                console.log(project.nodes);
                console.log("project--------------------------------")
                nodesRender.render(zr,project);

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

        projectRender.render=function(nodes,typeList,phase){
            //根据日期设置 初始化画布和时间轴宽度

            //todo: x轴计算宽度加30是把左侧栏的宽度计算上,统一用graph.startOffset来设定
            //var w=(graph.init_status.status4.x_end-graph.init_status.status0.x_start)*(graph.defaultPix)+graph.startOffset*2+30;
            var typeList=typeList;
            //var w=(graph.init_status.status4.x_end-graph.init_status.status0.x_start)*(graph.defaultPix)+graph.startOffset;
            var start=phase.scheduleStartDate;
            var end=phase.scheduleEndDate;

            var project_start_date=new Date(start-50*24*60*60*1000);//todo:起始点向前偏移50天

            project_start=project_start_date.getFullYear()+"-"+(project_start_date.getMonth()+1)+"-"+project_start_date.getDate();



            data.rows=[];
            $.each(typeList,function(k,v){
                data.rows.push({
                    id: "type"+k,
                    name : v,
                    index:(k-1),
                    height:150,
                    offset:30,
                    cur_done:0,
                    description:v,
                    nodes:[]
                })
            });
            //todo: 这里对data.rows,多添加一个备注节点为了底部留出弹出框位置；
            data.rows.push({
                id: "type"+"_commits",
                name : "备注",
                index:"commits",
                height:200,
                offset:30,
                cur_done:0,
                description:"备注",
                nodes:[]
            })

            //todo:w根据传入的起始值计算，前后各加50天；
            var dateRange=Math.ceil((end-start)/(24*60*60*1000))+50+50;
            var w=dateRange*(graph.defaultPix)+graph.startOffset;

            var typeList=typeList;
            var h=80;
            $.each(data.rows,function(i,e){
                h+=e.height;
            });
            var main = document.getElementById('main');

            main.style.width = w+ 'px';
            main.style.height = h + 'px';

            $("#date-index").css({
                "width": w + 'px',
                "padding-left": (graph.startOffset)+ 'px',
                //"padding-right": graph.startOffset + 'px'
            });

            //设置绘制基本变量
            var start_offset = graph.startOffset;//startOffset为绘图时考虑dom定位产生的差异做的调节变量，默认为0；

            var default_pix = graph.defaultPix;//每天代表的像素单位，默认为4，根据调节变大（根据点的大小，如果日期点精确表示天的话，默认像素大小需要为20-30px
            var day_offset = graph.dayOffset;//日期偏移量，在绘图时辅助绘图起始位置计算

            var zr = zrender.init(document.getElementById("main"));
            localStorage.zr=zr.getId();
            //横向阶段绘制
            //todo:这里根据总宽度设置init_bg ,每200天绘制一段，取消项目阶段的绘制。
            //var init_bg = graph.init_status;
            //var statusLength=getDateLength(project_start,project_end);


            var len=Math.ceil(dateRange/200);
            console.log("len----------------"+len);
            var init_bg={};
            for(i=0;i<len;i++){
                var bgStr=((i+1)%2==0?"#fff":"#f6f6f6");
                if(i==(len-1)){
                    init_bg["status"+i]={
                        id:"status"+i,
                        name:"",
                        //key_point:"土地摘牌",
                        x_start:i*200-200,
                        x_end:dateRange-200,
                        scale:1,
                        bg:bgStr,
                    }
                }else{
                    init_bg["status"+i]={
                        id:"status"+i,
                        name:"",
                        //key_point:"土地摘牌",
                        x_start:i*200-200,
                        x_end:i*200,
                        scale:1,
                        bg:bgStr,
                    }
                }
            }

            console.log("init-bg---------------------");
            console.log(init_bg);

            $.each(init_bg, function (k, v) {
                var x_start = (v.x_start + day_offset) * default_pix + start_offset;
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
                        strokeColor : "#e5e5e5",
                        lineWidth : 1,
                        lineType : 'solid'    // default solid
                        //text : 'line'
                    },

                    draggable : false,
                    hoverable:false,
                    clickable:false
                }));
                //
                //todo：取消文本背景
               /* zr.addShape(new RectangleShape({
                    style : {
                        x : x_start ,
                        y :1,
                        width :rect_width+2,
                        height: 30,
                        //  radius: [20, 50],
                        //brushType : "",
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
                }));*/
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
                            x : getDateOffset(project_start,curDate_point)*default_pix+start_offset,
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
                            x :getDateOffset(project_start,curDate_point)*default_pix+start_offset-41,
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
            _init_project(zr,w,nodes,typeList);
            //绘制当前的时间点
            _render_curDate(zr);

            //绘画
            zr.render();
    };

        projectRender.init=function(nodes,typeList,phase){
            //数据过滤
           //渲染
            console.log("typeList======================");
            console.log(typeList);
           projectRender.render(nodes,typeList,phase);


    };


        return projectRender;
});