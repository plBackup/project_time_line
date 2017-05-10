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
                $rootScope.$stateParams = $stateParams;
                $rootScope.plink="http://192.168.121.24:7900/PowerDesk/plan7";
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
                                templateUrl: '../views/blank.html',
                               /* controller:"dataCtrl",
                                controllerAs:"dCtrl"*/
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
                                templateUrl: '../views/blank_project.html',
                                /* controller:"dataCtrl",
                                 controllerAs:"dCtrl"*/
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

                        }
                    })

                    .state('plan', {
                        //abstract: true,
                        url: '/main/{pid}/{plan}',
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
                                templateUrl: '../views/right_view.html',
                                controller:"rightCtrl",
                                controllerAs:"rCtrl"
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
                                var plan=$stateParams.plan;
                                $rootScope.plan=plan;
                                //all代表过滤1:全部 0:未完成
                                //"planId=4028347044bace9c0144d47419151028&level=1&status=all&all=1"
                                var search="?planId="+plan+"&level=all&status=all&all=1";
                                return dataNodeService.getData(search);
                            },
                        }
            })
                    .state('set', {
                        //abstract: true,
                        url: '/set',
                        views:{
                            'menu':{
                                templateUrl: '../views/menu_view.html',
                                controller:"setMenuCtrl",
                                controllerAs:"mCtrl"
                            },
                            'content': {
                                templateUrl: '../views/blank.html',
                                /* controller:"dataCtrl",
                                 controllerAs:"dCtrl"*/
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
                    .state('setproject', {
                        //abstract: true,
                        url: '/set/{pid}',
                        views:{
                            'menu':{
                                templateUrl: '../views/menu_view.html',
                                controller:"setMenuCtrl",
                                controllerAs:"mCtrl"
                            },
                            'content': {
                                templateUrl: '../views/blank_project.html',
                                /* controller:"dataCtrl",
                                 controllerAs:"dCtrl"*/
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

                        }
                    })
                    .state('setplan', {
                        //abstract: true,
                        url: '/set/{pid}/{plan}',
                        views:{
                            'menu':{
                                templateUrl: '../views/menu_view.html',
                                controller:"setMenuCtrl",
                                controllerAs:"mCtrl"
                            },
                            'content': {
                                templateUrl: '../views/data_view.html',
                                controller:"setDataCtrl",
                                controllerAs:"dCtrl"
                            },
                            "right":{
                                templateUrl: '../views/right_view.html',
                                controller:"rightCtrl",
                                controllerAs:"rCtrl"
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
                                var plan=$stateParams.plan;
                                $rootScope.plan=plan;
                                //all代表过滤1:全部 0:未完成
                                //"planId=4028347044bace9c0144d47419151028&level=1&status=all&all=1"
                                var search="?planId="+plan+"&level=all&status=all&all=1";
                                return dataNodeService.getData(search);
                            },
                        }
                    });
            });
    });