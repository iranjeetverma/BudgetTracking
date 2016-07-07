var app = angular.module('budgetTrackingApp')

app.constant('entribServices', {
	queryParams: '?customerid=1&userid=1',
	shopURL: 'http://jira.entrib.com/server/elements/shop/records',
	headURL: 'http://jira.entrib.com/server/elements/head/records',
	requisitionURL: 'http://jira.entrib.com/server/elements/requisition/records',
	poURL: 'http://jira.entrib.com/server/elements/po/records'
})