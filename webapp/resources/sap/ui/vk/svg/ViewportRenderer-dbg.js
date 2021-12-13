/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
	"../abgrToColor"
], function(
	abgrToColor
) {
	"use strict";

	/**
	 * Viewport renderer.
	 * @namespace
	 */
	var ViewportRenderer = {};

	ViewportRenderer.render = function(rm, viewport) {
		rm.write("<div");
		rm.writeControlData(viewport);
		rm.addClass("sapVizKitViewport");
		rm.writeClasses();
		rm.writeAttribute("tabindex", 0);
		rm.writeAttribute("aria-label", "Image");
		rm.writeAttribute("role", "figure");
		rm.addStyle("width", viewport.getWidth());
		rm.addStyle("height", viewport.getHeight());
		rm.addStyle("background-image", "linear-gradient(" + viewport.getBackgroundColorTop() + "," + viewport.getBackgroundColorBottom() + ")");
		rm.writeStyles();
		rm.write(">");

		rm.write("<canvas");
		rm.addStyle("display", "none");
		rm.writeStyles();
		rm.write("></canvas>");

		rm.write("<svg xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\"");
		rm.writeAttribute("width", "100%");
		rm.writeAttribute("height", "100%");
		rm.writeAttribute("viewBox", viewport._getViewBox().join(" "));
		rm.addStyle("position", "absolute");
		// rm.addStyle("transform", "translateZ(0px)");
		// rm.addStyle("shape-rendering", "optimizeSpeed");
		// rm.addStyle("text-rendering", "optimizeSpeed");
		rm.writeStyles();
		rm.write(">");

		var hotspotColor = abgrToColor(viewport.getHotspotColorABGR());
		var customHotspotEffects = new Map();
		var scene = viewport.getScene();
		if (scene) {
			// Collect hotspot colors
			var nh = scene.getDefaultNodeHierarchy();
			var hotspots = nh.getHotspotNodeIds();
			hotspots.forEach(function(hotspot) {
				var def = hotspot.getHotspotEffectDef();
				customHotspotEffects.set(def.name, def);
			});
		}

		// <filter id='hotspot-effect'>\
		// 	<feGaussianBlur in='SourceAlpha' result='Outline' stdDeviation='4' />\
		// 	<feColorMatrix in='Outline' result='ColorOutline' type='matrix' values='0 0 0 0 0, 0 0 0 0 0.75, 0 0 0 0 1, 0 0 0 3 0' />\
		// 	<feMerge>\
		// 		<feMergeNode in='ColorOutline' />\
		// 		<feMergeNode in='SourceGraphic' />\
		// 	</feMerge>\
		// </filter>\

		// <filter id='selection-effect'>\
		// 	<feDropShadow dx='0' dy='0' stdDeviation='4' flood-color='#f00'/>\
		// </filter>\

		// hotspots highlighting effect
		// var scale = viewport._getHotspotEffectScale();
		// var ext = scale * 8;
		// 		<filter id='hotspot-effect' x='-" + ext + "%' y='-" + ext + "%' width='" + (100 + ext * 2) + "%' height='" + (100 + ext * 2) + "%'>\
		// 			<feGaussianBlur in='SourceGraphic' stdDeviation='" + viewport._getHotspotEffectScale() + "' result='blur'/>\
		// 			<feColorMatrix in='blur' type='matrix' values='0 0 0 0 " + (hotspotColor.red / 255) + ", 0 0 0 0 " + (hotspotColor.green / 255) + ", 0 0 0 0 " + (hotspotColor.blue / 255) + ", 0 0 0 " + (hotspotColor.alpha * 2) + " 0' result='color-blur'/>\
		// 			<feComposite operator='out' in='color-blur' in2='SourceGraphic'/>\
		// 		</filter>\

		customHotspotEffects.forEach(function(eff) {
			var color = eff.color || hotspotColor;
			rm.write("<filter id='" + eff.name + "'>\
							<feColorMatrix in='SourceGraphic' type='matrix' values='0 0 0 0 " + (color.red / 255) + ", 0 0 0 0 " + (color.green / 255) + ", 0 0 0 0 " + (color.blue / 255) + ", 0 0 0 " + color.alpha + " 0'/>\
						</filter>");
		});

		if (scene) {
			var vsm = viewport._getViewStateManagerSVG();
			scene.getRootElement().render(rm, vsm ? vsm._mask : (-1 | 0), viewport);
		}

		viewport._selectionRect.render(rm, 0 | 0); // hidden rectangle for rectangular selection

		if (viewport._styles.size > 0) {
			rm.write("<defs><style>");
			viewport._styles.forEach(function(attributes, id) {
				rm.write("." + id + "{\n");
				for (var i = 0; i < attributes.length; i += 2) {
					rm.write(attributes[i] + ":" + attributes[i + 1] + ";\n");
				}
				rm.write("}\n");
			});
			rm.write("</style></defs>");
		}

		rm.write("</svg>");

		viewport.renderTools(rm);
		viewport.renderContent(rm);

		rm.write("</div>");
	};

	return ViewportRenderer;

}, /* bExport = */ true);
