'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', '$rootScope', 'RequisitionService', '$location', '$route',
	function ($scope, $rootScope, RequisitionService, $location, $route) {
    $scope.today = new Date()    
    $scope.activeHead = $rootScope.activeHead
    $scope.selectedShopForNav = $rootScope.selectedShopForNav
    $scope.categories = ['Productivity', 'Quality', 'Cost', 'Delivery', 'SHE', 'Replacement', 'Reconditioning', 'New Model', 'Introduction', 'Others']
    $scope.heads = $rootScope.heads;
    $scope.quarters = [0,0,0,0]
    if($scope.heads){
        $scope.heads.forEach(function(head){
            if(head.shopid == $scope.selectedShopForNav._id){
                if(head.requisitions){
                    head.requisitions.forEach(function(req){
                        var m = moment(req.createdTimestamp,'DD-MM-YYYY').month() + 1
                        m = m < $rootScope.startoftheyear? m+12 : m
                        var sum = $rootScope.startoftheyear
                        var q = 0;
                        while(sum <= m){
                            sum += 3;
                            q++;
                        }    
                        $scope.quarters[q-1] += req.amount;
                    })
                }
            }
        })
    }
    $scope.requisitionnumberprefix  = ($scope.selectedShopForNav.division ? $scope.selectedShopForNav.division + '/' : '')+
                                        ($scope.selectedShopForNav.shortname ? $scope.selectedShopForNav.shortname + '/' : '')+
                                        $rootScope.getCurrentFinYear()
    
    $scope.getNextRequisitionNumber = function(){
        var nextReqNo = 1;        
        if($rootScope.requisitions && $rootScope.requisitions.length > 0){            
            $rootScope.requisitions.sort(function(r1, r2){
                return r1.requisitionnumber < r2.requisitionnumber ? -1 : 1
            })            
            nextReqNo = $rootScope.requisitions[$rootScope.requisitions.length -1].requisitionnumber + 1            
        }        
        return nextReqNo;
    } 

    $scope.newrequisition = {
        headid: $scope.activeHead._id,
        category: $scope.categories[0],
        shopname: $scope.selectedShopForNav.shopname,
        requisitionnumber: $scope.getNextRequisitionNumber(),
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
    	RequisitionService.saveRequitision($scope.newrequisition).success(function(){
            $location.path( 'home' );
            $route.reload();
        })
    }  
}]);
