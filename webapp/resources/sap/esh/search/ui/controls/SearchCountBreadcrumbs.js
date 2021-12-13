/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Control","sap/esh/search/ui/SearchHelper","sap/m/LabelDesign","sap/ui/core/Icon","sap/m/Label",],function(C,S,L,I,a){"use strict";return C.extend("sap.esh.search.ui.controls.SearchCountBreadcrumbs",{metadata:{aggregations:{icon:{type:"sap.ui.core.Icon",multiple:false,},label:{type:"sap.m.Label",multiple:false,},},},constructor:function(){C.prototype.constructor.apply(this,arguments);var t=this;t.initIcon();t.initLabel();},initIcon:function(){var t=this;var i=new I({visible:{parts:[{path:"/count",},],formatter:function(c){return c!==0;},},src:"{/searchInIcon}",});i.addStyleClass("sapUshellSearchTotalCountBreadcrumbsIcon");t.setIcon(i);},initLabel:function(){var t=this;var l=new a({visible:{parts:[{path:"/count",},],formatter:function(c){return c!==0;},},design:L.Bold,text:"{/countText}",});l.addStyleClass("sapUshellSearchTotalCountSelenium");t.setLabel(l);},setModel:function(m){this.getIcon().setModel(m);this.getLabel().setModel(m);},renderer:function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapUshellSearchTotalCountBreadcrumbs");r.writeClasses();r.write(">");r.renderControl(c.getAggregation("icon"));r.renderControl(c.getAggregation("label"));r.write("</div>");},});});
