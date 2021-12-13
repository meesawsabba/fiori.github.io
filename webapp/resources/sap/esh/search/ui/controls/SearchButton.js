/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n","sap/esh/search/ui/SearchHelper","sap/m/Button","sap/ui/core/IconPool"],function(i,S,B,I){"use strict";B.extend("sap.esh.search.ui.controls.SearchButton",{constructor:function(s,o){o=jQuery.extend({},{icon:I.getIconURI("search"),tooltip:i.getText("search"),enabled:{parts:[{path:"/initializingObjSearch",},],formatter:function(a){return!S.isSearchAppActive()||!a;},},},o);B.prototype.constructor.apply(this,[s,o]);this.addStyleClass("searchBtn");},renderer:"sap.m.ButtonRenderer",});});
