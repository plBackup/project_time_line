/**
 * Created by whobird on 17/4/28.
 */
//初始化 nodes方法，应用于初始化project内部
function init_nodes(projectObject) {

    var zrNodes = []; //为group_id ---因为计算方便，后改成gorup_id的方式
    var zrGroup = [];//为group_id

    var project = projectObject; //project 绘图中确认了project 项目的startNode_Y的位置，可以为节点复用 ---一级只绘制主节点 draggable:false, hoverable:true, clickable:true
    var nodes = project["nodes"];

    var level1_radius = 6;
    var level2_radius = 6;

    var normal_color = "#92cddc";
    var done_color = "#439139";
    var delay_color = "#ad2726";

    $.each(nodes, function (i, e) {

        if(e['scheduleStartDate']=='' || e['scheduleStartDate']==null || e['scheduleStartDate']==undefined){
            //如果节点未提供开始日期数据，则根据前一个节点推算
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
        //根据startdate 确认x位置 数据提供的是scheduleStartDate
        e['start_date']=e['scheduleStartDate'];
        style_x = getDateOffset(project_start, e['start_date']) * defalut_pix;

        //如果没有数据，根据之前关联点的位置+ 100来绘制style_x;
        //id
        var y_plus = 0;
        var ix = 0;

        //当节点位置产生重叠时，要产生纵向偏移来防止遮挡
        $.each(zrNodes, function (i, node) {
            var zrNode_group = zr.storage.get(node);
            // var zrNode=zr.storage.get(node.split("_")[0]+'_id');
            var zrNode = zrNode_group.childAt(0);

            ix += 1;

            //这里根据真实数据会出现后面节点再时间轴前面显示的问题，所以做双倍距离来判断
            var inside = zrArea.isInside(zrNode,
                {x: (zrNode_group.position[0] + zrNode.style.x - 88), y: (zrNode_group.position[1] + zrNode.style.y - 5), width: zrNode.style.width * 2, height: zrNode.style.height},
                style_x, project.node_y + e.y_offset + y_plus + 120);

            if (inside) {
                //这里加入对c._level的判断，如果circleArea._level=1，把之前不等于1的点设为不可见
                y_plus += 25;
            }

        });

        //遍历后加入新的节点id,目前两个数据有重合，重构需注意重新整合
        zrNodes.push(e['id'] + '_group');
        zrGroup.push(e['id'] + '_group');

        //对每个节点集合建立group，方便同时改变。
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
                _y_plus: y_plus,
                onclick: function (params) {

                },//end on click function

            }
        );

        //var radius, color, style_x;
        var radius, color, text_color;

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
                    //y: project.node_y+ e.y_offset+120,
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
                    textFont: 'bold 12px verdana',
                    textAlign: 'center',
                    textBaseline: 'middle',
                    textColor: text_color
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
            }
        ));//add cricle

        //把group加入到zr中
        zr.addGroup(g);
        //zr.update();
    });//end each nodes

}
