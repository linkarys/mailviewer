/* Controllers */

var mailControllers = angular.module('mailControllers', [])
	.controller('MailCtrl', ['$scope', 'Mail',
		function($scope, Mail) {
			Mail.query({}, function(data) {
				$scope.fetchContent(data);
			});
			// $scope.orderProp = 'DATELASTMODIFIED';

			$scope.fetchContent = function(data, append) {
				var mails = remap(data);

				if (mails.length) {
					$scope.mails = append ? $scope.mails.concat(mails) : mails;
				}

				$scope.updateDetails();
			}

			$scope.updateDetails = function() {
				if ($scope.mails.length) {
					$scope.currentPage = $scope.mails[$scope.mails.length-1]['CURRENTPAGE'];
					$scope.totalPage = $scope.mails[$scope.mails.length-1]['TOTALPAGE'];
					$scope.pages = $scope.getPages();
				}
			}

			$scope.nextPage = function() {
				$scope.mails = [];
				Mail.next({}, function(data) {
					$scope.fetchContent(data);
				});
			}

			$scope.delete = function(filename, idx) {
				Mail.get({action: 'delete', mail: filename}, function(status) {
					$scope.mails.splice(idx, 1);
					Mail.push({}, function(data) {
						$scope.fetchContent(data, true);
						// console.log($scope.mails.length);
						if (!$scope.mails.length) {
							Mail.pre({}, function(data) {
								$scope.fetchContent(data, true);
							});
						}
					});
				})
			}

			$scope.prePage = function() {
				$scope.mails = [];
				Mail.pre({}, function(data) {
					$scope.fetchContent(data, true);
				});
			}

			$scope.toPage = function(idx) {
				$scope.mails = [];
				Mail.get({action: 'toPage', idx: idx}, function(data) {
					$scope.fetchContent(data, true);
				});

				// Mail.query({idxPage: idxPage}, function(data) {
				// 	$scope.mails = remap(data);
				// 	$scope.currentPage = getCurrentPage($scope.mails);
				// 	$scope.totalPage = getTotalPage($scope.mails);
				// 	$scope.pages = getPages($scope);
				// });
			}

			$scope.getPages = function () {
				var maxPages = $scope.mails[$scope.mails.length-1]['MAXPAGE'];
				var offsetStart = (maxPages - 1) / 2 | 0;
				var offsetEnd = (maxPages - 1) - offsetStart;
				var pages = [];

				start = $scope.currentPage - offsetStart;
				end = $scope.currentPage + offsetEnd;

				if ($scope.currentPage - offsetStart < 1) {
					start = 1;
					end = offsetEnd + offsetStart + 1;
				} else if ($scope.currentPage + offsetEnd > $scope.totalPage){
					start = $scope.totalPage - offsetStart - offsetEnd;
					end = $scope.totalPage;
				}

				start = start < 1 ? 1 : start;
				end = end > $scope.totalPage ? $scope.totalPage : end;

				for (var i = start; i <= end; i++) {
					pages.push(i);
				}

				return pages;
			}
		}
	])
	.controller('mailDetailCtrl', ['$scope', '$routeParams', '$http', 'Mail', '$sce',
		function($scope, $routeParams, $http, $Mail, $sce) {

			$http.get('controller.cfm?action=show&mail=' + $routeParams.mailId).success(function(data) {
				document.write(data);
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
