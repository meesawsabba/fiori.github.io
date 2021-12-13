/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/m/Label"],function(S,L){"use strict";return L.extend("sap.esh.search.ui.controls.SearchLabel",{renderer:"sap.m.LabelRenderer",onAfterRendering:function(){var d=this.getDomRef();S.boldTagUnescaper(d);S.forwardEllipsis4Whyfound(d);},});});
