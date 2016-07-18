'use strict';
angular.module('budgetTrackingApp')
.directive('budgetPo', function(){
	return {
		restrict: 'E',
		templateUrl: '../../budgetPOTemplate.html'
	}
})