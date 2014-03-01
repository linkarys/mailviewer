/**
*
* @file  mails/Application.cfc
* @author  yang
* @description
* History		: Written by Phillip Duba,Raymond Camden. I modified it a bit.
*				: Added requesttimeout and include for security (both finds by my users, thanks!)
*				: Perpage (rkc 12/7/6)
*				: allowdownload (rkc 7/20/7)
*				: moved the cfsetting to after CFADMIN's core cfsetting (rkc 7/29/07)
*
*/

component output="false" displayname="Applications"  {

	this.name = "MailViewer";
	this.loginStorage = "session";
	this.sessionManagement = true;
	this.setClientCookies = true;
	this.setDomainCookies = false;
	this.sessionTimeOut = CreateTimeSpan(0,1,0,0);
	this.applicationTimeOut = CreateTimeSpan(0,1,0,0);

	public boolean function onRequestStart(thePage) {

		if (structKeyExists(url,'appInit')) {
			onApplicationStart();
		}

		request.udf = createObject('udf').init();

		return true;
	}


	public boolean function onApplicationStart() {
		application.maildir = server.coldfusion.rootdir & "/Mail/Undelivr/";
		application.spooldir = server.coldfusion.rootdir & "/Mail/Spool/";
		application.fileCache = structNew();
		application.allowdownload = false;
		application.init = now();
		return true;
	}
}