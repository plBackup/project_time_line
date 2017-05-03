
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