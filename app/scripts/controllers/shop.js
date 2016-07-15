'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:ShopCtrl
 * @description
 * # ShopCtrl
 * Controller of the budgetTrackingApp
 */
angular.module('budgetTrackingApp')
.controller('ShopCtrl', ['$scope', '$rootScope', 'ShopService', '$location', function ($scope, $rootScope, ShopService, $location) {
	$scope.getShops = function(){
		ShopService.getShops().success(function(shopData){
			if(shopData && shopData.results){				
				$scope.shops = shopData.results
				$rootScope.shops = $scope.shops				
				if(!$rootScope.selectedShopForNav){
					$scope.selectedShopForNav = $scope.shops[0]
					$rootScope.selectedShopForNav = $scope.selectedShopForNav
				}
				$rootScope.$emit('shopselected', $scope.selectedShopForNav)
			}
		})	
	}
	$scope.getShops();
	$scope.selectShop = function(shop){
		$scope.selectedShopForNav = shop
		$rootScope.selectedShopForNav = $scope.selectedShopForNav	
		$rootScope.$emit('shopselected', $scope.selectedShopForNav)
		$location.path("home")
	}
}]);