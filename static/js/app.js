/**
 * Created by whobird on 17/4/21.
 */
define(["angular","uiRouter","./controllers/index","./services/index"],function(angular){

    var app=angular.module("app",["ui.router","app.controllers","app.services"]);
    return app;
});
