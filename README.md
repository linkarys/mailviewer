Mail Viewer
==========

Coldfusion plugin, use to view system emails.

This plugin get idea from spoolmail, thanks to Phillip Duba and Raymond Camden.

I should special thanks to [Xinju](https://github.com/xinju), thanks for all the suggestion. Some of them are really great, and also thanks for your QA.

Require
=======
- Chrome or Firefox browser (Not works well with IE)
- Coldfusion 10.0 or above (Not works with Coldfusion 8, not sure whether it works with Coldfusin 9)

Installation
==========
* Go to your coldfusion administrator folder (/opt/coldfusion10/cfusion\wwwroot/CFIDE/administrator for me)
* Edit custommenu.xml, and add the new menuitem to Custom Node
```xml
<submenu label="Custom">
	<menuitem href="mailviewer/index.cfm" target="content">Mail Viewer</menuitem>
</submenu>
```
* Clone
```git
git clone https://github.com/linkarys/mailviewer.git
```

Screenshot
========
[![Screenshot](http://thumbsnap.com/s/rSvQFIUR.png)](http://thumbsnap.com/s/rSvQFIUR.png)
