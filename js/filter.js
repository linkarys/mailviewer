angular.module('mailFilters', []).
	filter('formatName', function() {
		return function(name) {
			var result =  name.replace('ATII Error:', '').replace('[SEC=UNCLASSIFIED]', '').replace(/\[[^\[\]]*\]/, '');
			if (result.replace(/\s/g, '') === '') {
				result = '[SEC=UNCLASSIFIED]';
			}
			return result;
		}
	}).
	filter('formatDate', function() {
		return function(date) {
			return date.replace(/\d{2}:\d{2}:\d{2}/, '');
		}
	}).
	filter('formatContent', function() {
		return function(data) {
			return data;
		}
	})