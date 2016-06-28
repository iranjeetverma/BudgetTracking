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
   .otherwise({redirectTo: '/home'})
 }])

 app.controller('MainCtrl', MainCtrl)

 function MainCtrl($scope) {
   $scope.shops = [
     {id:'1', name:'4wh Final Assembly'},
     {id:'2', name:'3wh Final Assembly'},
     {id:'3', name:'Paint Shop'},
     {id:'4', name:'Machine Shop'},
     {id:'5', name:'4wh BIW'}]

   $scope.user = {id:'1', name:'Shripad S Pathak'}

   $scope.budgets = [
     {id:'1', budgetname:'ShopBudget', color:'#f1b62d', amount:'4950000'},
     {id:'2', budgetname:'Amended Budget', color:'#b44322', amount:'5250000'},
     {id:'3', budgetname:'Amount Utilised', color:'#72ba22', amount:'2200000'}]
 }
