/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * Viewport renderer.
	 * @namespace
	 */
	var ViewportRenderer = {};

	ViewportRenderer.render = function(rm, control) {
		rm.write("<div");
		rm.writeControlData(control);
		rm.addClass("sapVizKitViewport");
		rm.writeClasses();
		rm.writeAttribute("tabindex", 0);
		rm.writeAttribute("aria-label", "Image");
		rm.writeAttribute("role", "figure");
		rm.addStyle("width", control.getWidth());
		rm.addStyle("height", control.getHeight());
		rm.writeStyles();
		rm.write(">");

		// Render Safe Area
		if (control.getSafeArea()) {
			rm.renderControl(control.getSafeArea());
		}

		control.renderTools(rm);
		control.renderContent(rm);

		// Render annotations
		var oAnnotations = control.getAnnotations();
		if (oAnnotations && oAnnotations.length > 0) {
			rm.write("<div");
			rm.addClass("sapUiVizKitAnnotationContainer");
			rm.writeClasses();
			rm.write(">");
			oAnnotations.forEach(function(oAnnotation) {
				rm.renderControl(oAnnotation);
			});
			rm.write("</div>");
		}

		rm.write("</div>");
	};

	return ViewportRenderer;

}, /* bExport = */ true);
