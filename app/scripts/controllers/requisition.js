'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', '$rootScope', 'RequisitionService', '$location', 'ngDialog', 
	function ($scope, $rootScope, RequisitionService, $location, ngDialog) {
    if(!$scope.selectedShopForNav){
        $location.path( 'home' );
    }
    document.getElementById('main').scrollTop  = 0;
    $scope.today = new Date()  
    $scope.activeHead = $rootScope.activeHead
    $scope.selectedShopForNav = $rootScope.selectedShopForNav
    $scope.categories = ['Productivity', 'Quality', 'Cost', 'Delivery', 'SHE', 'Replacement', 'Reconditioning', 'New Model', 'Introduction', 'Others']
    $scope.heads = $rootScope.heads;
    $scope.quarters = [0,0,0,0]
    if($scope.heads){
        $scope.heads.forEach(function(head){
            if(head.shopid == $scope.selectedShopForNav.shopname){
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
                        $scope.quarters[q-1] += parseInt(req.amount);
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
                return parseInt(_.last(r1.requisitionnumber.split('/'))) < parseInt(_.last(r2.requisitionnumber.split('/'))) ? -1 : 1
            })
            nextReqNo = (parseInt(_.last(_.last($rootScope.requisitions).requisitionnumber.split('/'))) + 1) +'';            
            while(nextReqNo.length < 3){
              nextReqNo = '0'+nextReqNo;
            }
        }
        return nextReqNo;
    } 
    
    $scope.supplierChange = function(supplier){
        $scope.suppliers = []        
        $scope.suppliers.push($scope.newrequisition.supplier1)
        $scope.suppliers.push($scope.newrequisition.supplier2)
        $scope.suppliers.push($scope.newrequisition.supplier3)
        $scope.suppliers = $scope.suppliers.filter(function(supplier) {
            if(supplier){
                return true
            }
            return false
        })
    }

    $scope.newrequisition = {
        headid: $scope.activeHead._id,
        category: $scope.categories[0],
        shopname: $scope.selectedShopForNav.shopname,
        requisitionnumber: $scope.requisitionnumberprefix +"/"+$scope.getNextRequisitionNumber()
    }
    function checkSupplier(){
        var result = false;
        if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier1){
            $scope.newrequisition.amount = $scope.newrequisition.negotiatedcost1
        }
        if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier2){
            $scope.newrequisition.amount = $scope.newrequisition.negotiatedcost2
        }
        if($scope.newrequisition.selectedsupplier == $scope.newrequisition.supplier3){
            $scope.newrequisition.amount = $scope.newrequisition.negotiatedcost3
        }

        if($scope.newrequisition.supplier1){
            result = $rootScope.checkNumber($scope.newrequisition.quotedcost1)
            if(!result) return false
            result = $rootScope.checkNumber($scope.newrequisition.negotiatedcost1)
            if(!result) return false
        }else{
            result = !$rootScope.checkNumber($scope.newrequisition.quotedcost1)
            if(!result) return false
            result = !$rootScope.checkNumber($scope.newrequisition.negotiatedcost1)
            if(!result) return false
        }
        if($scope.newrequisition.supplier2){
            result = $rootScope.checkNumber($scope.newrequisition.quotedcost2)
            if(!result) return false
            result = $rootScope.checkNumber($scope.newrequisition.negotiatedcost2)
            if(!result) return false
        }else{
            result = !$rootScope.checkNumber($scope.newrequisition.quotedcost2)
            if(!result) return false
            result = !$rootScope.checkNumber($scope.newrequisition.negotiatedcost2)
            if(!result) return false
        }
        if($scope.newrequisition.supplier3){
            result = $rootScope.checkNumber($scope.newrequisition.quotedcost3)
            if(!result) return false
            result = $rootScope.checkNumber($scope.newrequisition.negotiatedcost3)
            if(!result) return false
        }else{
            result = !$rootScope.checkNumber($scope.newrequisition.quotedcost3)
            if(!result) return false
            result = !$rootScope.checkNumber($scope.newrequisition.negotiatedcost3)
            if(!result) return false
        }        
        if($scope.suppliers && $scope.suppliers.length >= 2 && result){
            return true
        }
        return false
    }  
    $scope.saveRequisition = function(){ 
	    var result = checkSupplier()
        if(checkSupplier() &&
           $scope.newrequisition.selectedsupplier && 
           $scope.newrequisition.reasonsuppliersection &&
           $scope.newrequisition.justification && 
           $scope.newrequisition.categorydetails &&
           $scope.newrequisition.category && 
           $rootScope.checkNumber($scope.newrequisition.qty) &&
           $scope.newrequisition.description && 
           $scope.newrequisition.cell &&
           $scope.newrequisition.remarks){
        	RequisitionService.saveRequitision($scope.newrequisition).success(function(){
                $rootScope.heads.forEach(function(head){
                    if(head._id == $scope.newrequisition.headid){
                        $scope.newrequisition.createdTimestamp = moment().date() + '-'+ (moment().month()+1) + '-'+ moment().year()
                        $scope.newrequisition.po = [];
                        head.requisitions.push($scope.newrequisition)
                    }
                })
                $rootScope.heads = null
                $location.path( 'home' );
            }).error(function(data, status){
                $rootScope.handleError(data, status)
            }).catch(function(exception){
                $rootScope.handleError(null, null, exception)
            })  
        }else{
            ngDialog.open({ 
                template: '<p class="no-data">All fields are Mandatory to create a new requisition</p>',
                plain: true
            });
        }
    }  
}]);
