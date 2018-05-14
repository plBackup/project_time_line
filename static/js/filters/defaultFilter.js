/**
 * Created by whobird on 17/4/25.
 */
define(["angular","./app.filters"],function(angular,filters){

    filters.filter("default",function(){
        return function(data,str){
            if(typeof str==="undefined"){
                return data;
            }else{
                if(typeof data==="undefined" || data==""){
                    return str;
                }
                return data;
            }
        }
    });
});
