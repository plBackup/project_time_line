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
                            'content': {
                                templateUrl: './views/data_view.html',
                                controller:"dataCtrl",
                                controllerAs:"dCtrl"
                            },
                            "right":{
                                templateUrl: './views/blank_right.html',
                            }
                        },
                        resolve: {
                           /* manageFeeData: function(manageFeeService) {
                                return manageFeeService.getSetData();
                            },
                            data: ['$q','$timeout', function($q,$timeout){
                                var defer = $q.defer();
                                $timeout(function(){
                                    defer.resolve();
                                    amp_main.loading_hide();
                                }, 300);
                                return defer.promise;
                            }]*/
                        }
                    });
            });
    });