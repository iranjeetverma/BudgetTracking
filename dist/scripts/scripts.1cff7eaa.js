"use strict";function generateGraph(a,b){calcShopBudgets(a,b);var c=450;a.budgets=[{budgetname:"ShopBudget",color:"#f1b62d",amount:a.shop.shopbudget},{budgetname:"Amended Budget",color:"#b44322",amount:a.shop.amendedbudget},{budgetname:"Amount Utilized",color:"#72ba22",amount:a.shop.utilizedbudget}];var d=a.budgets[0].amount;d=a.budgets[0].amount>a.budgets[1].amount&&a.budgets[0].amount>a.budgets[2].amount?a.budgets[0].amount:a.budgets[1].amount>a.budgets[0].amount&&a.budgets[1].amount>a.budgets[2].amount?a.budgets[1].amount:a.budgets[2].amount,a.budgets[0].width=c/d*a.budgets[0].amount,a.budgets[1].width=c/d*a.budgets[1].amount,a.budgets[2].width=c/d*a.budgets[2].amount,a.utilisationTitle="%Utilization",a.utilisation={percent:a.budgets[2].amount<=0?0:100/a.budgets[1].amount*a.budgets[2].amount}}function loadShopData(a,b,c,d,e){c.getHeads().success(function(c){c&&c.results&&(a.heads=c.results.filter(function(a){var c=moment(a.createdTimestamp,"DD-MM-YYYY"),d=c.year();return c.month()+1>=b.startoftheyear&&a.year==d?a:c.month()+1<b.startoftheyear&&a.year+1==d?a:""}),d.getRequitisions().success(function(c){c&&c.results&&(a.requisitions=c.results,e.getPO().success(function(c){if(c&&c.results){a.po=c.results;for(var d=0;d<a.requisitions.length;d++){a.requisitions[d].po=[];for(var e=0;e<a.po.length;e++)a.requisitions[d]._id==a.po[e].requsitionid&&a.requisitions[d].po.push(a.po[e])}}for(var f=0;f<a.heads.length;f++){a.heads[f].requisitions=[],a.heads[f].amountutilized=0,a.heads[f].amendedbudget=a.heads[f].amendedbudget?a.heads[f].amendedbudget:a.heads[f].budget;for(var g=0;g<a.requisitions.length;g++){a.heads[f]._id==a.requisitions[g].headid&&a.heads[f].requisitions.push(a.requisitions[g]);for(var d=0;d<a.po.length;d++)a.heads[f]._id==a.requisitions[g].headid&&a.po[d].requsitionid==a.requisitions[g]._id&&(a.heads[f].amountutilized=parseFloat(a.heads[f].amountutilized)+parseFloat(a.po[d].amount))}}generateGraph(a,b)})),b.requisitions=a.requisitions}),b.heads=a.heads)})}function calcShopBudgets(a,b){for(var c=0;c<b.shops.length;c++){b.shops[c].amendedbudget=0,b.shops[c].utilizedbudget=0;for(var d=0;d<a.heads.length;d++)b.shops[c]._id==a.heads[d].shopid&&(b.shops[c].amendedbudget=parseFloat(b.shops[c].amendedbudget)+parseFloat(a.heads[d].amendedbudget),b.shops[c].utilizedbudget=parseFloat(b.shops[c].utilizedbudget)+parseFloat(a.heads[d].amountutilized));a.shop._id==b.shops[c]._id&&(a.shop=b.shops[c])}}angular.module("budgetTrackingApp",["ngAnimate","ngSanitize","ngRoute","ngDialog","720kb.datepicker"]);var app=angular.module("budgetTrackingApp");app.constant("entribServices",{queryParams:"?customerid=1&userid=1",shopURL:"http://jira.entrib.com/server/elements/shop/records",headURL:"http://jira.entrib.com/server/elements/head/records",requisitionURL:"http://jira.entrib.com/server/elements/requisition/records",poURL:"http://jira.entrib.com/server/elements/po/records",yearURL:"http://jira.entrib.com/server/elements/financialyear/records"}),angular.module("budgetTrackingApp").config(["$routeProvider",function(a){a.when("/home",{templateUrl:"shopsummary.html",controller:"ShopCtrl"}).when("/requisition",{templateUrl:"requisition.html",controller:"RequisitionCtrl"}).otherwise({redirectTo:"/home"})}]),angular.module("budgetTrackingApp").controller("ShopCtrl",["$scope","$rootScope","ShopService","$location",function(a,b,c,d){a.getShops=function(){c.getShops().success(function(c){c&&c.results&&(a.shops=c.results,b.shops=a.shops,b.selectedShopForNav||(a.selectedShopForNav=a.shops[0],b.selectedShopForNav=a.selectedShopForNav),b.$emit("shopselected",a.selectedShopForNav))})},a.getShops(),a.selectShop=function(c){a.selectedShopForNav=c,b.selectedShopForNav=a.selectedShopForNav,b.$emit("shopselected",a.selectedShopForNav),d.path("home")}}]),angular.module("budgetTrackingApp").controller("MainCtrl",["$scope","$rootScope","HeadService","RequisitionService","POService","ngDialog","YearService",function(a,b,c,d,e,f,g){b.$on("shopselected",function(f,h){a.shop=h,a.heads?generateGraph(a,b):g.getYear().success(function(f){b.startoftheyear=f.results[0].startoftheyear,loadShopData(a,b,c,d,e)})}),a.updateBudgetHead=function(d,e){""==e.amendedbudget&&(e.amendedbudget=0),e.amendedbudget&&"0"==e.amendedbudget.slice(0,1)&&e.amendedbudget.length>1&&(e.amendedbudget=e.amendedbudget.slice(1,e.amendedbudget.length)),13==d&&(e.isupdating=!0,c.updateHead(e._id,{amendedbudget:e.amendedbudget}).success(function(){e.isupdating=!1,generateGraph(a,b)})),generateGraph(a,b)},a.approveRequisition=function(a){a.isupdating=!0,d.updateRequitision(a._id,{isapproved:a.isapproved}).success(function(){a.isupdating=!1})},a.openHead=function(c){a.activeHead==c?a.activeHead=void 0:(a.activeHead=c,b.activeHead=a.activeHead)},a.createHead=function(){a.newhead={shopid:a.shop._id},a.createHeadDialog=f.open({template:"createHead.html",className:"ngdialog-theme-default",scope:a})},a.saveHead=function(){a.newhead.headname&&a.newhead.budget&&a.newhead.headcode&&a.newhead.remarks?(a.isHeadSaving=!0,c.saveHead(a.newhead).success(function(){a.isHeadSaving=!1,loadShopData(a,b,c,d,e),f.close(a.createHeadDialog)})):f.open({template:'<p class="no-data">Please fill all the required details</p>',plain:!0})},a.groupBudget=function(){a.totalBudget=0,a.totalAmendedBudget=0,a.totalUtilizedBudget=0;for(var c=0;c<b.shops.length;c++)a.totalBudget=parseFloat(a.totalBudget)+parseFloat(b.shops[c].shopbudget),a.totalAmendedBudget=parseFloat(a.totalAmendedBudget)+parseFloat(b.shops[c].amendedbudget),a.totalUtilizedBudget=parseFloat(a.totalUtilizedBudget)+parseFloat(b.shops[c].utilizedbudget);f.open({template:"groupBudget.html",className:"ngdialog-theme-default",scope:a,width:"60%"})},b.getCurrentFinYear=function(){return b.startoftheyear<=moment().month()+1?1==b.startoftheyear?moment().year():(moment().year()+"").substring(2)+(parseInt((moment().year()+"").substring(2))+1):parseInt((moment().year()+"").substring(2))-1+(moment().year()+"").substring(2)},a.createPo=function(c){var d=1;for(a.po&&a.po.length>0&&(a.po.sort(function(a,b){return parseInt(_.last(a.ponumber.split("/")))<parseInt(_.last(b.ponumber.split("/")))?-1:1}),d=parseInt(_.last(_.last(a.po).ponumber.split("/")))+1+"");(d+"").length<3;)d="0"+d;a.requisitionPOAmount=0,c.po.forEach(function(b){a.requisitionPOAmount+=b.amount}),a.currentRequisition=c,a.newpo={requsitionid:c._id,ponumber:"PO/"+b.getCurrentFinYear()+"/"+d,date:(new Date).getDate()+"-"+((new Date).getMonth()+1)+"-"+(new Date).getFullYear()},a.createPoDialog=f.open({template:"createPO.html",className:"ngdialog-theme-default",scope:a})},a.savePO=function(){a.newpo.ponumber&&a.newpo.date&&a.newpo.amount&&a.newpo.description?(a.isPOSaving=!0,e.savePO(a.newpo).success(function(){a.isPOSaving=!1,loadShopData(a,b,c,d,e),f.close(a.createPoDialog)})):f.open({template:'<p class="no-data">Please fill all the required details</p>',plain:!0})}}]),angular.module("budgetTrackingApp").controller("HeadCtrl",["$scope",function(a){a.user={id:"1",name:"Ranjeet Verma"}}]),angular.module("budgetTrackingApp").controller("RequisitionCtrl",["$scope","$rootScope","RequisitionService","$location","ngDialog",function(a,b,c,d,e){a.selectedShopForNav||d.path("home"),a.today=new Date,a.activeHead=b.activeHead,a.selectedShopForNav=b.selectedShopForNav,a.categories=["Productivity","Quality","Cost","Delivery","SHE","Replacement","Reconditioning","New Model","Introduction","Others"],a.heads=b.heads,a.quarters=[0,0,0,0],a.heads&&a.heads.forEach(function(c){c.shopid==a.selectedShopForNav._id&&c.requisitions&&c.requisitions.forEach(function(c){var d=moment(c.createdTimestamp,"DD-MM-YYYY").month()+1;d=d<b.startoftheyear?d+12:d;for(var e=b.startoftheyear,f=0;d>=e;)e+=3,f++;a.quarters[f-1]+=parseInt(c.amount)})}),a.requisitionnumberprefix=(a.selectedShopForNav.division?a.selectedShopForNav.division+"/":"")+(a.selectedShopForNav.shortname?a.selectedShopForNav.shortname+"/":"")+b.getCurrentFinYear(),a.getNextRequisitionNumber=function(){var a=1;if(b.requisitions&&b.requisitions.length>0)for(b.requisitions.sort(function(a,b){return parseInt(_.last(a.requisitionnumber.split("/")))<parseInt(_.last(b.requisitionnumber.split("/")))?-1:1}),a=parseInt(_.last(_.last(b.requisitions).requisitionnumber.split("/")))+1+"";a.length<3;)a="0"+a;return a},a.newrequisition={headid:a.activeHead._id,category:a.categories[0],shopname:a.selectedShopForNav.shopname,requisitionnumber:a.requisitionnumberprefix+"/"+a.getNextRequisitionNumber(),suppliers:[]},a.saveRequisition=function(){a.newrequisition.supplier1=a.newrequisition.suppliers[0],a.newrequisition.supplier2=a.newrequisition.suppliers[1],a.newrequisition.supplier3=a.newrequisition.suppliers[2],a.newrequisition.selectedsupplier==a.newrequisition.supplier1&&(a.newrequisition.amount=a.newrequisition.negotiatedcost1),a.newrequisition.selectedsupplier==a.newrequisition.supplier2&&(a.newrequisition.amount=a.newrequisition.negotiatedcost2),a.newrequisition.selectedsupplier==a.newrequisition.supplier3&&(a.newrequisition.amount=a.newrequisition.negotiatedcost3),a.newrequisition.supplier1&&a.newrequisition.supplier2&&a.newrequisition.quotedcost1&&a.newrequisition.quotedcost2&&a.newrequisition.negotiatedcost1&&a.newrequisition.negotiatedcost2&&a.newrequisition.selectedsupplier&&a.newrequisition.reasonsuppliersection&&a.newrequisition.justification&&a.newrequisition.categorydetails&&a.newrequisition.category&&a.newrequisition.qty&&a.newrequisition.description&&a.newrequisition.cell?c.saveRequitision(a.newrequisition).success(function(){b.heads.forEach(function(b){b._id==a.newrequisition.headid&&(a.newrequisition.createdTimestamp=moment().date()+"-"+(moment().month()+1)+"-"+moment().year(),b.requisitions.push(a.newrequisition))}),d.path("home")}):e.open({template:'<p class="no-data">Please fill all the required details</p>',plain:!0})}}]),angular.module("budgetTrackingApp").factory("ShopService",["$http","entribServices",function(a,b){return{getShops:function(){return a.get(b.shopURL+b.queryParams)}}}]),angular.module("budgetTrackingApp").factory("HeadService",["$http","entribServices",function(a,b){return{getHeads:function(){return a.get(b.headURL+b.queryParams)},updateHead:function(c,d){return a.put(b.headURL+"/"+c+b.queryParams,d)},saveHead:function(c){return c.newhead="true",c.siteName="abc",c.year=moment().year(),a.post(b.headURL+b.queryParams,c)}}}]),angular.module("budgetTrackingApp").factory("RequisitionService",["$http","entribServices",function(a,b){return{getRequitisions:function(){return a.get(b.requisitionURL+b.queryParams)},updateRequitision:function(c,d){return a.put(b.requisitionURL+"/"+c+b.queryParams,d)},saveRequitision:function(c){return c.siteName="abc",a.post(b.requisitionURL+b.queryParams,c)}}}]),angular.module("budgetTrackingApp").factory("POService",["$http","entribServices",function(a,b){return{getPO:function(){return a.get(b.poURL+b.queryParams)},savePO:function(c){return c.siteName="abc",a.post(b.poURL+b.queryParams,c)}}}]),angular.module("budgetTrackingApp").factory("YearService",["$http","entribServices",function(a,b){return{getYear:function(){return a.get(b.yearURL+b.queryParams)}}}]),angular.module("budgetTrackingApp").directive("budgetHead",function(){return{restrict:"E",templateUrl:"budgetHeadTemplate.html"}}),angular.module("budgetTrackingApp").directive("budgetRequisition",function(){return{restrict:"E",templateUrl:"budgetRequisitionTemplate.html"}}),angular.module("budgetTrackingApp").directive("budgetPo",function(){return{restrict:"E",templateUrl:"budgetPOTemplate.html"}}),angular.module("budgetTrackingApp").filter("shop",function(){return function(a,b){for(var c=[],d=0;a&&d<a.length;d++)a[d].shopid==b&&c.push(a[d]);return c}}),angular.module("budgetTrackingApp").filter("length",function(){return function(a,b){if(b=parseInt(b),isNaN(a)||isNaN(b))return a;if(a.toString().length<b){for(var c=a.toString().length;b>c;c++)a="0"+a;return a}return a}});