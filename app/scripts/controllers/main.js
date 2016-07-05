'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the budgetTrackingApp
 */


 angular.module('budgetTrackingApp').controller('MainCtrl', ['$scope', '$rootScope', 'HeadService',
  function ($scope, $rootScope, HeadService) {
    
    $scope.user = {id:'1', name:'Ranjeet Verma'} 
    
      
    $rootScope.$on('shopselected', function(e, shop){
      generateGraph($scope, shop)
      getHeads($scope, shop, HeadService)
    })
}])

 function generateGraph($scope, shop){
    var graphMaxWidth = 500;
    $scope.budgets = [
      {budgetname:'ShopBudget', color:'#f1b62d', amount: shop.shopbudget},
      {budgetname:'Amended Budget', color:'#b44322', amount: shop.amendedbudget},
      {budgetname:'Amount Utilized', color:'#72ba22', amount: shop.utilizedbudget}
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
    $scope.utilisation = {percent:((100/$scope.budgets[1].amount) * $scope.budgets[2].amount).toFixed(0) + '%'}
 }

 function getHeads($scope, shop, HeadService){
  HeadService.getHeads().success(function(data){
    if(data && data.results){       
        $scope.heads = data.results
      }
  })
 }

