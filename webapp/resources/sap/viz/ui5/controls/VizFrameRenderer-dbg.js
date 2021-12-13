/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * @class VizFrame renderer.
	 * @static
	 */
	var VizFrameRenderer = {
		apiVersion: 2
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	VizFrameRenderer.render = function(oRm, oControl){
		// write the HTML into the render manager
		oRm.openStart("div", oControl)
			.class("sapVizFrame")
			.style("width", oControl.getWidth())
			.style("height", oControl.getHeight())
			.openEnd()
			.close("div");
	};


	return VizFrameRenderer;

}, /* bExport= */ true);
