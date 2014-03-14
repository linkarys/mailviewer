angular.module('mailServices', ['ngResource'])
.factory('Mail', ['$resource',
	function($resource){
		return $resource('controller.cfm', {}, {
		// return $resource('data/data.js', {}, {
			query: {method:'GET', params:{action:'list'}, isArray: false},
			buildJson: {method:'GET', params:{action:'buildJson'}, isArray: false},
			concat: {method:'GET', params:{action:'concat'}, isArray: false},
			show: {method:'GET', params:{action:'show'}, isArray: false},
			getMail: {method:'GET', params:{action:'show'}, isArray: false},
			toPage: {method:'GET', params:{action:'toPage'}, isArray: false},
			deleteAll: {method:'GET', params:{action:'deleteAll'}, isArray: false},
			deleteList: {method:'GET', params:{action:'deleteList'}, isArray: false},
			updateSettings: {method:'GET', params:{action:'updateSettings'}, isArray: false},
		});
	}]);