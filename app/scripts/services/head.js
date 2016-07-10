'use strict';

angular.module('budgetTrackingApp')
  .factory('HeadService', ['$http', 'entribServices', function ($http, entribServices) {
    var activeHead
    return {
    	getHeads: function () {
    		return $http.get(entribServices.headURL + entribServices.queryParams)
    	},
    	updateHead: function (head_id, data) {
    		return $http.put(entribServices.headURL + '/' + head_id + entribServices.queryParams, data)
    	},
        setActiveHead(activeHead){
            activeHead = activeHead
        },
        getActiveHead(){
            return activeHead
        }
    }
  }]);