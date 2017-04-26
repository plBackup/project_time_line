var cur_day=0;//当前时间节点 蓝线绘制代表当前状态
var start_date1="2015-01-01";
cur_day=
function gd(year, month, day) {
    return new Date(year, month, day).getTime();
}
var init_data_level1={};
var data = {
	lines : [
		{
			id: "project1",
			name : "设计"
		},
		{
			id: "project2",
			name : "营销"
		},
		{
			id: "project3",
        name : "成本"
    },
    {
        id: "project4",
        name : "工程"
        },
    {
        id: "project5",
        name : "证照政府"
        },
    {
        id: "project6",
        name : "商业及其他"
        },
    {
        id: "project7",
        name : "备注"
        }

],
nodes: NodesDate
};

//var relations=[["SJ01","YX01"],["YX01","SJ07"],["SJ07","SJ02"],["SJ02","SJ06"],["SJ06","SJ08"]];
var relations=[];
function init_data(){
	var nodes=data.nodes;
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
	project1.id="project1";
	project1.index=0;
	project1.height=620;
	project1.offset=50;
	project1.cur_done=0;
	project1.name="设计";
	project1.description="设计";
	project1.nodes=node1;

	project2.id="project2";
	project2.index=1;
	project2.height=300;
	project2.offset=50;
	project2.cur_done=0;
	project2.name="营销";
	project2.description="营销";
	project2.nodes=node2;
	project3.id="project3";
	project3.index=2;
	project3.height=550;
	project3.offset=50;
	project3.cur_done=0;
	project3.name="成本";
	project3.description="成本";
	project3.nodes=node3;
	project4.id="project4";
	project4.index=3;
	project4.height=620;
	project4.offset=50;
	project4.cur_done=0;
	project4.name="工程";
	project4.description="工程";
	project4.nodes=node4;

	project5.id="project5";
	project5.index=5;
	project5.height=700;
	project5.offset=50;
	project5.cur_done=0;
	project5.name="证照/政府";
	project5.description="证照/政府";
	project5.nodes=node5;

    project6.id="project6";
    project6.index=6;
    project6.height=700;
    project6.offset=50;
    project6.cur_done=0;
    project6.name="商业及其他";
    project6.description="商业及其他";
    project6.nodes=node6;

    project7.id="project7";
    project7.index=7;
    project7.height=150;
    project7.offset=50;
    project7.cur_done=0;
    project7.name="备注";
    project7.description="备注";
    project7.nodes=node7;
	init_data_level1.project1=project1;
	init_data_level1.project2=project2;
	init_data_level1.project3=project3;
	init_data_level1.project4=project4;
	init_data_level1.project5=project5;
    init_data_level1.project6=project6;
    init_data_level1.project7=project7;
    //init_data_level1.project8=project8;

 //   console.log("project1---------------------------");
 //   console.log(project1.nodes);
 //   console.log("project5---------------------------");
 //   console.log(project5.nodes);
}
function   DateAdd(interval,number,dateStr)
{
    /*
     *   功能:实现VBScript的DateAdd功能.
     *   参数:interval,字符串表达式，表示要添加的时间间隔.
     *   参数:number,数值表达式，表示要添加的时间间隔的个数.
     *   参数:dateStr,字符类型格式2015-01-01.
     *   返回:新的时间对象.
     *   var   now   =   new   Date();
     *   var   newDate   =   DateAdd( "d ",5,now);
     *---------------   DateAdd(interval,number,date)   -----------------
     */
    var date = new Date(dateStr);
    switch(interval)
    {
        case   "y "   :   {
            date.setFullYear(date.getFullYear()+number);
            break;
        }
        case   "q "   :   {
            date.setMonth(date.getMonth()+number*3);
            break;
        }
        case   "m "   :   {
            date.setMonth(date.getMonth()+number);
            break;
        }
        case   "w "   :   {
            date.setDate(date.getDate()+number*7);
            break;
        }
        case   "d "   :   {
            date.setDate(date.getDate()+number);
            break;
        }
        case   "h "   :   {
            date.setHours(date.getHours()+number);
            break;
        }
        case   "mi "   :   {
            date.setMinutes(date.getMinutes()+number);
            break;
        }
        case   "s "   :   {
            date.setSeconds(date.getSeconds()+number);
            break;
        }
        default   :   {
            date.setDate(date.getDate()+number);
            break;
        }
    }

    return date.getFullYear()+"-"+(date.getMonth()<9?("0"+(date.getMonth()+1)):(date.getMonth()+1))+"-"+(date.getDate()<9?("0"+date.getDate()):date.getDate());
}
//init_data();

