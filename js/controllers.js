/* Controllers */

var mailControllers = angular.module('mailControllers', [])
	.controller('MailCtrl', ['$scope', 'Mail',
		function($scope, Mail) {
			Mail.query({}, function(data) {
				$scope.fetchContent(data);
			});

			$scope.orderProp = 'DATELASTMODIFIED';

			$scope.fetchContent = function(data, append) {
				var mails = remap(data);

				if (mails.length) {
					$scope.mails = append ? $scope.mails.concat(mails) : mails;
				}

				$scope.updateDetails();
			}

			$scope.toggle = function() {
				angular.forEach($scope.mails, function(mail) {
					mail.deleteMark = !mail.deleteMark;
				})
			}

			$scope.updateDetails = function() {
				if ($scope.mails && $scope.mails.length) {
					$scope.currentPage = $scope.mails[$scope.mails.length-1]['CURRENTPAGE'];
					$scope.totalPage = $scope.mails[$scope.mails.length-1]['TOTALPAGE'];
					$scope.pages = $scope.getPages();
				}

				// page focus
				angular.forEach($scope.pages, function(page) {
					page.actived = page.idx === $scope.currentPage ? 'actived' : '';
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

				Mail.toPage({idx: idx}, function(data) {
					$scope.fetchContent(data, true);
				})
			}

			$scope.nextPage = function() {
				$scope.mails = [];
				Mail.next({}, function(data) {
					$scope.fetchContent(data);
				});
			}

			$scope.delete = function() {
				var emailToDelete = [],
					newMails = [];

				angular.forEach($scope.mails, function(mail) {
					if (mail.deleteMark) {
						emailToDelete.push(mail.NAME);
					} else {
						newMails.push(mail);
					}
				})

				Mail.deleteList({lstMail: emailToDelete.join(',')}, function(status) {
					$scope.mails = newMails;

					Mail.concat({concatLen: emailToDelete.length}, function(data) {
						$scope.fetchContent(data, true);
						$scope.checkEmpty();
					})
				})
			}

			$scope.deleteAll = function() {
				var msg = 'Are you sure to delete all emails?';
				if (window.confirm(msg)) {
					Mail.deleteAll({}, function(status) {
						$scope.mails = [];
					});
				}
			}

			$scope.checkEmpty = function() {
				if (!$scope.mails.length) {
					Mail.pre({}, function(data) {
						$scope.fetchContent(data, true);
					});
				}
			}

			$scope.getPages = function () {
				var maxPages = $scope.mails[$scope.mails.length-1]['MAXPAGE'],
					offsetStart = Math.floor((maxPages - 1) / 2),
					offsetEnd = (maxPages - 1) - offsetStart,
					page = {},
					pages = [];

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
					page.idx = i;
					pages.push(page);
					page = {};
				}

				return pages;
			}
		}
	])
	.controller('mailDetailCtrl', ['$scope', '$routeParams', 'Mail', '$sce',
		function($scope, $routeParams, $Mail, $sce) {

			Mail.show({mail: $routeParams.mailId}, function(data) {
				$scope.mail = $sce.trustAHtml(data);
			})

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
