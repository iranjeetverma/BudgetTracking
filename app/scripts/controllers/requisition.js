'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', '$rootScope', 'RequisitionService',  
	function ($scope, $rootScope, RequisitionService) {
    $scope.today = new Date()    
    $scope.activeHead = $rootScope.activeHead
    $scope.selectedShopForNav = $rootScope.selectedShopForNav
    $scope.categories = ['Productivity', 'Quality', 'Cost', 'Delivery', 'SHE', 'Replacement', 'Reconditioning', 'New Model', 'Introduction', 'Others']
    $scope.heads = $rootScope.heads; 
    $scope.newrequisition = {
    	headid: $scope.activeHead._id,
    	category: $scope.categories[0],
    	shopname: $scope.selectedShopForNav.shopname,
    	suppliers: []
    }    
    $scope.saveRequisition = function(){
    	$scope.newrequisition.supplier1 = $scope.newrequisition.suppliers[0]
	    $scope.newrequisition.supplier2 = $scope.newrequisition.suppliers[1]
	    $scope.newrequisition.supplier3 = $scope.newrequisition.suppliers[2]
	    if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier1){
	    	$scope.newrequisition.amount = $scope.newrequisition.negotiatedcost1
	    }
	    if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier2){
	    	$scope.newrequisition.amount = $scope.newrequisition.negotiatedcost2
	    }
	    if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier3){
	    	$scope.newrequisition.amount = $scope.newrequisition.negotiatedcost3
	    }
    	RequisitionService.saveRequitision($scope.newrequisition)
    }  
}]);
