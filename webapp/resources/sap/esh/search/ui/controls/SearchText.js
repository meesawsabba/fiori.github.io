/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/m/Text"],function(S,T){"use strict";return T.extend("sap.esh.search.ui.controls.SearchText",{metadata:{properties:{isForwardEllipsis4Whyfound:{type:"boolean",defaultValue:false,},},aggregations:{icon:{type:"sap.ui.core.Icon",multiple:false,},},},renderer:"sap.m.TextRenderer",onAfterRendering:function(){var d=this.getDomRef();S.boldTagUnescaper(d);var i=this.getAggregation("icon");if(i){var r=sap.ui.getCore().createRenderManager();var a=document.createElement("span");d.prepend(" ");d.prepend(a);r.render(i,a);r.destroy();}},});});
