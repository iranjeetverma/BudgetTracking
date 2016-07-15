angular.module('budgetTrackingApp').filter('shop', function(){
	return function(input, params){		
		var filtered = [];
		for(var i = 0; input && i < input.length; i++){
			if(input[i].shopid == params){
				filtered.push(input[i])
			}
		}
		return filtered
	}
})
