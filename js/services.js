angular.module('mailServices', ['ngResource'])
.factory('Mail', ['$resource',
	function($resource, abc){
		return $resource('controller.cfm', {}, {
		// return $resource('data/data.js', {}, {
			query: {method:'GET', params:{action:'list'}, isArray: false},
			concat: {method:'GET', params:{action:'concat'}, isArray: false},
			show: {method:'GET', params:{action:'show'}, isArray: false},
			next: {method:'GET', params:{action:'nextPage'}, isArray: false},
			pre: {method:'GET', params:{action:'prePage'}, isArray: false},
			toPage: {method:'GET', params:{action:'toPage'}, isArray: false},
			deleteAll: {method:'GET', params:{action:'deleteAll'}, isArray: false},
			deleteList: {method:'GET', params:{action:'deleteList'}, isArray: false},
		});
	}]);