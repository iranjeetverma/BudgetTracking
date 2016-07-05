'use strict';



/**
 * @ngdoc service
 * @name budgetTrackingApp.Shop
 * @description
 * # Shop
 * Service in the budgetTrackingApp.
 */
angular.module('budgetTrackingApp')
  .factory('ShopService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getShops: function () {
    		return $http.get(entribServices.shopURL)
    	}
    }
  }]);