/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/ui/core/CustomData","sap/ui/core/format/NumberFormat","sap/m/ListType","sap/m/StandardListItem",],function(S,C,N,L,a){"use strict";return a.extend("sap.esh.search.ui.controls.SearchFacetItem",{constructor:function(i,o){var t=this;t.options=jQuery.extend({},{type:L.Active,title:"{label}",tooltip:"{label}: {valueLabel}",icon:"{icon}",info:{parts:[{path:"value",},],formatter:function(v){return typeof v==="number"?S.formatInteger(v):"";},},selected:"{selected}",customData:[new C({key:"test-id-facet-dimension-value",value:{parts:["facetTitle","label"],formatter:function(f,l){return f+"-"+l;},},writeToDom:true,}),],},o);a.prototype.constructor.apply(this,[i,t.options]);this.addStyleClass("sapUshellSearchFacetItem");this.addEventDelegate({onAfterRendering:function(){if(t.getBindingContext()&&t.getBindingContext().getObject()){var l=t.getBindingContext().getObject().level;if(jQuery("html").attr("dir")==="rtl"){jQuery(t.getDomRef()).children(".sapMLIBContent").css("padding-right",l+"rem");}else{jQuery(t.getDomRef()).children(".sapMLIBContent").css("padding-left",l+"rem");}}},});},renderer:"sap.m.StandardListItemRenderer",});});
