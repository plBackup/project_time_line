/**
 * Created by whobird on 17/4/26.
 */

define(["jquery"],function($){
   var data={};
    data.rows=[
        {
            id: "type0",
            name : "设计",
            index:0,
            height:620,
            offset:50,
            cur_done:0,
            description:"设计",
            nodes:[]
        },
        {
            id: "type1",
            name : "营销",
            index:1,
            height:300,
            offset:50,
            cur_done:0,
            description:"营销",
            nodes:[]
        },
        {
            id: "type2",
            name : "成本",
            index:2,
            height:550,
            offset:50,
            cur_done:0,
            description:"成本",
            nodes:[]
        },
        {
            id: "type3",
            name : "工程",
            index:3,
            height:620,
            offset:50,
            cur_done:0,
            description:"工程",
            nodes:[]
        },
        {
            id: "type4",
            name : "证照/政府",
            index:4,
            height:700,
            offset:50,
            cur_done:0,
            description:"证照/政府",
            nodes:[]
        },
        {
            id: "type5",
            name : "商业及其他",
            index:5,
            height:700,
            offset:50,
            cur_done:0,
            description:"商业及其他",
            nodes:[]
        },
        {
            id: "type6",
            name : "备注",
            index:5,
            height:150,
            offset:50,
            cur_done:0,
            description:"备注",
            nodes:[]
        }

    ];
    //todo
    data.start_date="2014-01-01";
    data.cur_day=0;//当前时间节点 蓝线绘制代表当前状态
    data.nodes=[];

    data.init=function(nodes){
        _init_data(nodes);
    }

    function _init_data(nodes){
        var nodes=nodes;

        var nodeList={};
        $.each(data.rows,function(i,e){
            nodeList["node"+i]=[];
        });

        $.each(nodes,function(n,value){
            //value.x=jsX(value.id,0);
            //value.x_=jsX(value.id,0);
            //这里计算节点的起始位置，新的设计里面后台取数据；
            //根据日期偏移量取得节点的日期， 在新作计划时，只要建立起始点的位置即可确认时间轴 ---
            //value.start_date=DateAdd("d",value.x,start_date1);
            //value.end_date=DateAdd("d",value.x+value.last,start_date1);
            var nodeIndex=parseInt(value.type-1);
            if(typeof nodeList["node"+nodeIndex]!=="undefined"){
                nodeList["node"+nodeIndex].push(value);
            }else{
                console.log("value type=======");
                console.log(value.type);
            }
        });

        $.each(data.rows,function(i,e){
            data.rows[i].nodes=nodeList["node"+i];
        });
    };



    return data;
});




