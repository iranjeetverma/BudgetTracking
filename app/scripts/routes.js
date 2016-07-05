angular.module('budgetTrackingApp').config(['$routeProvider', function($routeProvider) {
   $routeProvider
   	.when('/home', {
   		templateUrl: 'views/shopsummary.html', 
   		controller: 'ShopCtrl'
   })
   .when('/head', {
   		templateUrl: 'views/newHead.html', 
   		controller: 'MainCtrl'
   	})

   .when('/popup', {
         templateUrl: 'views/formpopup.html', 
         controller: 'popupCtrl'
      })
   
   .otherwise({redirectTo: '/home'})
 }])