'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:ShopCtrl
 * @description
 * # ShopCtrl
 * Controller of the budgetTrackingApp
 */
angular.module('budgetTrackingApp')
.controller('ShopCtrl', ['$scope', '$rootScope', 'ShopService', '$location', 
	function ($scope, $rootScope, ShopService, $location) {
	$rootScope.$on('showMenu', function(e, showMenu){
		console.log(showMenu)
		$scope.openMenu = showMenu
	})
	$scope.openMenu = $rootScope.openMenu
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
		}).error(function(data, status){
			$rootScope.handleError(data, status)
		}).catch(function(exception){
			$rootScope.handleError(null, null, exception)
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