/**
 * Created by whobird on 17/4/26.
 */
/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","./data_init","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group"],
    function($,zrender,graph,data){
        var nodesRender={};
        var nodes=[];
        nodesRender.render=function(zr,nodes){
            //end nodesRender

        };

        nodesRender.init=function(zr,nodes){
            console.log("nodes render -----init===========================");
            //数据过滤
            console.log(nodes);
            //渲染
            nodesRender.render(zr,nodes);

        };


        return nodesRender;
    });