/**
 * Created by whobird on 17/4/21.
 */
define(["js/app"],
    function(app) {
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
                $urlRouterProvider.otherwise('/main');
                $stateProvider
                    .state('main', {
                        //abstract: true,
                        url: '/main',
                        views: {
                            'main@': {
                                templateUrl: 'main.html'
                            }
                        }
                    })
            })
    });