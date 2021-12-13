/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the chart/item and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	["sap/fe/macros/ChartDelegate"],
	function(BaseChartDelegate) {
		"use strict";
		var ChartDelegate = Object.assign({}, BaseChartDelegate);

		/**
		 * @param oMDCChart The mdc chart control
		 * @param oBindingInfo The binding info of chart
		 * data in chart and table must be synchronised. every
		 * time the chart refreshes, the table must be refreshed too.
		 */
		ChartDelegate.rebindChart = function(oMDCChart, oBindingInfo) {
			//	var oComponent = flUtils.getAppComponentForControl(oMDCChart);
			//	var bIsSearchTriggered = oComponent.getAppStateHandler().getIsSearchTriggered();
			// workaround in place to prevent chart from loading when go button is present and initial load is false
			//	if (bIsSearchTriggered) {
			var oInternalModelContext = oMDCChart.getBindingContext("pageInternal");
			var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
			if (!sTemplateContentView || sTemplateContentView !== "Table") {
				BaseChartDelegate.rebindChart(oMDCChart, oBindingInfo);
			}
		};

		return ChartDelegate;
	},
	/* bExport= */ false
);
