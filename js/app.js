/* App Module */

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
	})
	.directive('scrollIf', function () {
		return function (scope, element, attributes) {
			// console.log(scope);
			// console.log(element);
			// console.log(attributes);
			// console.log(scope.$eval(attributes.scrollIf));
			setTimeout(function () {
				if (scope.$eval(attributes.scrollIf)) {
					window.scrollTo(0, element[0].offsetTop - 100)
				}
			});
		}
	});
