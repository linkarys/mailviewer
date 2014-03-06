angular.module('mailServices', ['ngResource'])
.factory('Mail', ['$resource',
	function($resource, abc){
		return $resource('controller.cfm/:filename', {filename: '@filename'}, {
		// return $resource('data/data.js', {}, {
			query: {method:'GET', params:{action:'list'}, isArray: false},
			push: {method:'GET', params:{action:'push'}, isArray: false},
			show: {method:'GET', params:{action:'show'}, isArray: false},
			next: {method:'GET', params:{action:'nextPage'}, isArray: false},
			pre: {method:'GET', params:{action:'prePage'}, isArray: false},
			delete: {method:'GET', params:{action:'delete'}, isArray: false},
		});
	}]);