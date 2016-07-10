angular.module('budgetTrackingApp').config(['$routeProvider', function($routeProvider) {
    $routeProvider
    	.when('/home', {
    		templateUrl: 'views/shopsummary.html', 
    		controller: 'ShopCtrl'
    })
    .when('/requisition', {
    		templateUrl: 'views/requisition.html', 
    		controller: 'RequisitionCtrl'
    	})
    .otherwise({redirectTo: '/home'})
 }])