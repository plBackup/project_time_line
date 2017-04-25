/**
 * Created by whobird on 17/4/25.
 */
var transform = function(data){
    return $.param(data);
};
//return false;

$http({
    method:"post",
    url:"/amp_web/newAmp/rentPackage/buildRent.htm",
    data:$.param({Pid:Project_id, data:data,schId:schemeId}),
    //transformRequest: transform,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}

}).then(function(data){
    console.log("data------");
    console.log(data);
    if(data.data["code"]==0){
        amp_main.loading_hide();
        if(typeof callback !=="undefined"){
            callback();
        }
    }else{
        amp_main.loading_hide();
        alert("保存失败，请稍后再试");
    }
},function(error){
    console.log("error----");
    console.log(error);
    alert("保存失败，请稍后再试");
});