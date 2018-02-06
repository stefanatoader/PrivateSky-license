'use strict';

/**
 * Config for the router
 */
angular.module('app')
    .run(['$rootScope', '$state', '$stateParams',
            function ($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ])
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {

                $urlRouterProvider
                    .otherwise('/app/events');

                $stateProvider
                    .state('app', {
                        abstract: true,
                        url: '/app',
                        templateUrl: 'tpl/app.html'
                    })

                    .state('app.events',{
                       url:'/events',
                        templateUrl:'tpl/eventsPage.html',
                        resolve:{
                            deps:['$ocLazyLoad',
                                function ($ocLazyLoad) {
                                    return $ocLazyLoad.load([
                                        'js/controllers/eventsController.js'
                                    ]);
                                }]
                        }
                    })

	                .state('app.preview',{
		                url:'/preview',
		                templateUrl:'tpl/previewPage.html',
                        params:{event:null},
		                resolve:{
			                deps:['$ocLazyLoad',
				                function ($ocLazyLoad) {
					                return $ocLazyLoad.load([
						                'js/controllers/previewController.js'
					                ]);
				                }]
		                }
	                })

	                .state('app.edit',{
		                url:'/edit',
		                templateUrl:'tpl/editPage.html',
		                params:{event:null,structure:null},
		                resolve:{
			                deps:['$ocLazyLoad',
				                function ($ocLazyLoad) {
					                return $ocLazyLoad.load([
						                'js/controllers/editController.js'
					                ]);
				                }]
		                }
	                })

                    .state('access.404', {
                        url: '/404',
                        templateUrl: 'tpl/page_404.html'
                    })
            }
        ]
    );