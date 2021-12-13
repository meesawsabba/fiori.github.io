/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/core/ExtensionAPI", "sap/fe/macros/filter/FilterUtils", "sap/fe/macros/chart/ChartUtils"], function(
	ExtensionAPI,
	FilterUtils,
	ChartUtils
) {
	"use strict";

	/**
	 * @class Extension API for list reports on SAP Fiori elements for OData V4.
	 * @alias sap.fe.templates.ListReport.ExtensionAPI
	 * @extends sap.fe.core.ExtensionAPI
	 * @public
	 * @hideconstructor
	 * @final
	 * @since 1.79.0
	 */
	var extensionAPI = ExtensionAPI.extend("sap.fe.templates.ListReport.ExtensionAPI", {
		/**
		 * @private
		 * @name sap.fe.templates.ListReport.ExtensionAPI.getMetadata
		 * @function
		 */
		/**
		 * @private
		 * @name sap.fe.templates.ListReport.ExtensionAPI.extend
		 * @function
		 */

		/**
		 * Refreshes the List Report.
		 * This method currently only supports triggering the search (by clicking on the GO button)
		 * in the List Report Filter Bar. It can be used to request the initial load or to refresh the
		 * currently shown data based on the filters entered by the user.
		 * Please note: The Promise is resolved once the search is triggered and not once the data is returned.
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#refresh
		 * @returns {Promise} Resolved once the data is refreshed or rejected if the request failed
		 *
		 * @public
		 */
		refresh: function() {
			var oFilterBar = this._controller._getFilterBarControl();
			return oFilterBar.waitForInitialization().then(function() {
				oFilterBar.triggerSearch();
			});
		},

		/**
		 * Gets the list entries currently selected for the displayed control.
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#getSelectedContexts
		 * @returns {sap.ui.model.odata.v4.Context[]} Array containing the selected contexts
		 *
		 * @public
		 */
		getSelectedContexts: function() {
			var oControl = (this._controller._isMultiMode() && this._controller._getCurrentControl()) || this._controller._getTable();
			if (oControl.isA("sap.ui.mdc.ChartNew")) {
				var aSelectedContexts = [];
				if (oControl && oControl.get_chart()) {
					var aSelectedDataPoints = ChartUtils.getChartSelectedData(oControl.get_chart());
					for (var i = 0; i < aSelectedDataPoints.length; i++) {
						aSelectedContexts.push(aSelectedDataPoints[i].context);
					}
				}
				return aSelectedContexts;
			} else {
				return (oControl && oControl.getSelectedContexts()) || [];
			}
		},

		/**
		 * Set the filter values for the given property in the filter bar.
		 * The filter values can be either a single value or an array of values.
		 * Each filter value must be represented as a string corresponding to the given operator.
		 *
		 * @param {string} sConditionPath The path to the property as a condition path
		 * @param {string} [sOperator] The operator to be used (optional) - if not set, the default operator (EQ) will be used
		 * @param {Array | string} vValues The values to be applied
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#setFilterValues
		 * @returns {Promise} A promise for async handling
		 * @public
		 */
		setFilterValues: function(sConditionPath, sOperator, vValues) {
			return FilterUtils.setFilterValues(this._controller._getFilterBarControl(), sConditionPath, sOperator, vValues);
		},

		/**
		 * This method converts filter conditions to filters.
		 *
		 * @param {map} mFilterConditions Map containing the filter conditions of the FilterBar.
		 *
		 * @alias sap.fe.templates.ListReport.ExtensionAPI#createFiltersFromFilterConditions
		 * @returns {object} Object containing the converted FilterBar filters.
		 * @public
		 */
		createFiltersFromFilterConditions: function(mFilterConditions) {
			var oFilterBar = this._controller._getFilterBarControl();
			return FilterUtils.getFilterInfo(oFilterBar, undefined, mFilterConditions);
		}
	});

	return extensionAPI;
});
