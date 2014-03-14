<cfscript>
	udf = request.udf;
	action = udf.getArgValue(url, 'action');

	switch (action) {
		case 'concat':
			if (udf.getCurrentPage() eq udf.getTotalPage) {
				writeOutput('');
			} else {
				maxrows = udf.getMaxRows();
				concatLen = udf.getConcatLen(url);
				startRow = udf.getCurrentPage() * maxrows - concatLen + 1;
				qryMail = udf.getMails(startRow, concatLen);
				writeOutput( serializeJSON(qryMail) );
			}
		break;

		case 'show':
			savecontent variable="mail" {
				include "pagelets/mail.cfm";
			}

			writeOutput( serializeJSON( {mail: mail} ) );
		break;

		case 'deleteList':
			try {
				for(item in udf.getArgValue(url, 'lstMail')) {
					fileDelete(application.maildir & '/'  & URLDecode(item));
				}
			}
			catch(any e) {
				writeOutput(0);
			}
		break;

		case 'deleteAll':
			qryFile = udf.getFileList();
			try {
				for(item in qryFile) {
					fileDelete(application.maildir & '/'  & URLDecode(item.Name));
				}
				udf.setCurrentPage(1);
			}
			catch(any e) {
				writeOutput(0);
			}
		break;

		case 'updateSettings':
			stcSettings = structNew();
			stcSettings.perpage = udf.getArgValue(url, 'perpage');
			stcSettings.maxpages = udf.getArgValue(url, 'maxpages');

			if (udf.updateSettings(stcSettings)) {
				writeOutput(1);
			} else {
				writeOutput(0);
			}
		break;

		case 'buildJson':
			if (udf.buildJson()) {
				writeOutput(1);
			} else {
				writeOutput(0);
			}
		break;

		case 'checkNewMail':
			qryMail = udf.checkNewMail();
			writeOutput( serializeJSON({num: qryMail}) );
		break;

		case 'list':
		case 'toPage':

			switch(action){
				case 'list': {
					udf.setCurrentPage(1);
					udf.setMode(udf.DB_MODE);
					url.idx = udf.getCurrentPage();
				} break;

				default: break;
			}

			maxrows = udf.getMaxRows(url);
			// no validate the idx here, this will be done at setCurrentPage
			udf.setCurrentPage(udf.getArgValue(url, 'idx'));
			startRow = (udf.getCurrentPage() - 1) * maxrows + 1;
			qryMail = udf.getMails(startRow, maxrows);
			writeOutput(serializeJSON(qryMail));
		break;

		default:
			writeOutput(0);
		break;
	}
</cfscript>
