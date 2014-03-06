<cfimport taglib="pagelets" prefix="mail">
<cfset udf = request.udf>

<!--- Create an array. --->

<!--- Use the array to add a column to the query. --->
<cfif structkeyexists(url, 'action')>
	<cfswitch expression="#url.action#">
		<cfcase value="concat">
			<cfscript>
				if (udf.getCurrentPage() eq udf.getTotalPage) {
					writeOutput('');
				} else {
					maxrows = udf.getMaxRows();
					concatLen = udf.getConcatLen(url);
					startRow = udf.getCurrentPage() * maxrows - concatLen + 1;
					qryMail = udf.getMails(startRow, concatLen);
					writeOutput(serializeJSON(qryMail));
				}
			</cfscript>
		</cfcase>
		<cfcase value="show">
			<cfoutput>
				<mail:body mail="#urlDecode(url.mail)#">
			</cfoutput>
		</cfcase>
		<cfcase value="delete">
			<cftry>
				<cffile action="delete" file="#application.maildir#/#URLDecode(url.mail)#"> ok
			<cfcatch type = "any">fail</cfcatch>
			</cftry>
		</cfcase>
		<cfcase value="deleteList">
			<cftry>
				<cfloop list="#lstMail#" index="name">
					<cffile action="delete" file="#application.maildir#/#URLDecode(name)#">
				</cfloop>ok
			<cfcatch type = "any">fail</cfcatch>
			</cftry>
		</cfcase>
		<cfcase value="deleteAll">
			<cftry>
				<cfdirectory action="list" directory="#application.maildir#" recurse="true" listinfo="name" name="qFile" />
				<cfloop query="qFile">
					<cffile action="delete" file="#application.maildir#/#name#">
				</cfloop>ok
			<cfcatch type = "any">fail</cfcatch>
			</cftry>
		</cfcase>
		<cfcase value="list,prePage,nextPage,toPage">
			<cfscript>
				// get the pagination to go
				switch(url.action){
					case 'list':
						url.idx = udf.getCurrentPage();
					break;
					case 'prePage': {
						if (udf.getCurrentPage() gt 1) {
							url.idx = udf.getCurrentPage() - 1;
						}
					}
					break;
					case 'nextPage': {
						if (udf.getCurrentPage() lt udf.getTotalPage()) {
							url.idx = udf.getCurrentPage() + 1;
						}
					}
					break;
					default: break;
				}

				maxrows = udf.getMaxRows(url);
				udf.setCurrentPage(udf.getArgValue(url, 'idx'));
				startRow = (udf.getCurrentPage() - 1) * maxrows + 1;
				qryMail = udf.getMails(startRow, maxrows);
				writeOutput(serializeJSON(qryMail));
			</cfscript>
		</cfcase>
		<cfdefaultcase>
			<cfscript>
				writeOutput(0);
			</cfscript>
		</cfdefaultcase>
	</cfswitch>
</cfif>