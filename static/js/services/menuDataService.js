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
                return $http.get($rootScope.plink+'/sdk!init.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
                    if(typeof cb!=="undefined"){
                        cb(res.data);
                    }else{
                        return res.data;
                    }

                },function(errr){
                    location.href=$rootScope.plink;
                });
            },
        };
        return service;
    }]);
    //return controllers;
});
