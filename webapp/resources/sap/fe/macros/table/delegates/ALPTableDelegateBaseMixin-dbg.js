/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */

// ---------------------------------------------------------------------------------------
// Helper class used to help create content in the table/column and fill relevant metadata
// ---------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------
sap.ui.define(
	[
		"sap/fe/macros/chart/ChartUtils",
		"sap/fe/macros/table/Utils",
		"sap/ui/model/Filter",
		"sap/fe/macros/DelegateUtil",
		"sap/base/util/deepClone"
	],
	function(ChartUtils, TableUtils, Filter, DelegateUtil, deepClone) {
		"use strict";

		/**
		 * Helper class for sap.ui.mdc.Table.
		 * <h3><b>Note:</b></h3>
		 * The class is experimental and the API/behavior is not finalized; this class is currently not meant for productive usage.
		 *
		 * @author SAP SE
		 * @private
		 * @experimental
		 * @since 1.69
		 * @alias sap.fe.macros.table.ALPTableDelegateBaseMixin
		 */

		function _getChartControl(oTable) {
			var oView = sap.ui.fl.Utils.getViewForControl(oTable);
			var sChartId = oView.getContent()[0].data("singleChartId");
			return oView.byId(sChartId);
		}

		/**
		 * @param oTable mdc table control
		 * @param oMetadataInfo metadata info of table
		 * @param oBindingInfo binding info of table
		 * in alp, when the table's binding info is being updated, the table
		 * must consider the chart selections, if they are present.
		 * otherwise, the filterbar filters must be considered.
		 */
		var ALPTableDelegateBaseMixin = {
			_internalUpdateBindingInfo: function(oTable, oMetadataInfo, oBindingInfo) {
				var oFilterInfo, oFilter;
				var oChartFilterInfo = {},
					oTableFilterInfo = {};
				var aTableFilters, aChartFilters;

				// We need to deepClone the info we get from the custom data, otherwise some of its subobjects (e.g. parameters) will
				// be shared with oBindingInfo and modified later (Object.assign only does a shallow clone)
				Object.assign(oBindingInfo, deepClone(DelegateUtil.getCustomData(oTable, "rowsBindingInfo")));
				if (oTable.getRowBinding()) {
					oBindingInfo.suspended = false;
				}
				var oMdcChart = _getChartControl(oTable);
				var bChartSelectionsExist = ChartUtils.getChartSelectionsExist(oMdcChart, oTable);
				oTableFilterInfo = TableUtils.getAllFilterInfo(oTable);
				aTableFilters = oTableFilterInfo && oTableFilterInfo.filters;
				oFilterInfo = oTableFilterInfo;
				if (bChartSelectionsExist) {
					oChartFilterInfo = ChartUtils.getAllFilterInfo(oMdcChart);
					aChartFilters = oChartFilterInfo && oChartFilterInfo.filters;
					oFilterInfo = oChartFilterInfo;
				}
				var aFinalFilters = aTableFilters && aChartFilters ? aTableFilters.concat(aChartFilters) : aChartFilters || aTableFilters;
				oFilter = new Filter({
					filters: aFinalFilters,
					and: true
				});

				if (oFilterInfo.bindingPath) {
					// In case of parameters
					oBindingInfo.path = oFilterInfo.bindingPath;
				}

				// Prepare binding info with filter/search parameters
				TableUtils.updateBindingInfo(oBindingInfo, oFilterInfo, oFilter);
			},
			_getDelegateParentClass: function() {
				return undefined;
			},
			rebindTable: function(oTable, oBindingInfo) {
				var oInternalModelContext = oTable.getBindingContext("pageInternal");
				var sTemplateContentView = oInternalModelContext.getProperty(oInternalModelContext.getPath() + "/alpContentView");
				if (sTemplateContentView !== "Chart") {
					this._getDelegateParentClass().rebindTable(oTable, oBindingInfo);
				}
			}
		};

		return ALPTableDelegateBaseMixin;
	},
	/* bExport= */ false
);
