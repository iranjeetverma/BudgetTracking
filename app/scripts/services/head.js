'use strict';



/**
 * @ngdoc service
 * @name budgetTrackingApp.Head
 * @description
 * # Head
 * Service in the budgetTrackingApp.
 */
angular.module('budgetTrackingApp')
  .factory('HeadService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getHeads: function () {
    		return $http.get(entribServices.headURL)
    	}
    }
  }]);