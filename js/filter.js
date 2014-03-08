angular.module('mailFilters', []).
	filter('formatName', function() {
		return function(name) {
			var result =  name.replace(/(ATII|ETR)\sError:/, '').replace('[SEC=UNCLASSIFIED]', '').replace(/\[[^\[\]]*\]/, '');
			if (result.replace(/\s/g, '') === '') {
				result = '[SEC=UNCLASSIFIED]';
			}

			if (result.length > MAX_LEN_NAME) {
				return result.substring(1, MAX_LEN_NAME) + '...';
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