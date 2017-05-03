/**
 * Created by whobird on 17/4/21.
 */
define(["js/app"],
    function(app) {
        console.log(app)
        return app.run([
            '$rootScope',
            '$state',
            '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams
            }
        ]).config(function ($stateProvider, $urlRouterProvider, $locationProvider, $uiViewScrollProvider) {
                //用于改变state时跳至顶部
                $uiViewScrollProvider.useAnchorScroll();
                // 默认进入先重定向

                //$urlRouterProvider.otherwise('/main');
                $urlRouterProvider.when('', '/main');
                $stateProvider
                    .state('main', {
                        //abstract: true,
                        url: '/main',
                        views:{
                            'menu':{
                                templateUrl: '../views/menu_view.html',
                                controller:"menuCtrl",
                                controllerAs:"mCtrl"
                            },
                            'content': {
                                templateUrl: '../views/data_view.html',
                                controller:"dataCtrl",
                                controllerAs:"dCtrl"
                            },
                            "right":{
                                templateUrl: '../views/blank_right.html',
                            }
                        },
                        resolve: {

                            menuData: function(dataMenuService) {
                                //$rootScope.pid=undefined;
                                return dataMenuService.getData();
                            },

                        }
                    })
                    .state('project', {
                        //abstract: true,
                        url: '/main/{pid}',
                        views:{
                            'menu':{
                                templateUrl: '../views/menu_view.html',
                                controller:"menuCtrl",
                                controllerAs:"mCtrl"
                            },
                            'content': {
                                templateUrl: '../views/data_view.html',
                                controller:"dataCtrl",
                                controllerAs:"dCtrl"
                            },
                            "right":{
                                templateUrl: '../views/blank_right.html',
                            }
                        },
                        resolve: {
                             menuData: function(dataMenuService,$stateParams,$rootScope) {
                                 var pid=$stateParams.pid;
                                 var search="?projectCd="+pid;
                                 $rootScope.pid=pid;
                                 return dataMenuService.getData(search);
                             },
                            nodeData: function(dataNodeService,$stateParams,$rootScope) {
                                var pid=$stateParams.pid;
                                var search="?projectCd="+pid;
                                $rootScope.pid=pid;
                                return dataNodeService.getData(search);
                            },
                        }
            });
            });
    });