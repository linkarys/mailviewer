<cfimport taglib="pagelets" prefix="mail">

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
	<div class="view-container container">
		<div ng-view class="view-frame"></div>
	</div>
</body>
<!--- <body class="wrapper" id="mail-container">
	<cfif not directoryExists(application.maildir)>
		<h2 class="page-header">Wrong!</h2>
		<p>
			Something has gone wrong. I cann't seem to find your undelivered folder at:
			<br />
			#maildir#
		</p>
		<cfabort>
	</cfif>

	<cfif NOT structKeyExists(session, "perpage")>
		<cfset session.perpage = 100>
	</cfif>

	<cfset variables.qryMail = request.udf.getMailList()>

	<div class="page-header">
		<span class="title">Mail Viewer</span>
		<span class="action-bar">
			<img src="/CFIDE/administrator/images/irefresh.gif" onclick="refresh()" alt="refresh" title="refresh" class="btn">
			<img src="/CFIDE/administrator/images/delete_button.gif" onclick="deleteList()" alt="delete" title="delete" class="btn">
			<img src="/CFIDE/administrator/images/ipurge.gif" alt="delete all" onclick="deleteAll()"	title="delete all" class="btn">
			<img src="/CFIDE/administrator/images/irestart.gif" alt="reprocess" title="reprocess" class="btn">
		</span>

		<cfoutput>
			<span class="page-toolkit">
				<a href="" id="prev-page" class="page-action">prev</a>
				<a href="" id="next-page" class="page-action">next</a>
				<span id="page-marker">#request.udf.getPageTookit(variables.qryMail.recordCount)#</span>
				<select name="perpage" id="perpage">
					<option value="50" #request.udf.isSelected(50)#>50</option>
					<option value="100" #request.udf.isSelected(100)#>100</option>
					<option value="200" #request.udf.isSelected(200)#>200</option>
				</select>
			</span>
		</cfoutput>
	</div>
	<!--- <cfset variables.currentMail = ""> --->
	<table class="main-content" id="list-wrapper">
		<mail:list qrymail="#variables.qryMail#">
	</table>
	<div id="eviewer"></div>
	<script src="js/main.js"></script>
</body> --->
</html>