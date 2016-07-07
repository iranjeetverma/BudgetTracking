'use strict';
angular.module('budgetTrackingApp')
.directive('budgetRequisition', function(){
	return {
		restrict: 'E',
		templateUrl: 'scripts/directives/budgetRequisitionTemplate.html'
	}
})