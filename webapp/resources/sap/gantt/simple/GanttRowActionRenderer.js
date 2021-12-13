/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(['sap/ui/table/Row'],function(R){"use strict";var G={};G.render=function(r,a){r.openStart("div",a);r.class("sapUiGanttTableAction");r.style("height","100%");r.style("width","100%");if(!(a.getParent()instanceof R)){r.style("display","none");}if(!a.getVisible()){r.class("sapUiTableActionHidden");}r.openEnd();var c=a.getAggregation("controlTemplate");r.renderControl(c);r.close("div");};return G;},true);
