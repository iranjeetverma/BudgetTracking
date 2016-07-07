'use strict';

angular.module('budgetTrackingApp')
  .factory('RequisitionService', ['$http', 'entribServices', function ($http, entribServices) {
    return {
    	getRequitisions: function () {
    		return $http.get(entribServices.requisitionURL + entribServices.queryParams)
    	},
    	updateRequitision: function (requisition_id, data) {
    		return $http.put(entribServices.requisitionURL + '/' + requisition_id + entribServices.queryParams, data)
    	}
    }
  }]);