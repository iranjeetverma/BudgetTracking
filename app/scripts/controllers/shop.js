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
				$scope.selectedShopForNav = $scope.shops[0]
				//$rootScope.$emit('shopselected', $scope.selectedShopForNav)
			}
		})	
	}

	$scope.selectShop = function(shop){
		$scope.selectedShopForNav = shop
		ShopService.setSelectedShop(shop)
		//$rootScope.$emit('shopselectedsecond', $scope.selectedShopForNav)
		//$rootScope.shop = shop
		$location.path("home")
	}
}]);