/**
 * Created by whobird on 17/4/21.
 */
define(["angular","./controllers/app.controllers","./controllers/mainController",],function(angular){
    console.log("app===============");
    var app=angular.module("app",["app.controllers"]);
    return app;
});
