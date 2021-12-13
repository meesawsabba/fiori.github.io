/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/appsearch/JsSearch"],function(J){"use strict";return{createJsSearch:function(o){o.algorithm=o.algorithm||{id:"contains-ranked",options:[50,49,40,39,5,4,51],};return new J(o);},};});
