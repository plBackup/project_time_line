/**
 * Created by whobird on 17/4/28.
 */
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
