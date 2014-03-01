'use strict';

/* App Module */

angular.module('mailApp', [
	'ngRoute',
	'mailControllers',
	'mailFilters',
	'mailAnimations',
	'mailServices'
	])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.
			when('/', {
				templateUrl: 'partials/mail-list.html',
				controller: 'MailCtrl'
			}).
			when('/mail/:mailId', {
				templateUrl: 'partials/mail-detail.html',
				controller: 'mailDetailCtrl'
			}).
			otherwise({
				redirectTo: '/'
			});
		}])
	.directive('readMore', function() {
		return {
			restrict: 'E',
			template: '<div class="read-more"><div class="mail-body-hide" ng-transclude></div></div>',
			replace: true,
			transclude: true,
			compile: function(elem) {
				return {
					pre: function() {},
					post: function() { elem.readmore(); }
				};
			}
		};
	});
