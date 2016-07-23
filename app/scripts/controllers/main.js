'use strict';

/**
 * @ngdoc function
 * @name budgetTrackingApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the budgetTrackingApp
 */

angular.module('budgetTrackingApp').controller('MainCtrl', 
  ['$scope','$rootScope', 'HeadService', 'RequisitionService', 'POService', 'ngDialog', 'YearService', '$timeout', 
    function ($scope, $rootScope, HeadService, RequisitionService, POService, ngDialog, YearService, $timeout) {
      $rootScope.checkNumber = function(number) {
        if(number == undefined || number == null || number < 0 || number == ""){
          return false;
        }
        return true;
      }
      
      $rootScope.handleError = function(data, status, exception){
        $rootScope.showNetworkError = true;
          $timeout(function () {
            $rootScope.showNetworkError = false;
        }, 3500);
      }

      $rootScope.$on('shopselected', function(e, shop){
        document.getElementById('main').scrollTop  = 0;
        $rootScope.openMenu = false
        $rootScope.$emit('showMenu', $rootScope.openMenu)
        $scope.shop = shop
        if(!$scope.heads){
          YearService.getYear().success(function(yearData){
            $rootScope.startoftheyear = yearData.results[0].startoftheyear;
            loadShopData($scope, $rootScope, HeadService, RequisitionService, POService)
          }).error(function(data, status){
              $rootScope.handleError(data, status)
            }).catch(function(exception){
              $rootScope.handleError(null, null, exception)
            })  
        }else{
          generateGraph($scope, $rootScope)
        }
      })

      $scope.updateBudgetHead = function(keyCode, head){        
        if(keyCode == 13 && $rootScope.checkNumber(head.amendedbudget)){          
          head.isupdating = true
          HeadService.updateHead(head._id, {amendedbudget: head.amendedbudget}).success(function(){
            head.isupdating = false;
            generateGraph($scope, $rootScope)
          }).error(function(data, status){
              head.isupdating = false;
              $rootScope.handleError(data, status)
            }).catch(function(exception){
              head.isupdating = false;
              $rootScope.handleError(null, null, exception)
            })  
        }
        generateGraph($scope, $rootScope)
      }

      $scope.approveRequisition = function(requisition){
          requisition.isupdating = true        
          RequisitionService.updateRequitision(requisition._id, {isapproved :requisition.isapproved}).success(function(){
            requisition.isupdating = false
          }).error(function(data, status){
            requisition.isupdating = false
            $rootScope.handleError(data, status)
          }).catch(function(exception){
            requisition.isupdating = false
            $rootScope.handleError(null, null, exception)
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
          template: 'createHead.html', 
          className: 'ngdialog-theme-default',
          scope: $scope,
          closeByDocument: false
        });
      }
       $scope.saveHead = function(){
        if($scope.newhead.headname && 
          $rootScope.checkNumber($scope.newhead.budget) &&
          $scope.newhead.headcode && 
          $scope.newhead.remarks){
          $scope.isHeadSaving = true              
          HeadService.saveHead($scope.newhead).success(function(){
             $scope.isHeadSaving = false          
             loadShopData($scope, $rootScope, HeadService, RequisitionService, POService)
             ngDialog.close( $scope.createHeadDialog)
          }).error(function(data, status){
              $scope.isHeadSaving = false  
              $rootScope.handleError(data, status)
            }).catch(function(exception){
              $scope.isHeadSaving = false  
              $rootScope.handleError(null, null, exception)
            })  
        }else{
            ngDialog.open({ 
                template: '<p class="no-data">All fields are Mandatory to create a new head</p>',
                plain: true
            });
        }
      }
      $scope.groupBudget = function(){
        $scope.totalBudget =0;
        $scope.totalAmendedBudget = 0;
        $scope.totalUtilizedBudget = 0;
        for(var i=0; i< $rootScope.shops.length; i++){
          $scope.totalBudget = parseFloat($scope.totalBudget) + parseFloat($rootScope.shops[i].shopbudget)
          $scope.totalAmendedBudget = parseFloat($scope.totalAmendedBudget) + parseFloat($rootScope.shops[i].amendedbudget)
          $scope.totalUtilizedBudget = parseFloat($scope.totalUtilizedBudget) + parseFloat($rootScope.shops[i].utilizedbudget)
        }
        ngDialog.open({ 
          template: 'groupBudget.html', 
          className: 'ngdialog-theme-default',
          scope: $scope,
          width: '60%'
        });
      }
      $rootScope.getCurrentFinYear = function(){
        if($rootScope.startoftheyear <= moment().month()+1){
          if($rootScope.startoftheyear == 1){
            return moment().year();
          }
          return (moment().year()+'').substring(2) + (parseInt((moment().year()+'').substring(2))+1)
        }else{
          return (parseInt((moment().year()+'').substring(2))-1) + (moment().year()+'').substring(2)
        }
      }
      $scope.createPo = function(requisition){
        var nextPO = 1;
        if($scope.po && $scope.po.length > 0){
            $scope.po.sort(function(p1, p2){
                return parseInt(_.last(p1.ponumber.split('/'))) < parseInt(_.last(p2.ponumber.split('/'))) ? -1 : 1;
            })
            nextPO = (parseInt(_.last(_.last($scope.po).ponumber.split('/'))) + 1) +'';
        }
        while((nextPO+'').length < 3){
          nextPO = '0'+nextPO;
        }
        $scope.requisitionPOAmount = 0;
        if(!requisition.po){
          requisition.po = []
        }
        requisition.po.forEach(function(po){
          $scope.requisitionPOAmount += po.amount;
        })
        $scope.currentRequisition = requisition
        $scope.newpo = {            
            requsitionid: requisition._id,
            ponumber: "PO/"+$rootScope.getCurrentFinYear()+"/"+nextPO,
            date: (new Date()).getDate() +'-'+ ((new Date()).getMonth()+1) +'-'+ (new Date()).getFullYear()
        }
        $scope.createPoDialog = ngDialog.open({ 
          template: 'createPO.html', 
          className: 'ngdialog-theme-default',
          scope: $scope,
          closeByDocument: false
        });
      }
      $scope.savePO = function(){
        if($scope.newpo.ponumber && 
          $scope.newpo.date && 
          $rootScope.checkNumber($scope.newpo.amount) &&
          $scope.newpo.description){
          $scope.isPOSaving = true
          POService.savePO($scope.newpo).success(function(){
             $scope.isPOSaving = false
             loadShopData($scope, $rootScope, HeadService, RequisitionService, POService)
             ngDialog.close( $scope.createPoDialog)  
          }).error(function(data, status){
              $scope.isPOSaving = false 
              $rootScope.handleError(data, status)
            }).catch(function(exception){
              $scope.isPOSaving = false
              $rootScope.handleError(null, null, exception)
            }) 
        }else{
            ngDialog.open({ 
                template: '<p class="no-data">All fields are Mandatory to create a new po</p>',
                plain: true
            });
        }
      }
}])

function generateGraph($scope, $rootScope){
    calcShopBudgets($scope, $rootScope)
    var graphMaxWidth = 450;
    $scope.budgets = [
      {budgetname:'ShopBudget', color:'#f1b62d', amount: $scope.shop.shopbudget},
      {budgetname:'Amended Budget', color:'#b44322', amount: $scope.shop.amendedbudget? $scope.shop.amendedbudget :0 },
      {budgetname:'Amount Utilized', color:'#72ba22', amount: $scope.shop.utilizedbudget}
    ]
    var highest = Math.max($scope.budgets[0].amount, $scope.budgets[1].amount, $scope.budgets[2].amount)

    $scope.budgets[0].width = (graphMaxWidth/highest) * $scope.budgets[0].amount
    $scope.budgets[1].width = (graphMaxWidth/highest) * $scope.budgets[1].amount
    $scope.budgets[2].width = (graphMaxWidth/highest) * $scope.budgets[2].amount
    $scope.utilisationTitle = "%Utilization"
    $scope.utilisation = { percent: $scope.budgets[2].amount <= 0 ? 0  : (100/$scope.budgets[1].amount) * $scope.budgets[2].amount }
}

function loadShopData($scope, $rootScope, HeadService, RequisitionService, POService){
  HeadService.getHeads().success(function(headData){
    if(headData && headData.results){
        $scope.heads = headData.results.filter(function(head){          
          var headDate = moment(head.createdTimestamp, 'DD-MM-YYYY')          
          var headYear = headDate.year()
          return (headDate.month()+1) >= $rootScope.startoftheyear && head.year == headYear ? head : (headDate.month()+1) < $rootScope.startoftheyear && head.year+1 == headYear ? head : "" 
        })
        RequisitionService.getRequitisions().success(function(reqData){
          if(reqData && reqData.results){
              $scope.requisitions = reqData.results
                POService.getPO().success(function(poData){
                  if(poData && poData.results){
                    $scope.po = poData.results
                    for(var k = 0; k< $scope.requisitions.length; k++){
                      $scope.requisitions[k].po = [];
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
                    $scope.heads[i].amendedbudget = ($scope.heads[i].amendedbudget || $scope.heads[i].amendedbudget == 0) ? $scope.heads[i].amendedbudget : $scope.heads[i].budget;
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
            $rootScope.requisitions = $scope.requisitions;
        })
        $rootScope.heads = $scope.heads;           
      }     
  }) 
}
function calcShopBudgets($scope, $rootScope){
  for(var i=0; i< $rootScope.shops.length; i++){
    $rootScope.shops[i].amendedbudget = 0;
    $rootScope.shops[i].utilizedbudget = 0;
    for(var j = 0; j <  $scope.heads.length; j++){
      if($rootScope.shops[i]._id == $scope.heads[j].shopid){
        $rootScope.shops[i].amendedbudget = parseFloat($rootScope.shops[i].amendedbudget) + ($scope.heads[j].amendedbudget && $scope.heads[j].amendedbudget != "." ? parseFloat($scope.heads[j].amendedbudget) : 0)
        $rootScope.shops[i].utilizedbudget = parseFloat($rootScope.shops[i].utilizedbudget)+ parseFloat($scope.heads[j].amountutilized)
      }
    }
    if($scope.shop._id ==  $rootScope.shops[i]._id){
      $scope.shop = $rootScope.shops[i]
    }
  }  
}
