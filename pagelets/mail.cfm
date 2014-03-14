<cfif not structKeyExists(url, "mail")>
	<h2 class="page-header">Invalid!</h2>
	<cfabort>
</cfif>

<cfset variables.mail = request.udf.getMail(url.mail, true)>

<cfoutput>
	<!--- Basic Information --->
	<div class="panel">
		<!--- <div class="panel-heading">Basic Information</div> --->

		<cfset variables.keyLists = "Filename,Server,From,To,Cc,Bcc,Replyto,Failto">
		<div class="panel-body basic-info">
			<table class="table">
				<cfloop index="key" list="#variables.keyLists#">
					<cfif len(request.udf.getArgValue(variables.mail, key))>
						<tr>
							<th>#key#:</th>
							<td>#variables.mail[key]#</td>
						</tr>
					</cfif>
				</cfloop>
			</table>
		</div>
	</div>

	<!--- Mail Detail --->
	<div class="panel">
		<!--- <div class="panel-heading">Mail Details</div> --->
		<div class="panel-body main-content">
			#replace(variables.mail.body, "<table>", "<table class='table'>")#
		</div>
	</div>

</cfoutput>
