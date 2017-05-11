/**
 * Created by whobird on 17/4/25.
 */
define(["angular","./app.services"],function(angular,services){


    services.service('dataNodeService', ["$rootScope","$http",function($rootScope,$http) {
        var service = {
            getData: function (search,cb) {
                if(typeof search==="undefined"){
                    search="";
                }
               return $http.get($rootScope.plink+'/sdk!node.action'+search, {cache: false,'Content-Type':'application/x-www-form-urlencoded',withCredentials:true}).then(function (res) {
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
