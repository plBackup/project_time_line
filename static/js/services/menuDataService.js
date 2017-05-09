/**
 * Created by whobird on 17/4/25.
 */
define(["angular","./app.services"],function(angular,services){

    services.service('dataMenuService', ["$rootScope","$http",function($rootScope,$http) {
        var service = {
            getData: function (search,cb) {
                if(typeof search==="undefined"){
                    search="";
                }

                return $http.get('http://192.168.121.24:7900/PowerDesk/plan7/sdk!init.action'+search, {cache: false}).then(function (res) {
                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                        return res.data;
                    }

                });
            },
        };
        return service;
    }]);
    //return controllers;
});
