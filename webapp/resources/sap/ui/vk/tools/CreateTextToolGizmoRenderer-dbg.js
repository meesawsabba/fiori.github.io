/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

sap.ui.define([
], function() {
	"use strict";

	/**
	 * TransformSvgElementToolGizmo renderer.
	 * @namespace
	 */
	var TransformSvgElementToolGizmoRenderer = {};

	/**
	 * Renders the HTML for the given control, using the provided
	 * {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} rm
	 *            the RenderManager that can be used for writing to
	 *            the Render-Output-Buffer
	 * @param {sap.ui.core.Control} control
	 *            the control to be rendered
	 */
	TransformSvgElementToolGizmoRenderer.render = function(rm, control) {
		// an empty div to which the edit dialog will be attached
		rm.write("<div");
		rm.writeControlData(control);
		rm.writeClasses();
		rm.addStyle("position", "absolute");
		rm.addStyle("pointer-events", "none");
		rm.writeStyles();
		rm.write("/>");
	};

	return TransformSvgElementToolGizmoRenderer;

}, /* bExport= */ true);
