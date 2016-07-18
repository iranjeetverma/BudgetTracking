'use strict';
angular.module('budgetTrackingApp')
.directive('budgetHead', function(){
	return {
		restrict: 'E',
		templateUrl: '../../budgetHeadTemplate.html'
	}
})