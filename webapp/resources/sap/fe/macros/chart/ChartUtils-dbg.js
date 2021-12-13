/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

sap.ui.define(["sap/ui/model/Filter", "sap/fe/macros/filter/FilterUtils", "sap/ui/model/FilterOperator", "sap/base/Log"], function(
	Filter,
	FilterUtil,
	FilterOperator,
	Log
) {
	"use strict";
	var aPrevDrillStack = [];
	var oChartUtils = {
		/**
		 * Method to check if selections exist in the chart.
		 *
		 * @param {object} oMdcChart The MDC chart control
		 * @param {object} oSource The control that has to apply chart filters
		 * @returns {boolean} `true` if chart selection exists, false otherwise
		 */
		getChartSelectionsExist: function(oMdcChart, oSource) {
			// consider chart selections in the current drill stack or on any further drill downs
			oSource = oSource || oMdcChart;
			if (oMdcChart) {
				try {
					var oChart = oMdcChart.getControlDelegate()._getChart(oMdcChart);
					if (oChart) {
						var aDimensions = oChartUtils.getDimensionsFromDrillStack(oChart);
						var bIsDrillDown = aDimensions.length > aPrevDrillStack.length;
						var bIsDrillUp = aDimensions.length < aPrevDrillStack.length;
						var bNoChange = aDimensions.toString() === aPrevDrillStack.toString();
						var aFilters;
						if (bIsDrillUp && aDimensions.length === 1) {
							// drilling up to level0 would clear all selections
							aFilters = oChartUtils.getChartSelections(oMdcChart, true);
						} else {
							// apply filters of selections of previous drillstack when drilling up/down
							// to the chart and table
							aFilters = oChartUtils.getChartSelections(oMdcChart);
						}
						if (bIsDrillDown || bIsDrillUp) {
							// update the drillstack on a drill up/ drill down
							aPrevDrillStack = aDimensions;
							return aFilters.length > 0;
						} else if (bNoChange && oSource.isA("sap.ui.mdc.Table")) {
							// bNoChange is true when chart is selected
							return aFilters.length > 0;
						}
					}
				} catch (sError) {
					return false;
				}
			}
			return false;
		},
		/**
		 * Method that returns the chart filters stored in the UI model.
		 *
		 * @param {object} oMdcChart The MDC chart control
		 * @param {boolean} bClearSelections Clears chart selections in the UI model if true
		 * @returns {Array} The chart selections
		 */
		getChartSelections: function(oMdcChart, bClearSelections) {
			// get chart selections
			if (bClearSelections) {
				oChartUtils.getChartModel(oMdcChart, "", {});
			}
			var aVizSelections = oChartUtils.getChartModel(oMdcChart, "filters");
			return aVizSelections || [];
		},
		/**
		 * Method that returns the chart selections as a filter.
		 *
		 * @param {object} oMdcChart The MDC chart control
		 * @returns {object} Filter containing chart selections
		 */
		getChartFilters: function(oMdcChart) {
			// get chart selections as a filter
			var aFilters = oChartUtils.getChartSelections(oMdcChart) || [];
			return new Filter(aFilters);
		},
		/**
		 * Method that sets the chart selections as in the UI model.
		 *
		 * @param {object} oMdcChart The MDC chart control
		 */
		setChartFilters: function(oMdcChart) {
			var oChart = oMdcChart.getControlDelegate()._getChart(oMdcChart);
			var aChartFilters = [];
			function addChartFilters(aSelectedData) {
				for (var item in aSelectedData) {
					var aDimFilters = [];
					for (var i in aVisibleDimensions) {
						var sPath = aVisibleDimensions[i];
						var sValue = aSelectedData[item].data[sPath];
						if (sValue !== undefined) {
							aDimFilters.push(
								new Filter({
									path: sPath,
									operator: FilterOperator.EQ,
									value1: sValue
								})
							);
						}
					}
					if (aDimFilters.length > 0) {
						aChartFilters.push(new Filter(aDimFilters, true));
					}
				}
			}
			if (oChart) {
				var aVizSelections = oChartUtils.getVizSelection(oChart);
				var aVisibleDimensions = oChart.getVisibleDimensions();
				var aDimensions = oChartUtils.getDimensionsFromDrillStack(oChart);
				if (aDimensions.length > 0) {
					// saving selections in each drill stack for future use
					var oDrillStack = oChartUtils.getChartModel(oMdcChart, "drillStack") || {};
					oChartUtils.getChartModel(oMdcChart, "drillStack", {});
					oDrillStack[aDimensions.toString()] = aVizSelections;
					oChartUtils.getChartModel(oMdcChart, "drillStack", oDrillStack);
				}
				if (aVizSelections.length > 0) {
					// creating filters with selections in the current drillstack
					addChartFilters(aVizSelections);
				} else {
					// creating filters with selections in the previous drillstack when there are no selections in the current drillstack
					var aDrillStackKeys = Object.keys(oDrillStack) || [];
					var aPrevDrillStackData = oDrillStack[aDrillStackKeys[aDrillStackKeys.length - 2]] || [];
					addChartFilters(aPrevDrillStackData);
				}
				oChartUtils.getChartModel(oMdcChart, "filters", aChartFilters);
			}
		},
		/**
		 * Method that returns the chart selections as a filter.
		 *
		 * @param {object} oChart The inner chart control
		 * @returns {object} The filters in the filter bar
		 */
		getFilterBarFilterInfo: function(oChart) {
			return FilterUtil.getFilterInfo(oChart.getFilter(), {
				targetControl: oChart
			});
		},
		/**
		 * Method that returns the filters for the chart and filter bar.
		 *
		 * @param {object} oChart The inner chart control
		 * @returns {object} The new filter containing the filters for both the chart and the filter bar
		 */
		getAllFilterInfo: function(oChart) {
			var oFilters = oChartUtils.getFilterBarFilterInfo(oChart);
			var aChartFilters = oChartUtils.getChartFilters(oChart);

			if (aChartFilters && aChartFilters.aFilters && aChartFilters.aFilters.length) {
				oFilters.filters.push(aChartFilters);
			}
			// filterbar + chart filters
			return oFilters;
		},
		/**
		 * Method that returns selected data in the chart.
		 *
		 * @param {object} oChart The inner chart control
		 * @returns {Array} The selected chart data
		 */
		getChartSelectedData: function(oChart) {
			var aSelectedPoints = [];
			switch (oChart.getSelectionBehavior()) {
				case "DATAPOINT":
					aSelectedPoints = oChart.getSelectedDataPoints().dataPoints;
					break;
				case "CATEGORY":
					aSelectedPoints = oChart.getSelectedCategories().categories;
					break;
				case "SERIES":
					aSelectedPoints = oChart.getSelectedSeries().series;
					break;
			}
			return aSelectedPoints;
		},
		/**
		 * Method to get filters, drillstack and selected contexts in the UI model.
		 * Can also be used to set data in the model.
		 *
		 * @param {object} oMdcChart The MDC chart control
		 * @param {string} sPath The path in the UI model from which chart data is to be set/fetched
		 * @param {object|Array} vData The chart info to be set
		 * @returns {object|Array} The chart info (filters/drillstack/selectedContexts)
		 */
		getChartModel: function(oMdcChart, sPath, vData) {
			var oInternalModelContext = oMdcChart.getBindingContext("internal");
			if (!oInternalModelContext) {
				return false;
			}

			if (vData) {
				oInternalModelContext.setProperty(sPath, vData);
			}
			return oInternalModelContext && oInternalModelContext.getObject(sPath);
		},
		/**
		 * Method to fetch the current drillstack dimensions.
		 *
		 * @param {object} oChart The inner chart control
		 * @returns {Array} The current drillstack dimensions
		 */
		getDimensionsFromDrillStack: function(oChart) {
			var aCurrentDrillStack = oChart.getDrillStack() || [];
			var aCurrentDrillView = aCurrentDrillStack.pop() || {};
			var aDimensions = aCurrentDrillView.dimension || [];
			return aDimensions;
		},
		/**
		 * Method to fetch chart selections.
		 *
		 * @param {object} oChart The inner chart control
		 * @returns {Array} The chart selections
		 */
		getVizSelection: function(oChart) {
			return (oChart && oChart._getVizFrame() && oChart._getVizFrame().vizSelection()) || [];
		}
	};

	return oChartUtils;
});
