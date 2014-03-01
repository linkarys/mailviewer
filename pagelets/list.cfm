<cfparam name="qrymail" type="any" default="">

<cfif not structKeyExists(attributes, "qrymail")>
	<h2 class="page-header">Invalid!</h2>
	<cfabort>
</cfif>

<cfset variables.qryMail = attributes.qryMail>

<cfif structKeyExists(variables, "qryMail") AND variables.qryMail.recordCount>
	<cfset variables.startRow = (session.currentPage - 1) * session.perPage + 1>
	<thead>
		<tr class="table-header">
			<th nowrap><input type="checkbox" id='check-all'>Action</th>
			<th class="subject">Subject</th>
			<th class="sender">Sender</th>
			<th class="to">To</th>
			<th class="size">Size</th>
			<th class="date">Date</th>
		</tr>
	</thead>
	<tbody>
		<cfoutput query="variables.qryMail" startrow="#variables.startRow#" maxrows="#session.perPage#">
			<cfset variables.currentMail = request.udf.getMail(name, false)>
			<cfset highlight = iif(variables.qryMail.currentRow mod 2 eq 0, de(" table-highlight"), de(""))>
			<tr class="clickable#highlight#" id="#listFirst(name, '.')#">
				<td nowrap>
					<input type="checkbox" class="single-box" name="#name#">
					<img src="/CFIDE/administrator/images/delete_button.gif" onclick="deleteEmail('#urlEncodedFormat(name)#', this)" alt="delete" title="delete" class="btn">
				</td>
				<td class="subject" onclick="getEmail('#urlEncodedFormat(name)#')">#variables.currentMail.subject#</td>
				<td class="sender">#variables.currentMail.from#</td>
				<td class="to">#variables.currentMail.to#</td>
				<td class="size">#request.udf.fncFileSize(size)#</td>
				<td class="date">#dateFormat(datelastmodified)# #timeFormat(datelastmodified)#</td>
			</tr>
		</cfoutput>
	</tbody>
	<cfoutput>
		<tr><td id="toolkit-info">#request.udf.getPageTookit(variables.qryMail.recordCount)#</td></tr>
	</cfoutput>
<cfelse>
	<tr><td>no data!</td></tr>
</cfif>