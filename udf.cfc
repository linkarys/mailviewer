/**
*
* @file  mails/udf.cfc
* @author  yang
* @description
*
*/

component output="false" displayname=""  {

	this.DEFULT_PERPAGE = 10;
	this.MIN_PERPAGE = 1;
	this.MAX_PERPAGE = 200;

	this.DEFULT_MAXPAGES = 7;
	this.MIN_MAXPAGES = 1;
	this.MAX_MAXPAGES = 15;

	this.DEFULT_STARTROW = 1;
	this.DEFAULT_CONCATLEN = 1;

	this.DB_MODE = 0;
	this.JSON_MODE = 1;

	public function init(){
		variables.settingPath = ExpandPath('.') & "/settings.xml";
		variables.dataPath = ExpandPath('.') & "/data/data.js";
		variables.mode = this.DB_MODE;
		variables.configFile = XmlParse(settingPath);
		return this;
	}

	// Parse text to struct
	// No yet deal with attachment!
	public struct function getMail(required string filename, required boolean isMailBodyDesired) {

		var lineReader = "";
		var parsedEmail = "";
		var line = "";
		var key = "";
		var keyLists = "server,from,to,cc,bcc,subject,replyto,failto";

		if (structKeyExists(application.fileCache, arguments.fileName) AND NOT arguments.isMailBodyDesired) {

			return application.fileCache[arguments.fileName];
		}

		keyLists = iif(isMailBodyDesired, de(listAppend(keyLists, "body")), de(keyLists));
		parsedEmail = initEmailStuct(keyLists);
		parsedEmail.filename = arguments.filename;

		try {
			lineReader = createObject( "java", "java.io.LineNumberReader" ).init(
				createObject( "java", "java.io.BufferedReader" ).init(
					createObject( "java", "java.io.FileReader" ).init(
						javaCast( "string", application.maildir & "/" & arguments.filename )
						)
					)
				);

			lineReader.mark(javaCast( "int", 999999 ));

			parsedEmail.type = getMailType(lineReader);

			// No yet deal with the scenario that type = multipart
			if (parsedEmail.type eq 'text') {
				parsedEmail.body = "<pre class='mail-text'>";
			}

			lineReader.reset();
			while (true) {
				line = lineReader.readLine();

				if (isNULL(line)) break;
				key = getKey(line);

				if (listFindNoCase(keyLists, key)) {
					parsedEmail[key] = parsedEmail[key] & getValue(line);
				}
			}

			if (parsedEmail.type eq 'text') {
				parsedEmail.body &= "</pre>";
			}

		} catch (any e) {
			return parsedEmail;
		}


		return parsedEmail;
	}

	public function getMailType(required lineReader) {
		var line = "";

		lineReader.reset();
		line = lineReader.readLine();
		// not sure whether is correct!!
		if (findNoCase("bodypart-start:  text/plain;", line) and findNoCase("bodypart-start:  text/html;", line)) {
			return "multipart";
		} else if (findNoCase("text/html", line)) {
			return "html";
		} else {
			return "text";
		}
	}

	public query function getFileList() {
		return directoryList(application.maildir, false, "query", "*.cfmail", "datelastmodified desc");
	}

	public query function getMails(numeric startRow=1, numeric maxRows=this.MAX_PERPAGE) {
		var qryFile = getFileList();
		var qryResult = queryNew("name,subject,from,to,body,dateLastModified,currentPage,totalPage,maxpage,perpage", 'varchar,varchar,varchar,varchar,varchar,date,varchar,varchar,varchar,varchar');

		if (variables.mode eq this.JSON_MODE) {
			startRow = 1;
			maxRows = qryfile.recordCount;
		}

		for(i = startRow; (i lte qryFile.recordCount) and (i lt (startRow + maxRows)); i=i+1) {
			mail = getMail(qryFile.name[i], false);
			queryAddRow(qryResult);
			querySetCell(qryResult, "name", qryFile.name[i]);
			querySetCell(qryResult, "subject", mail.subject);
			querySetCell(qryResult, "from", mail.from);
			querySetCell(qryResult, "to", mail.to);
			querySetCell(qryResult, "body", '');
			querySetCell(qryResult, "dateLastModified", qryFile.dateLastModified[i]);
			querySetCell(qryResult, "currentPage", getCurrentPage());
			querySetCell(qryResult, "totalPage", getTotalPage());
			querySetCell(qryResult, "perpage", getPerpage());
			querySetCell(qryResult, "maxpage", getMaxpage());
		}

		return qryResult;
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

	public boolean function updateSettings(stcSettings=structNew()) {
		var perpage = getArgValue(arguments.stcSettings, 'perpage');
		var maxpages = getArgValue(arguments.stcSettings, 'maxpages');

		try {
			if (perpage gte this.MIN_PERPAGE and perpage lte this.MAX_PERPAGE) {
				variables.configFile.main.perpage.XmlText = perpage;
			}

			if (maxpages gte this.MIN_MAXPAGES and maxpages lte this.MAX_MAXPAGES) {
				variables.configFile.main.maxpage.XmlText = maxpages;
			}

			fileWrite(variables.settingPath, toString(variables.configFile));

			return true;
		} catch(any e) {
			return false;
		}
	}

	public boolean function buildJson() {

		try {
			variables.mode = this.JSON_MODE;
			fileWrite(variables.dataPath,  toString( serializeJSON( getMails() ) ) );
			return true;
		}
		catch(any e) {
			return false;
		}
	}

	public void function setMode(mode) {
		if (arguments.mode eq this.JSON_MODE OR arguments.mode eq this.DB_MODE) {
			variables.mode = arguments.mode;
		}
	}


	public string function getMaxpage() {
		try {
			return variables.configFile.main.maxpage.XmlText;
		}
		catch(any e) {
			return this.DEFULT_MAXPAGES;
		}
	}

	public string function getTotalPage() {
		return ceiling(getFileList().recordCount / getPerPage());
	}

	public string function getStartRow(url) {
		if (len(getArgValue(url, "startRow")) AND isNumeric(url.startRow)) {
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

	public string function getCurrentPage() {
		if (not len(getArgValue(SESSION, 'currentPage'))) {
			SESSION.currentPage = 1;
		}
		return SESSION.currentPage;
	}

	public string function getConcatLen(url) {
		var concatLen = getArgValue(url, 'concatLen');
		if (isNumeric(concatLen)) {
			return concatLen;
		}
		return this.DEFAULT_CONCATLEN;
	}

	public string function setCurrentPage(page) {
		var strPage = getArgValue(arguments, 'page');
		if (isNumeric(strPage) and strPage lte getTotalPage()) {
			SESSION.currentPage = strPage;
		}
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

	private string function getValue(required string line) {
		return trim(replace(line, getKey(line) & ':', "")) & chr(10);
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