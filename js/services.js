angular.module('mailServices', ['ngResource'])
.factory('Mail', ['$resource',
	function($resource){
		return $resource('controller.cfm', {}, {
		// return $resource('data/data.js', {}, {
			query: {method:'GET', params:{action:'list'}, isArray: false},
			show: {method:'GET', params:{action:'show'}, isArray: false}
		});
	}]);