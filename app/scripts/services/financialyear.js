'use strict';

angular.module('budgetTrackingApp')
  .factory('YearService', ['$http', 'entribServices', function ($http, entribServices) {  	
    return {
    	getYear: function () {
    		return $http.get(entribServices.yearURL + entribServices.queryParams)
    	}
    }
  }]);
  