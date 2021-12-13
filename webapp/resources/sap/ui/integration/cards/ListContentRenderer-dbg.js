/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

sap.ui.define(["./BaseContentRenderer"], function (BaseContentRenderer) {
	"use strict";

	/**
	 * ListContentRenderer renderer.
	 * @author SAP SE
	 * @namespace
	 */
	var ListContentRenderer = BaseContentRenderer.extend("sap.ui.integration.cards.ListContentRenderer", {
		apiVersion: 2
	});

	/**
	 * @override
	 */
	ListContentRenderer.renderContent = function (oRm, oListContent) {
		oRm.renderControl(oListContent.getAggregation("_content"));

		if (oListContent.getAggregation("_legend")) {
			oRm.renderControl(oListContent.getAggregation("_legend"));
		}
	};

	/**
	 * @override
	 */
	ListContentRenderer.getMinHeight = function (oConfiguration, oContent) {
		if (!oConfiguration || !oConfiguration.maxItems || !oConfiguration.item) {
			return this.DEFAULT_MIN_HEIGHT;
		}

		var fItemHeight = this.getItemMinHeight(oConfiguration, oContent),
			iCount = parseInt(oConfiguration.maxItems) || 0;

		return (iCount * fItemHeight) + "rem";
	};

	ListContentRenderer.getItemMinHeight = function (oConfiguration, oControl) {
		if (!oConfiguration || !oConfiguration.item) {
			return 0;
		}

		var bIsCompact = this.isCompact(oControl),
			oTemplate = oConfiguration.item,
			fItemHeight = bIsCompact ? 2 : 2.75, // list item height in "rem"
			iAttrLength;

		if (oTemplate.description || oTemplate.chart) {
			fItemHeight = 5; // list item height with description or chart in "rem"
		}

		if (oTemplate.description && oTemplate.chart) {
			fItemHeight = 6; // list item height with description and chart in "rem"
		}

		if (oTemplate.attributes) {
			iAttrLength = Math.ceil(oTemplate.attributes.length / 2);
			fItemHeight += iAttrLength * 1.5; // attribute row height in "rem"
		}

		if (oTemplate.actionsStrip) {
			fItemHeight += bIsCompact ? 2.5 : 3.25; // actions strip height in "rem"
		}

		return fItemHeight;
	};

	return ListContentRenderer;
});
