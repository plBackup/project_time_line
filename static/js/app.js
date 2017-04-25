/**
 * Created by whobird on 17/4/21.
 */
define(["angular","uiRouter","./controllers/index",],function(angular){
    console.log("app===============");
    var app=angular.module("app",["ui.router","app.controllers"]);
    return app;
});
