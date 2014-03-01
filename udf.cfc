/**
*
* @file  mails/udf.cfc
* @author  yang
* @description
*
*/

component output="false" displayname=""  {

	this.DEFULT_STARTROW = 1;
	this.DEFULT_PERPAGE = 10;

	public function init(){
		var variables.configFile = XmlParse(ExpandPath('.') & "/settings.xml");
		return this;
	}

	// Parse text to struct
	public struct function getMail(required string filename, required boolean isMailBodyDesired) {

		var email = "";
		var parsedEmail = "";
		var line = "";
		var key = "";
		var content = "";
		var keyLists = "server,from,to,cc,bcc,subject,replyto,failto";

		if (structKeyExists(application.fileCache, arguments.fileName) AND NOT arguments.isMailBodyDesired) {

			return application.fileCache[arguments.fileName];
		}

		keyLists = iif(isMailBodyDesired, de(listAppend(keyLists, "body")), de(keyLists));
		parsedEmail = initEmailStuct(keyLists);
		parsedEmail.filename = arguments.filename;

		try {
			email = fileOpen(application.maildir & "/" & arguments.filename, "read");
			while (NOT FileIsEOF(email)) {
				line = FileReadLine(email);
				key = getKey(line);
				content = getContent(line);

				if (listFindNoCase(keyLists, key)) {
					parsedEmail[key] = parsedEmail[key] & getContent(line);
				}
			}
		} catch (any e) {
			return parsedEmail;
		}


		return parsedEmail;
	}

	public query function getFileList() {
		return directoryList(application.maildir, false, "query", "*.cfmail", "datelastmodified desc");
	}

	public query function getMails(numeric startRow, numeric maxRows) {
		var qryFile = getFileList();
		var qryService = new query(sql='SELECT * FROM qryFile', dbtype="query", qryFile = qryFile, startrow="#startRow#", maxrows="#maxRows#");
		var qryResult = qryService.execute().getResult();
		var aryID = ArrayNew(1);
		var arySubject = ArrayNew(1);
		var aryFrom = ArrayNew(1);
		var aryTo = ArrayNew(1);
		var aryBody = ArrayNew(1);

		for(i = 1; i lte qryResult.recordCount; i=i+1) {
			mail = getMail(qryResult.name[i], true);
			arrayAppend(aryID, i);
			arrayAppend(arySubject, mail.subject);
			arrayAppend(aryFrom, mail.From);
			arrayAppend(aryTo, mail.To);
			arrayAppend(aryBody, mail.Body);
		}

		QueryAddColumn(qryResult, 'id', 'varchar', aryID);
		QueryAddColumn(qryResult, 'subject', 'varchar', arySubject);
		QueryAddColumn(qryResult, 'from', 'varchar', aryFrom);
		QueryAddColumn(qryResult, 'to', 'varchar', aryTo);
		QueryAddColumn(qryResult, 'body', 'varchar', aryBody);

		return qryResult;
	}

	public function isSelected(current) {
		if (current eq session.perPage) {
			return 'selected="selected"';
		}
	}

	public function getPageTookit(required numeric recordCount) {
		var numTotal = ceiling(recordCount / session.perpage);

		if (not structKeyExists(session, "currentPage")) {
			session.currentPage = 1;
		}
		return session.currentPage & ' / ' & numTotal;
	}

	public string function fncFileSize(required numeric size) {

		if (arguments.size GTE 1048576) {
			return arguments.size \ 1048576 & " Mb";
		} else if (arguments.size GTE 1024) {
			return arguments.size \ 1024 & " Kb";
		} else {
			return arguments.size & " b";
		}
	}

	public string function getPerpage() {
		try {
			return variables.configFile.main.perpage.XmlText;
		}
		catch(any e) {
			return this.DEFULT_PERPAGE;
		}
	}
	public string function getStartRow(url) {
		if (len(getArgValue(url, "startRow"))) {
			return url.startRow;
		}

		return this.DEFULT_STARTROW;
	}

	public string function getMaxRows(url) {
		if (len(getArgValue(url, "MaxRows"))) {
			return url.maxRows;
		}
		return getPerpage();
	}

	/**
	* Get value from arguments, if there exists an corresponding value,
	* return the value, otherwise return empty string.
	*/
	public any function getArgValue(args, key) {
		if (structKeyExists(args, key)) {
			if (isSimpleValue(args[key])) {
				return trim(args[key]);
			}
			return args[key];
		}
		return '';
	}

	private string function getKey(required string line) {
		return trim(listFirst(line, ":"));
	}

	private string function getContent(required string line) {
		return trim(replace(line, getKey(line) & ':', ""));
	}

	// Intialize email struct
	private struct function initEmailStuct(required string keyLists) {
		var email = structNew();

		for (key in keyLists) {
			email[key] = '';
		}

		return email;
	}

}