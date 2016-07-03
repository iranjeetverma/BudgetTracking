'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the budgetTrackingApp
 */
 var app = angular.module('budgetTrackingApp', ['ngRoute'])

 app.config(['$routeProvider', function($routeProvider) {
   $routeProvider
   .when('/home', {templateUrl: 'views/shopsummary.html', controller: 'MainCtrl'})
   .when('/head', {templateUrl: 'views/newHead.html', controller: 'MainCtrl'})
   .when('/requtionform', {templateUrl: 'views/requtionform.html', controller: 'MainCtrl'})
   .when('/poform', {templateUrl: 'views/poform.html', controller: 'MainCtrl'})
   .otherwise({redirectTo: '/home'})
 }])

 app.controller('MainCtrl', MainCtrl)

 function MainCtrl($scope, $timeout) {
   $scope.shops = [
     {id:'1', name:'4wh Final Assembly'},
     {id:'2', name:'3wh Final Assembly'},
     {id:'3', name:'Paint Shop'},
     {id:'4', name:'Machine Shop'},
     {id:'5', name:'4wh BIW'}]
   $scope.selectedShopForNewHead = $scope.shops[0]

   $scope.user = {id:'1', name:'Shripad S Pathak'}

   $scope.budgets = [
     {id:'1', budgetname:'ShopBudget', color:'#f1b62d', amount:49002},
     {id:'2', budgetname:'Amended Budget', color:'#b44322', amount:50256},
     {id:'3', budgetname:'Amount Utilized', color:'#72ba22', amount:41245}]
  var graphMaxWidth = 500;
  $timeout(function(){
    $scope.budgets[0].width = (graphMaxWidth/$scope.budgets[1].amount) * $scope.budgets[0].amount
    $scope.budgets[1].width = graphMaxWidth
    $scope.budgets[2].width = (graphMaxWidth/$scope.budgets[1].amount) * $scope.budgets[2].amount
  })
  $scope.utilisation = {percent:((100/$scope.budgets[1].amount) * $scope.budgets[2].amount).toFixed(2) + '%'}

  $scope.requisition ={ id:'1',
                        requisitionname:'Conveyor Repair',
                        budget: 1200000,
                        amendedBudget: 1250000,
                        amountutilized:950000,
                        Utilized:12
                      }

  $scope.selectedShopForNav = $scope.shops[0]
  $scope.selectShop = function(shop){
    $scope.selectedShopForNav = shop
  }
 }
