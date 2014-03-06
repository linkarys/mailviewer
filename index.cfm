<html lang="en" ng-app="mailApp">
<head>
	<meta charset="UTF-8">
	<title>Mail Viewer</title>
	<!-- <link rel="stylesheet" href="./css/style.css"> -->
	<link rel="stylesheet" href="./css/bootstrap.css">
	<link rel="stylesheet/less" href="./css/main.less">
	<link rel="stylesheet" href="./css/animate.css">
	<script src="js/angular.min.js"></script>
	<script src="js/angular-sanitize.min.js"></script>
	<script src="js/angular-resource.js"></script>
	<script src="js/angular-route.js"></script>
	<script src="js/app.js"></script>
	<script src="js/controllers.js"></script>
	<script src="js/filter.js"></script>
	<script src="js/angular-animate.js"></script>
	<script src="js/animate.js"></script>
	<script src="js/services.js"></script>
	<script src="js/dump.min.js"></script>
	<script src="js/less.min.js"></script>
</head>
<body >
	<div class="view-container" id="wrapper">
		<div ng-view class="view-frame"></div>
	</div>
</body>
</html>