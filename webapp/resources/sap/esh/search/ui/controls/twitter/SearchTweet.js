/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/controls/twitter/TwitterRenderer"],function(t){"use strict";return sap.ui.core.Control.extend("sap.esh.search.ui.controls.twitter.SearchTweet",{metadata:{properties:{text:"string",},},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.write(">");t.renderTweet(r,c.getText());r.write("</div>");},});});
