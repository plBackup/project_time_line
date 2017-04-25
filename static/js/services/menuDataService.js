/**
 * Created by whobird on 17/4/25.
 */
define(["angular","./app.services"],function(angular,services){

    services.service('dataMenuService', ["$rootScope","$http",function($rootScope,$http) {

        var service = {
            getData: function () {
                return $http.get('../data/sdk!init.json', {cache: true}).then(function (res) {
                    return res.data;
                });
            },
        };
        return service;

    }]);
    //return controllers;
});
