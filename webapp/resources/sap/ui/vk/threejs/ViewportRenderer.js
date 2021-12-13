/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var V={};V.render=function(r,c){r.write("<div");r.writeControlData(c);r.addClass("sapVizKitViewport");r.writeClasses();r.writeAttribute("tabindex",0);r.writeAttribute("aria-label","Image");r.writeAttribute("role","figure");r.addStyle("width",c.getWidth());r.addStyle("height",c.getHeight());r.writeStyles();r.write(">");if(c.getSafeArea()){r.renderControl(c.getSafeArea());}c.renderTools(r);c.renderContent(r);var a=c.getAnnotations();if(a&&a.length>0){r.write("<div");r.addClass("sapUiVizKitAnnotationContainer");r.writeClasses();r.write(">");a.forEach(function(A){r.renderControl(A);});r.write("</div>");}r.write("</div>");};return V;},true);
