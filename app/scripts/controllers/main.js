'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the budgetTrackingApp
 */


angular.module('budgetTrackingApp').controller('MainCtrl', 
  ['$scope','$rootScope', 'HeadService', 'RequisitionService', 'POService', 'ngDialog', 
    function ($scope, $rootScope, HeadService, RequisitionService, POService, ngDialog) {
      $rootScope.$on('shopselected', function(e, shop){
        $scope.shop = shop
        if(!$scope.heads){
          loadShopData($scope, $rootScope, HeadService, RequisitionService, POService)
        }else{
          generateGraph($scope, $rootScope)
        }
      })

      $scope.updateBudgetHead = function(keyCode, head){
        if(head.amendedbudget == ""){
          head.amendedbudget = 0;
        }
        if(head.amendedbudget && head.amendedbudget.slice(0,1) == "0"  && head.amendedbudget.length > 1){
          head.amendedbudget = head.amendedbudget.slice(1,head.amendedbudget.length)
        }
        if(keyCode == 13){
          head.isupdating = true
          HeadService.updateHead(head._id, {amendedbudget: head.amendedbudget}).success(function(){
            head.isupdating = false;
            generateGraph($scope, $rootScope)
          })
        }
        generateGraph($scope, $rootScope)
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
         $rootScope.activeHead = $scope.activeHead
        }
      }
      $scope.createHead = function(){
         $scope.newhead = {            
            shopid: $scope.shop._id            
        }
        $scope.createHeadDialog = ngDialog.open({ 
          template: '../../views/createHead.html', 
          className: 'ngdialog-theme-default',
          scope: $scope
        });
      }
       $scope.saveHead = function(){
        $scope.isHeadSaving = true
        HeadService.saveHead($scope.newhead).success(function(){
           $scope.isHeadSaving = false
           ngDialog.close( $scope.createHeadDialog)  
        })
      }
      $scope.groupBudget = function(){
        ngDialog.open({ 
          template: '../../views/groupBudget.html', 
          className: 'ngdialog-theme-default',
          controller: 'ShopCtrl',
          width: '60%'
        });
      }
      $scope.createPo = function(requisition){
        $scope.newpo = {            
            requsitionid: requisition._id,
            ponumber: $scope.po.length > 0 ? $scope.po[$scope.po.length-1].ponumber? $scope.po[$scope.po.length-1].ponumber+ 1 :1 : 1,
            date: (new Date()).getDate() +'-'+ (new Date()).getMonth() +'-'+ (new Date()).getFullYear()
        }
        $scope.createPoDialog = ngDialog.open({ 
          template: '../../views/createPO.html', 
          className: 'ngdialog-theme-default',
          scope: $scope
        });
      }
      $scope.savePO = function(){
        $scope.isPOSaving = true
        POService.savePO($scope.newpo).success(function(){
           $scope.isPOSaving = false
          ngDialog.close( $scope.createPoDialog)  
        })
      }
}])

function generateGraph($scope, $rootScope){
    calcShopBudgets($scope, $rootScope)
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
    $scope.utilisationTitle = "%Utilization"
    $scope.utilisation = { percent: $scope.budgets[2].amount <= 0 ? 0  : (100/$scope.budgets[1].amount) * $scope.budgets[2].amount }
}

function loadShopData($scope, $rootScope, HeadService, RequisitionService, POService){
  
  HeadService.getHeads().success(function(headData){
    if(headData && headData.results){
        $scope.heads = headData.results      
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
                        }
                      } 
                    }
                  }
                  for(var i = 0; i <  $scope.heads.length; i++){
                    $scope.heads[i].requisitions = [];
                    $scope.heads[i].amountutilized = 0
                    $scope.heads[i].amendedbudget = $scope.heads[i].amendedbudget ? $scope.heads[i].amendedbudget : $scope.heads[i].budget;
                    for(var j = 0; j<  $scope.requisitions.length; j++){
                      if($scope.heads[i]._id == $scope.requisitions[j].headid){
                        $scope.heads[i].requisitions.push($scope.requisitions[j])
                      }                      
                      for(var k = 0; k< $scope.po.length; k++){
                        if($scope.heads[i]._id == $scope.requisitions[j].headid && 
                          $scope.po[k].requsitionid == $scope.requisitions[j]._id){
                            $scope.heads[i].amountutilized = parseFloat($scope.heads[i].amountutilized) +  parseFloat($scope.po[k].amount);
                        }
                      }
                    }                    
                  }                  
                  generateGraph($scope, $rootScope) 
                })              
            }
        })             
      }
  })
}
function calcShopBudgets($scope, $rootScope){
  for(var i=0; i< $rootScope.shops.length; i++){
    $rootScope.shops[i].amendedbudget = 0;
    $rootScope.shops[i].utilizedbudget = 0;
    for(var j = 0; j <  $scope.heads.length; j++){
      if($rootScope.shops[i]._id == $scope.heads[j].shopid){
        $rootScope.shops[i].amendedbudget = parseFloat($rootScope.shops[i].amendedbudget) + parseFloat($scope.heads[j].amendedbudget)
        $rootScope.shops[i].utilizedbudget = parseFloat($rootScope.shops[i].utilizedbudget)+ parseFloat($scope.heads[j].amountutilized)
      }
    }
    if($scope.shop._id ==  $rootScope.shops[i]._id){
      $scope.shop = $rootScope.shops[i]
    }
  }  
}