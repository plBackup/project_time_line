
/**
 * Created by whobird on 17/5/3.
 */
//全部节点灰度化，之后再遍历当前关联节点， opacity改成1
$.each(zrNodes, function (i, e) {
    //node.style.opacity=0.3;
    var node = zr.storage.get(e);
    node.eachChild(function (e) {
        e.style.opacity = 0.3
    });

});

//节点信息显示
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
