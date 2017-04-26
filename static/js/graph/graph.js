/**
 * Created by whobird on 17/4/26.
 */
define([],function(){
   var graph=(function(gh){
       var graph=gh;


        graph._gd=function(year,month,day){
            return (new Date(year,month,day)).getTime();
        };
        graph.dateAdd=function(interval,number,dateStr){
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

        };

        graph.startOffset=0;
       graph.defaultPix=4;
       graph.dayOffset=100;

       graph.init_status={
           status0:{
               id:"status0",
               name:"前期阶段",
               key_point:"",
               x_start:-100,
               x_end:0,
               scale:1,
               bg:"#f6f6f6",
           },
           status1:{
               id:"status1",
               name:"方案阶段",
               key_point:"土地摘牌",
               x_start:0,
               x_end:200,
               scale:1,
               bg:"#fff",
           },
           status2:{
               id:"status2",
               name:"深入设计阶段",
               key_point:"方案批复",
               x_start:200,
               x_end:350,
               scale:1,
               bg:"#f6f6f6",
               date_count:20
           },
           status3:{
               id:"status3",
               name:"开发阶段",
               key_point:"总包开工",
               x_start:350,
               x_end:700,
               scale:1,
               bg:"#fff",

           },
           status4:{
               id:"status4",
               name:"交付阶段",
               key_point:"竣工备案",
               x_start:700,
               x_end:800,
               scale:1,
               bg:"#f6f6f6",
           }
       }

        graph.init_graph={
           //project_base:确认每一个project的main——container
           project_base:{
               height: 160,
               x: 30,
               y: 100,
               end_x: 900,
               base_line: 30
           },
           project_line:{
               thick:1,
               color:'206,206,206'
           },
           task_timing:{
               radius:8,
               color:'0,0,0',
               font_size:15
           },
           task_major:{
               radius:12,
               color:'53,152,219',
               font_size:18
           },
           task_links:{
               radius:9,
               border_width:3,
               color:'255,255,255',
               border_color:'53,152,219',
               font_size:18
           },
           task_major_draging:{
               color:'148,206,250'
           },
           line_task_links:{
               color:'53,152,219',
               border_width:3,
               type:'normal'
           },
           line_task_temp:{
               color:'53,152,250',
               border_width:3,
               type:'dash'
           },
           sub_links_line:{
               color:''
           }
       };

       return graph;
   })(graph||{});


    return graph;
});