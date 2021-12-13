/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * RedlineToolGizmoRenderer renderer.
	 * @namespace
	 */
	var RedlineToolGizmoRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm    the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} control     the control to be rendered
	 */
	RedlineToolGizmoRenderer.render = function(rm, control) {
		rm.write("<svg");
		rm.writeControlData(control);
		rm.addClass("sapUiVizkitRedlineTool");
		rm.writeClasses();
		rm.write(">");

		// SVG style to add a "halo" effect
		var colors = [];
		var parsedColors = [];
		var strokeColors = ["rgba(255,0,0,1)"];  // use 255,0,0,1 as default arrow head color
		var endArrowHeadIds = ["255001"];
		var elements = control.getRedlineElements();
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			var haloColor = element.getHaloColor();
			if (!colors.includes(haloColor)) {
				colors.push(haloColor);
				var parsed = element._colorToArray(haloColor);
				parsedColors.push(parsed);
			}
			var strokeColor = element.getStrokeColor();
			var parsedStrokeColor = element._colorToArray(strokeColor).join("");
			if (!endArrowHeadIds.includes(parsedStrokeColor)) {
				endArrowHeadIds.push(parsedStrokeColor);
				strokeColors.push(strokeColor);
			}
		}
		var defaultColor;
		if (control.getParent()._haloColor) {
			defaultColor = control.getParent()._haloColor.replace(/[^\d,.]/g, "").split(",");
		} else {
			defaultColor = [255, 0, 0, 1];
		}
		if (!defaultColor[3]) {
			defaultColor.push(1);
		}
		var defaultColorId = defaultColor.join("");
		rm.write("\<defs>");
		rm.write("\
				<filter id='halo" + defaultColorId + "' filterUnits='userSpaceOnUse' >\
					<feGaussianBlur in='SourceAlpha' stdDeviation='3' result='blur' />\
					<feColorMatrix result ='color' type='matrix' values='0 0 0 0 " + defaultColor[0] / 255 + " 0 0 0 0 " + defaultColor[1] / 255 + " 0 0 0 0 " + defaultColor[2] / 255 + " 0 0 0 " + defaultColor[3] + " 0' />\
					<feMerge>\
						<feMergeNode in='blur' />\
						<feMergeNode in='color' />\
						<feMergeNode in='SourceGraphic' />\
					</feMerge>\
				</filter>\
			");
		for (var j = 0; j < parsedColors.length; j++) {
			var rgba = parsedColors[j];
			var id = rgba.join("");
			rm.write("\
				<filter id='halo" + id + "' filterUnits='userSpaceOnUse' >\
					<feGaussianBlur in='SourceAlpha' stdDeviation='3' result='blur' />\
					<feColorMatrix result ='color' type='matrix' values='0 0 0 0 " + rgba[0] / 255 + " 0 0 0 0 " + rgba[1] / 255 + " 0 0 0 0 " + rgba[2] / 255 + " 0 0 0 " + rgba[3] + " 0' />\
					<feMerge>\
						<feMergeNode in='blur' />\
						<feMergeNode in='color' />\
						<feMergeNode in='SourceGraphic' />\
					</feMerge>\
				</filter>\
			");
		}
		for (var k = 0; k < endArrowHeadIds.length; k++) {
			rm.write("\
			<marker id='endArrowHead" + endArrowHeadIds[k] + "' markerWidth='10' markerHeight='7' \
				refX='0' refY='3.5' orient='auto'> \
				<polygon points='0 0, 10 3.5, 0 7' fill='" + strokeColors[k] + "'/> \
			</marker>\
			");
		}
		rm.write("</defs>");

		elements.forEach(function(element) {
			if (!element.getSuppress()) {
				element.render(rm);
			}
		});

		if (control._activeElement) {
			control._activeElement.render(rm);
		}

		rm.write("</svg>");
	};

	return RedlineToolGizmoRenderer;

}, /* bExport= */ true);
