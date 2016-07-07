'use strict';

angular.module('budgetTrackingApp')
  .factory('ShopService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getShops: function () {
    		return $http.get(entribServices.shopURL + entribServices.queryParams)
    	}
    }
  }]);