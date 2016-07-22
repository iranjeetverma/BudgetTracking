angular.module('budgetTrackingApp').config(['$routeProvider', function($routeProvider) {
    $routeProvider
    	.when('/home', {
    		templateUrl: 'shopSummary.html', 
    		controller: 'ShopCtrl'
    })
    .when('/requisition', {
    		templateUrl: 'requisition.html', 
    		controller: 'RequisitionCtrl'
    	})
    .otherwise({redirectTo: '/home'})
 }])