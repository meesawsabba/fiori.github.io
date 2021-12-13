/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/m/Link"],function(S,L){"use strict";return L.extend("sap.esh.search.ui.controls.SearchLink",{metadata:{aggregations:{icon:{type:"sap.ui.core.Icon",multiple:false,},},},renderer:"sap.m.LinkRenderer",onAfterRendering:function(){var d=this.getDomRef();S.boldTagUnescaper(d);var i=this.getAggregation("icon");if(i){var r=sap.ui.getCore().createRenderManager();var a=document.createElement("span");d.prepend(" ");d.prepend(a);r.render(i,a);r.destroy();}},});});
