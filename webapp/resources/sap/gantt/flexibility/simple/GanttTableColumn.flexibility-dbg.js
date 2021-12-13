/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

sap.ui.define([
	"sap/gantt/utils/GanttFlexibilityUtils"
], function (GanttFlexibilityUtils) {
	"use strict";

	return {
		"hideControl": "default",
		"unhideControl": "default",
        "moveControls": "default",
        "GanttTableColumnOrder": {
			"changeHandler": {
				applyChange: function (oChange, oControl, mPropertyBag) {
					var oModifier = mPropertyBag.modifier,
						oView = mPropertyBag.view,
						oAppComponent = mPropertyBag.appComponent,
						oChangeDefinition = oChange.getDefinition(),
						sAggregationName = oChangeDefinition.content["aggregationName"],
						aNewColumnIds = oChangeDefinition.content["newValue"],
						aOldColumnIds = oChangeDefinition.content["oldValue"];

					// collect the columns before removing them
					var oNewColumns = [];
					aNewColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						oNewColumns.push(oColumn);
					});

					// move children in `columns` aggregation around
					if (oNewColumns.length > 0) {
						oModifier.removeAllAggregation(oControl, sAggregationName);
						oNewColumns.forEach(function (column, idx) {
							oModifier.insertAggregation(oControl, sAggregationName, column, idx, oView);
						});
					}

					oChange.setRevertData(aOldColumnIds);
					return true;
				},

				revertChange: function (oChange, oControl, mPropertyBag) {
					var oAppComponent = mPropertyBag.appComponent,
						oView = mPropertyBag.view,
						oModifier = mPropertyBag.modifier,
						aOldColumnIds = oChange.getRevertData(),
						oChangeDefinition = oChange.getDefinition(),
						sAggregationName = oChangeDefinition.content["aggregationName"];

					// collect the columns before removing them
					var aOldColumns = [];
					aOldColumnIds.forEach(function (columnId) {
						var oColumn = oModifier.bySelector(columnId, oAppComponent, oView);
						aOldColumns.push(oColumn);
					});

					// move children in `columns` aggregation around
					if (aOldColumns.length > 0) {
						oModifier.removeAllAggregation(oControl, sAggregationName);
						aOldColumns.forEach(function (column, idx) {
							oModifier.insertAggregation(oControl, sAggregationName, column, idx, oView);
						});
					}

					oChange.resetRevertData();
					return true;
				},

				completeChangeContent: function (oChange, mSpecificChangeInfo, mPropertyBag) {
					return;
				},
				getCondenserInfo : function(oChange) {
					return {
						affectedControl: oChange.getSelector(),
						classification: sap.ui.fl.condenser.Classification.LastOneWins,
						uniqueKey: "GanttTableColumnOrder"
					};
				}
			},
			layers: {
				"USER": true // enables personalization which is by default disabled
			}
		},
		"TableColumnSortOrder": GanttFlexibilityUtils.fnChangeHandler("TableColumnSortOrder"),
		"TableColumnFilterValue": GanttFlexibilityUtils.fnChangeHandler("TableColumnFilterValue"),
		"TableColumnVisibility": GanttFlexibilityUtils.fnChangeHandler("TableColumnVisibility")
    };
}, /* bExport= */ true);
