'use strict';

angular.module('budgetTrackingApp')
  .factory('POService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getPO: function () {
    		return $http.get(entribServices.poURL + entribServices.queryParams)
    	}
    }
  }]);