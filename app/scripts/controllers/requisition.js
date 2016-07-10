'use strict';

angular.module('budgetTrackingApp')
.controller('RequisitionCtrl', ['$scope', 'HeadService', function ($scope, HeadService) {
    $scope.today = new Date()    
    $scope.activeHead = HeadService.getActiveHead()
}]);
