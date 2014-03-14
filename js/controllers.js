/* Controllers */

var mailControllers = angular.module('mailControllers', [])
	.controller('MailCtrl', ['$scope', 'Mail', '$location', '$anchorScroll', '$sce', '$http',
		function($scope, Mail, $location, $anchorScroll, $sce, $http) {
			Mail.query({}, function(data) {
				$scope.fetchContent(data);
			});

			// $scope.orderProp = 'DATELASTMODIFIED';

			$scope.fetchContent = function(data, append) {
				var mails = $scope.remap(data);

				if (mails.length) {
					$scope.mails = append ? $scope.mails.concat(mails) : mails;
				}

				$scope.updateDetails();
			}

			$scope.refresh = function() {
				location.reload();
			}

			$scope.updateSettings = function() {
				if ($scope.perpage && $scope.maxpages) {
					Mail.updateSettings({perpage: $scope.perpage, maxpages: $scope.maxpages}, function(status) {
						$scope.fadeOut();
						Mail.query({}, function(data) {
							$scope.fetchContent(data);
						});
					})
				}
			}

			// toggle checkbox - use to mark delete
			$scope.toggle = function() {
				angular.forEach($scope.mails, function(mail) {
					mail.deleteMark = !mail.deleteMark;
				})
			}

			$scope.toggleShow = function(e) {
				var mail = this.mail,
					src = e.srcElement || e.target,
					elem = '';

				if (!mail.show) {
					angular.forEach($scope.mails, function(mail) {
						mail.show = false;
					})
				}

				mail.show = !mail.show;

				if (mail.show) {
					elem = angular.element(src)[0];
					if (!mail.BODY) {
						Mail.show({mail: mail.NAME}, function(data) {
							mail.BODY = $sce.trustAsHtml(data.MAIL);
							$scope.scrollTo(elem);
						})
					} else {
						$scope.scrollTo(elem);
					}
				}

			}

			$scope.scrollTo = function(target, speed) {
				var speed = speed || 150,
					start = window.scrollY,
					step = (target.offsetTop - MAX_LEN_NAME + OFFSET_TOP - start) / speed;

				for (var i = 0; i <= speed;) {
					(function() {
						var to = start + step * i;
						setTimeout(function() {
							window.scrollTo(0, to);
						}, ++i)
					})();
				}
			}

			$scope.updateDetails = function() {
				if ($scope.mails && $scope.mails.length) {
					$scope.currentPage = $scope.getCurrentPage();
					$scope.totalPage = $scope.getTotalPage();
					$scope.maxpages = $scope.getMaxPages();
					$scope.perpage = $scope.getPerpage();
					$scope.pages = $scope.getPages();
				}

				// page focus
				angular.forEach($scope.pages, function(page) {
					page.actived = page.idx === $scope.currentPage ? 'actived' : '';
				})
			}

			$scope.fadeOut = function() {
				$scope.mails = [];
				$scope.pages = [];
			}

			$scope.toPage = function(idx) {

				if ($scope.getCurrentPage() === idx) return;

				$scope.fadeOut();

				Mail.toPage({idx: idx}, function(data) {
					$scope.fetchContent(data, true);
				})
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
						// $scope.pages = [];
					})
				})
			}

			$scope.deleteAll = function() {
				var msg = 'Are you sure to delete all emails?';
				if (window.confirm(msg)) {
					Mail.deleteAll({}, function(status) {
						$scope.fadeOut();
					});
				}
			}

			$scope.checkEmpty = function() {
				while (!$scope.mails.length) {
					if ($scope.currentPage == 1) break;

					Mail.toPage({idx: $scope.currentPage - 1}, function(data) {
						$scope.fetchContent(data, true);
					})
				}
			}

			$scope.getCurrentPage = function() {
				if ($scope.mails.length) {
					return $scope.mails[$scope.mails.length-1]['CURRENTPAGE'];
				}
				return 0;
			}

			$scope.getTotalPage = function() {
				if ($scope.mails.length) {
					return $scope.mails[$scope.mails.length-1]['TOTALPAGE'];
				}
				return 0;
			}

			$scope.getMaxPages = function() {
				if ($scope.mails.length) {
					return $scope.mails[$scope.mails.length-1]['MAXPAGE'];
				}
				return 0;
			}

			$scope.getPerpage = function() {
				if ($scope.mails.length) {
					return $scope.mails[$scope.mails.length-1]['PERPAGE'];
				}
				return 0;
			}

			$scope.getPages = function () {
				var offsetStart = Math.floor(($scope.maxpages - 1) / 2),
					offsetEnd = ($scope.maxpages - 1) - offsetStart,
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

				if ($scope.currentPage > 1) {
					if (start !== 1) {
						page = {
							idx: 1,
							label: 'first'
						}
						pages.push(page);
					}

					page = {
						idx: $scope.currentPage - 1,
						label: '«'
					}

					pages.push(page);
					page = {};
				}

				for (var i = start; i <= end; i++) {
					page.idx = i;
					pages.push(page);
					page = {};
				}

				if ($scope.currentPage < $scope.totalPage) {
					page = {
						idx: $scope.currentPage + 1,
						label: '»'
					}
					pages.push(page);

					if (end !== $scope.totalPage) {
						page = {
							idx: $scope.totalPage,
							label: 'last'
						}
						pages.push(page);
					}
					page = {};
				}

				return pages;
			}

			$scope.remap = function(data) {
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
		}
	])
	.controller('mailDetailCtrl', ['$scope', '$routeParams', 'Mail', '$sce', '$http',
		function($scope, $routeParams, Mail, $sce, $http) {
			Mail.show({mail: $routeParams.name}, function(data) {
				console.log(data);
				$scope.mail = $sce.trustAsHtml(data.MAIL);
			})
		}]
	);
