'use strict';
angular.module('budgetTrackingApp')
.directive('maxLength', function(){
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attrs, ngModel) {
				function checkLength(text) {					
					var regexp = /^\d{0,9}$/
					var old = ngModel.$modelValue;
					if(regexp.test(text)) {
						ngModel.$setViewValue(text);
					  	ngModel.$render();					  
					  	return text;
					}else{
					  	ngModel.$setViewValue(old);
					  	ngModel.$render();
					  	return old;
					}
				}
				ngModel.$parsers.push(checkLength);			
			}
	}
})
