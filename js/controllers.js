/* Controllers */

var mailControllers = angular.module('mailControllers', [])
	.controller('MailCtrl', ['$scope', 'Mail',
		function($scope, Mail) {
			Mail.query({}, function(data) {
				$scope.mails = remap(data);
				$scope.currentPage = getCurrentPage($scope.mails);
				$scope.totalPage = getTotalPage($scope.mails);
			});
			$scope.orderProp = 'DATELASTMODIFIED';

			$scope.nextPage = function() {
				$scope.mails = [];
				Mail.next({}, function(data) {
					// console.log(remap(data));
					$scope.mails = remap(data);
					$scope.currentPage = getCurrentPage($scope.mails);
					$scope.totalPage = getTotalPage($scope.mails);
					// console.log($scope.mails);
				});
			}

			$scope.delete = function(name) {
				Mail.delete({fileName: name}, function(data) {
					// console.log(remap(data));
					$scope.mails = remap(data);
					$scope.currentPage = getCurrentPage($scope.mails);
					$scope.totalPage = getTotalPage($scope.mails);
					// console.log($scope.mails);
				});
			}

			$scope.prePage = function() {
				$scope.mails = [];
				Mail.pre({}, function(data) {
					// console.log(data);
					$scope.mails = remap(data);
					$scope.currentPage = getCurrentPage($scope.mails);
					$scope.totalPage = getTotalPage($scope.mails);
					// console.log($scope.mails);
				});
			}
		}
	])
	.controller('mailDetailCtrl', ['$scope', '$routeParams', '$http', 'Mail', '$sce',
		function($scope, $routeParams, $http, $Mail, $sce) {

			$http.get('controller.cfm?action=show&mail=' + $routeParams.mailId).success(function(data) {
				$scope.mail = $sce.trustAHtml(data);
			});

			// function($scope, $routeParams, $Mail) {
			// 	$Mail.show({mail: $routeParams.mailId}, function(data) {
			// 		$scope.mail = data;
			// 		console.log($routeParams);
			// 		console.log(data);
			// 		document.write($scope.mail);
			// 	})
			// }]
		}]
	);


function remap(data) {
	var result = [];
	for (var i = 0; i < data.DATA.length; i++) {
		var tmp = {};
		for (var j = 0; j < data.COLUMNS.length; j++) {
			tmp[data.COLUMNS[j]] = data.DATA[i][j];
		}
		result.push(tmp);
	}
	return result;
}

function getCurrentPage(mails) {
	if (mails.length) {
		return mails[0]['CURRENTPAGE'];
	}
}

function getTotalPage(mails) {
	if (mails.length) {
		return mails[0]['TOTALPAGE'];
	}
}
