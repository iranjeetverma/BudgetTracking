'use strict';

angular.module('budgetTrackingApp')
.controller('HeadCtrl', ['$scope', '$rootScope',function ($scope, $rootScope) {
    $scope.user = {id:'1', name:''} 
    $rootScope.openMenu = false;
    $scope.showMenu = function(){
    	$rootScope.openMenu = !$rootScope.openMenu
    	$rootScope.$emit('showMenu', $rootScope.openMenu)
    }
}]);
