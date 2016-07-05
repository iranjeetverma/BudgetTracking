'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:ShopCtrl
 * @description
 * # ShopCtrl
 * Controller of the budgetTrackingApp
 */
angular.module('budgetTrackingApp')
.controller('ShopCtrl', ['$scope', '$rootScope', 'ShopService', function ($scope, $rootScope, ShopService) {
	$scope.getShops = function(){
		ShopService.getShops().success(function(shopData){
			if(shopData && shopData.results){				
				$scope.shops = shopData.results
				$scope.selectedShopForNav = $scope.shops[0]
				$rootScope.$emit('shopselected', $scope.selectedShopForNav)
			}
		})	
	}

	$scope.selectShop = function(shop){
		$scope.selectedShopForNav = shop
		$rootScope.$emit('shopselected', $scope.selectedShopForNav)
	}
}]);