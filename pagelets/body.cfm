<cfparam name="mail" type="string" default="">

<cfif not structKeyExists(attributes, "mail")>
	<h2 class="page-header">Invalid!</h2>
	<cfabort>
</cfif>

<cfset variables.mail = request.udf.getMail(attributes.mail, true)>

<cfoutput>
	<table class="main-content viewbox">
		<tr>
			<th>Filename:</th>
			<td>#attributes.mail#</td>
		</tr>
		<tr>
			<th>Server:</th>
			<td>#variables.mail.server#</td>
		</tr>
		<tr>
			<th>From:</th>
			<td>#variables.mail.from#</td>
		</tr>
		<tr class="splitline">
			<th>To:</th>
			<td>#variables.mail.to#</td>
		</tr>
	</table>
	#variables.mail.body#
</cfoutput>
