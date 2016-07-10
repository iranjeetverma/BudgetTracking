'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.today = new Date()    
    $scope.activeHead = $rootScope.activeHead
    $scope.shop = $rootScope.selectedShopForNav
}]);
