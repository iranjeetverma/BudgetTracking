'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the budgetTrackingApp
 */


angular.module('budgetTrackingApp').controller('MainCtrl', 
  ['$scope', '$rootScope', 'HeadService', 'RequisitionService', 'POService', 
    function ($scope, $rootScope, HeadService, RequisitionService, POService) {      
      $scope.user = {id:'1', name:'Ranjeet Verma'} 
      $rootScope.$on('shopselected', function(e, shop){
        $scope.shop = shop
        generateGraph($scope)
        
        HeadService.getHeads().success(function(headData){
          if(headData && headData.results){
              $scope.heads = headData.results
              // remove if you want to hide on load
              //$scope.activeHead = $scope.heads[0]
              /////
              RequisitionService.getRequitisions().success(function(reqData){
                if(reqData && reqData.results){
                    $scope.requisitions = reqData.results
                      POService.getPO().success(function(poData){
                        if(poData && poData.results){
                          $scope.po = poData.results
                          for(var k = 0; k< $scope.requisitions.length; k++){
                            $scope.requisitions[k].po = [];
                            $scope.requisitions[k].amount = 0;
                            for(var l = 0; l< $scope.po.length; l++){
                              if($scope.requisitions[k]._id == $scope.po[l].requsitionid){
                                $scope.requisitions[k].po.push($scope.po[l])                                
                                $scope.requisitions[k].amount += $scope.po[l].amount
                              }
                            }
                          }
                        }
                      })
                    for(var i = 0; i <  $scope.heads.length; i++){
                      $scope.heads[i].requisitions = [];
                      for(var j = 0; j<  $scope.requisitions.length; j++){
                        if($scope.heads[i]._id == $scope.requisitions[j].headid){
                          $scope.heads[i].requisitions.push($scope.requisitions[j])
                        }
                      }
                    }
                  }
              })             
            }
        })
      })

      $scope.updateBudgetHead = function(keyCode, head){
        if(keyCode == 13){
          head.isupdating = true
          HeadService.updateHead(head._id, {amendedbudget: head.amendedbudget}).success(function(){
            head.isupdating = false
          })
        }
      }

      $scope.approveRequisition = function(requisition){
          requisition.isupdating = true        
          RequisitionService.updateRequitision(requisition._id, {isapproved :requisition.isapproved}).success(function(){
            requisition.isupdating = false
          })
      }
      $scope.openHead = function(head){
        if($scope.activeHead == head){
          $scope.activeHead = undefined;
        }else{
          $scope.activeHead = head;
        }
      }
}])

function generateGraph($scope){
    var graphMaxWidth = 450;
    $scope.budgets = [
      {budgetname:'ShopBudget', color:'#f1b62d', amount: $scope.shop.shopbudget},
      {budgetname:'Amended Budget', color:'#b44322', amount: $scope.shop.amendedbudget},
      {budgetname:'Amount Utilized', color:'#72ba22', amount: $scope.shop.utilizedbudget}
    ]
    var highest = $scope.budgets[0].amount
    
    if($scope.budgets[0].amount > $scope.budgets[1].amount && $scope.budgets[0].amount > $scope.budgets[2].amount){
      highest = $scope.budgets[0].amount
    }else if($scope.budgets[1].amount > $scope.budgets[0].amount && $scope.budgets[1].amount > $scope.budgets[2].amount){
      highest = $scope.budgets[1].amount
    } else {
      highest = $scope.budgets[2].amount
    }
    
    $scope.budgets[0].width = (graphMaxWidth/highest) * $scope.budgets[0].amount
    $scope.budgets[1].width = (graphMaxWidth/highest) * $scope.budgets[1].amount
    $scope.budgets[2].width = (graphMaxWidth/highest) * $scope.budgets[2].amount
    $scope.utilisation = { percent: $scope.budgets[2].amount <= 0 ? 0  : (100/$scope.budgets[1].amount) * $scope.budgets[2].amount }
}


