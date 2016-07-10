'use strict';

angular.module('budgetTrackingApp')
  .factory('ShopService', ['$http', 'entribServices', function ($http, entribServices) {
  	var selectedShop
    return {
    	getShops: function () {
    		return $http.get(entribServices.shopURL + entribServices.queryParams)
    	},
    	setSelectedShop(shop){
    		selectedShop = shop
    	},
    	getSelectedShop(){
    		return selectedShop
    	}
    }
  }]);