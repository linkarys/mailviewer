/* App Module */
var MAX_LEN_NAME = 100;
var OFFSET_TOP = -30;

angular.module('mailApp', [
	'ngRoute',
	'mailControllers',
	'mailFilters',
	'mailAnimations',
	'ngSanitize',
	'mailServices'
	])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
			when('/', {
				templateUrl: 'partials/mail-list.html',
				controller: 'MailCtrl'
			}).
			when('/mail/:name', {
				templateUrl: 'partials/mail-detail.html',
				controller: 'mailDetailCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
		}])
