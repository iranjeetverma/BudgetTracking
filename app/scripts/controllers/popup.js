



angular.module('budgetTrackingApp').controller('popupCtrl', function ($scope) {
    $scope.header = 'Put here your header';
    $scope.body = 'Put here your body';
    $scope.footer = 'Put here your footer';
});
angular.module('budgetTrackingApp').directive('popupHeader', function() {
    return {
        restrict: 'C',
        scope: {
            title: '=modalTitle',
            header: '=modalHeader',
            body: '=modalBody',
            footer: '=modalFooter',
            callbackbuttonleft: '&ngClickLeftButton',
            callbackbuttonright: '&ngClickRightButton',
            handler: '=lolo'
        },
    };
});