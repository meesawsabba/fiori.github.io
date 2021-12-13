/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var N={};N.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapVizKitNativeViewport");r.writeClasses();r.writeAttribute("tabindex",0);r.addStyle("background-image","linear-gradient("+c.getBackgroundColorTop()+","+c.getBackgroundColorBottom()+")");r.writeStyles();r.write(">");c.renderTools(r);c.renderContent(r);r.write("</div>");};return N;},true);
