/**
 * Created by whobird on 17/4/26.
 */

define([jQuery],function($){
   var data={};
    data.rows=[
        {
            id: "project1",
            name : "设计",
            index:0,
            height:620,
            offset:50,
            cur_done:0,
            description:"设计",
            nodes:[]
        },
        {
            id: "project2",
            name : "营销",
            index:1,
            height:300,
            offset:50,
            cur_done:0,
            description:"营销",
            nodes:[]
        },
        {
            id: "project3",
            name : "成本",
            index:2,
            height:550,
            offset:50,
            cur_done:0,
            description:"成本",
            nodes:[]
        },
        {
            id: "project4",
            name : "工程",
            index:3,
            height:620,
            offset:50,
            cur_done:0,
            description:"工程",
            nodes:[]
        },
        {
            id: "project5",
            name : "证照/政府",
            index:4,
            height:700,
            offset:50,
            cur_done:0,
            description:"证照/政府",
            nodes:[]
        },
        {
            id: "project6",
            name : "商业及其他",
            index:5,
            height:700,
            offset:50,
            cur_done:0,
            description:"商业及其他",
            nodes:[]
        },
        {
            id: "project7",
            name : "备注",
            index:5,
            height:150,
            offset:50,
            cur_done:0,
            description:"备注",
            nodes:[]
        }

    ];
    data.start_date="2015-01-01";
    data.cur_day=0;//当前时间节点 蓝线绘制代表当前状态
    data.nodes=[];

    data.init=function(nodes){
        _init_data(nodes);
    }

    function _init_data(nodes){
        var nodes=nodes;
        var project1={},project2={},project3={},project4={},project5={},project6={},project7={},project8={};
        var node1=new Array(),node2=new Array(),node3=new Array(),node4=new Array(),node5=new Array(),node6=new Array(),node7=new Array(),node8=new Array();
        $.each(nodes,function(n,value){
            //value.x=jsX(value.id,0);
            //value.x_=jsX(value.id,0);
            //这里计算节点的起始位置，新的设计里面后台取数据；
            //根据日期偏移量取得节点的日期， 在新作计划时，只要建立起始点的位置即可确认时间轴 ---
            //value.start_date=DateAdd("d",value.x,start_date1);
            //value.end_date=DateAdd("d",value.x+value.last,start_date1);
            switch (value.projectId) {
                case "project1":
                    node1.push(value);
                    break;
                case "project2":
                    node2.push(value);
                    break;
                case "project3":
                    node3.push(value);
                    break;
                case "project4":
                    node4.push(value);
                    break;
                case "project5":
                    node5.push(value);
                    break;
                case "project6":
                    node6.push(value);
                    break;
                case "project7":
                    node7.push(value);
                    break;
                case "project8":
                    node8.push(value);
                    break;
            }
        });
        //project[i].nodes=nodes[i]

    }


    return data;
});




