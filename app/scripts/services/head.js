'use strict';

angular.module('budgetTrackingApp')
  .factory('HeadService', ['$http', 'entribServices', function ($http, entribServices) {    
    return {
    	getHeads: function () {
    		return $http.get(entribServices.headURL + entribServices.queryParams)
    	},
    	updateHead: function (head_id, data) {
    		return $http.put(entribServices.headURL + '/' + head_id + entribServices.queryParams, data)
    	},
        saveHead: function(data){
            data.newhead = 'true'
            data.siteName = "abc"
            return $http.post(entribServices.headURL  + entribServices.queryParams, data)
        }
    }
  }]);