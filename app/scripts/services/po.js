'use strict';

angular.module('budgetTrackingApp')
  .factory('POService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getPO: function () {
    		return $http.get(entribServices.poURL + entribServices.queryParams)
    	},
    	savePO: function(data){
    		return $http.post(entribServices.poURL+ entribServices.queryParams, data)
    	}
    }
  }]);