angular.module('budgetTrackingApp').filter('length', function(){
	return function(value, params){
		params = parseInt(params)
		if(isNaN(value) || isNaN(params)){
			return value;
		}
		if(value.toString().length < params){
			for(var i = value.toString().length; i< params; i++){
				value = "0" + value;
			}
			return value;
		}else{
			return value;
		}
	}
})