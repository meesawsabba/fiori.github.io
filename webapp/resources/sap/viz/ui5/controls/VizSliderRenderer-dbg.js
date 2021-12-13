/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */

sap.ui.define(function() {
	"use strict";

	/**
	 * @class RangeSliderVizFrame renderer.
	 * @static
	 */
	var RangeSliderRenderer = {
		apiVersion: 2
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	RangeSliderRenderer.render = function(oRm, oControl){
		// write the HTML into the render manager
		oRm.openStart("div", oControl)
			.class("sapRangeSliderVizFrame")
			.style("width", oControl.getWidth())
			.style("height", oControl.getHeight())
			.style("position", "relative")
			.openEnd();

		oRm.renderControl(oControl.getAggregation("_vizFrame"));
		oRm.renderControl(oControl.getAggregation("_rangeSlider"));
		oRm.close("div");
	};


	return RangeSliderRenderer;

}, /* bExport= */ true);
