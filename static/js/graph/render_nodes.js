/**
 * Created by whobird on 17/4/26.
 */
/**
 * Created by whobird on 17/4/26.
 */
define(["jquery","zrender/zrender","./graph","zrender/tool/color","zrender/tool/area","zrender/shape/Circle","zrender/shape/Rectangle",'zrender/shape/Isogon',"zrender/shape/Text","zrender/shape/Line","zrender/Group"],
    function($,zrender,graph){
        var nodesRender={};

        nodesRender.render=function(zr,project){
            //end nodesRender

        };

        nodesRender.init=function(zr,project){
            console.log("nodes render -----init===========================");
            //数据过滤
            //渲染
            nodesRender.render(zr,project);

        };


        return nodesRender;
    });