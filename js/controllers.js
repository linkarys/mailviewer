/* Controllers */

var mailControllers = angular.module('mailControllers', [])
	.controller('MailCtrl', ['$scope', 'Mail', '$location', '$anchorScroll', '$sce', '$http',
		function($scope, Mail, $location, $anchorScroll, $sce, $http) {
			Mail.query({}, function(data) {
				$scope.fetchContent(data);
				$scope.checkNewMail();
			});

			// $scope.orderProp = 'DATELASTMODIFIED';

			$scope.fetchContent = function(data, append, prepend) {
				var mails = $scope.remap(data);

				if (mails.length) {
					if (append) {
						$scope.mails = $scope.mails.concat(mails);
					} else if (prepend) {
						$scope.mails = mails.concat($scope.mails);
					} else {
						$scope.mails = mails;
					}
				}

				$scope.updateDetails(append);
			}

			$scope.refresh = function() {
				location.reload();
			}

			$scope.checkNewMail = function() {
				Mail.checkNewMail({}, function(data) {
					$scope.newmails = data.NUM;
				})

				setTimeout($scope.checkNewMail, 10000);
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

			$scope.updateDetails = function(append) {
				if ($scope.mails && $scope.mails.length) {
					var moreInfo =  $scope.mails[$scope.mails.length-1].MOREINFO.split(',');

					/**
					 * moreInfo {
					 *	0 => currentPage,
					 *	1 => totalPage,
					 *	2 => perpage,
					 *	3 => maxpage,
					 *	4 => mailcount,
					 * }
					 * ----------------------------------------------------------------------
					 */

					$scope.currentPage = parseInt(moreInfo[0], 10);
					$scope.totalPage = parseInt(moreInfo[1], 10);
					$scope.perpage = parseInt(moreInfo[2], 10);
					$scope.maxpages = parseInt(moreInfo[3], 10);
					$scope.pages = $scope.getPages();

					if (!append) $scope.mailcount = parseInt(moreInfo[4], 10);
				}
				// page focus
				angular.forEach($scope.pages, function(page) {
					page.actived = page.idx === $scope.currentPage ? 'actived' : '';
				})
			}

			$scope.between = function(val, min, max) {
				if (min && val < min) val = min;
				if (max && val > max) val = max;
				return val;
			}

			$scope.updateMailCount = function(num) {
				$scope.mailcount -= num;
				$scope.mailcount = $scope.between($scope.mailcount, 0);
			}

			$scope.fadeOut = function() {
				$scope.mails = [];
				$scope.pages = [];
			}

			$scope.toPage = function(idx) {

				if ($scope.currentPage === idx) return;

				$scope.fadeOut();

				Mail.toPage({idx: idx}, function(data) {
					$scope.fetchContent(data, true);
				})
			}

			$scope.delete = function(name) {
				var emailToDelete = [],
					newMails = [];

				angular.forEach($scope.mails, function(mail) {
					if (name) {
						if (mail.NAME === name) {
							emailToDelete.push(name);
						} else {
							newMails.push(mail);
						}
					} else {
						if (mail.deleteMark) {
							emailToDelete.push(mail.NAME);
						} else {
							newMails.push(mail);
						}
					}
				})

				Mail.deleteList({lstMail: emailToDelete.join(',')}, function(status) {
					$scope.mails = newMails;

					Mail.concat({concatLen: emailToDelete.length}, function(data) {
						$scope.fetchContent(data, true);
						$scope.checkEmpty();
						// $scope.pages = [];
						$scope.updateMailCount(emailToDelete.length);
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
				if (!$scope.mails.length && $scope.currentPage > 1) {
					Mail.toPage({idx: $scope.currentPage - 1}, function(data) {
						$scope.fetchContent(data, false);
					})
				}
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
