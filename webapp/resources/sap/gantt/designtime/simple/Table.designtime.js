/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(function(){"use strict";return{domRef:function(t){if(t._getRowMode().isA("sap.ui.table.rowmodes.AutoRowMode")){return t.$("sapUiTableCnt").get(0);}return t.getDomRef();},aggregations:{columns:{domRef:".sapUiTableCHA"},hScroll:{ignore:false},rows:{ignore:false},scrollContainers:[{domRef:function(t){return t.$("sapUiTableCnt").get(0);},aggregations:["rows"]}]}};});
