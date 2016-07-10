'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', '$rootScope', function ($scope, $rootScope) {
    $scope.today = new Date()    
    $scope.activeHead = $rootScope.activeHead
    $scope.selectedShopForNav = $rootScope.selectedShopForNav
    $scope.categories = ['Productivity', 'Quality', 'Cost', 'Delivery', 'SHE', 'Replacement', 'Reconditioning', 'New Model', 'Introduction', 'Others']

    $scope.newhead = {
    	category: $scope.categories[0],
    	shopname: $scope.selectedShopForNav.shopname
    }
}]);
