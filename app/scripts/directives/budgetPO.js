'use strict';
angular.module('budgetTrackingApp')
.directive('budgetPo', function(){
	return {
		restrict: 'E',
		templateUrl: 'scripts/directives/budgetPOTemplate.html'
	}
})