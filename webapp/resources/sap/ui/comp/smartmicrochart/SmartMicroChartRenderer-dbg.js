/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define([], function() {
	"use strict";
	/**
	 * @class SmartMicroChart renderer.
	 * @static
	 * @version 1.96.0
	 * @since 1.38.0
	 */
	var SmartMicroChartRenderer = {
		apiVersion: 2
	};

	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	SmartMicroChartRenderer.render = function(oRm, oControl) {
		if (oControl._bIsInitialized) {
			oRm.openStart("div", oControl);

			if (oControl.getIsResponsive()) {
				oRm.class("sapSuiteUiSmartMicroChartResponsive");
			}

			oRm.openEnd();
			oRm.renderControl(oControl.getAggregation("_chart"));
			oRm.close("div");
		}
	};

	return SmartMicroChartRenderer;

}, /* bExport= */true);
