/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */

// Provides control sap.gantt.simple.GanttRowAction
sap.ui.define([
	"sap/ui/table/RowAction"
], function(TableRowAction) {
	"use strict";

	/**
	 * Creates and initializes a new GanttRowAction class
	 *
	 * @param {string} [sId] ID for the new control, generated automatically if no ID is given
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables users to define a control aggregation for RowAction
	 *
	 * @extends sap.ui.table.RowAction
	 *
	 * @author SAP SE
	 * @version 1.96.0
	 *
	 * @constructor
	 * @experimental
	 * @alias sap.gantt.simple.GanttRowAction
	 */
	var GanttRowAction = TableRowAction.extend("sap.gantt.simple.GanttRowAction", /** @lends sap.gantt.simple.GanttRowAction.prototype */{
		metadata: {
			library: "sap.gantt",
			properties: {
				/*
				* Row ID uniquely identifying the row
				*/
				rowId: {type: "string"},
				/*
				* Column width for the GanttRowAction column
				*/
				columnWidth: {type:"int", defaultValue:181}

			},
			aggregations: {

				/**
				 * The control aggregation for the GanttRowAction
				 */
				controlTemplate: {type : "sap.ui.core.Control", multiple : false}

			}
		},
        init: function() {
            this._bFixedLayout = true;
            this._aActions = ["", ""];
            this._iLastCloseTime = 0;
        },
        onBeforeRendering: function() {
			var oGantt = this.getRow().getTable().getParent();
			oGantt._oSplitter.detachResize(this.setTableColumnStyle, this);
        },
		onAfterRendering: function() {
			var oGantt = this.getRow().getTable().getParent();
			oGantt._oSplitter.attachResize(this.setTableColumnStyle, this);
			this.setTableColumnStyle();
		},
		setTableColumnStyle: function() {
			var bRTL = sap.ui.getCore().getConfiguration().getRTL();
			//Width
			var oTable = this.getRow().getTable(),
				sTableId = oTable.getId();
			var oRowActionColumnWidth = (this.getColumnWidth() < 181) ? 181 + "px" : this.getColumnWidth() + "px";
			if (bRTL) {
				document.getElementById(sTableId + "-sapUiTableColHdrScr").style.marginLeft = oRowActionColumnWidth;
				document.getElementById(sTableId + "-sapUiTableCtrlScr").style.marginLeft = oRowActionColumnWidth;
			} else {
				document.getElementById(sTableId + "-sapUiTableColHdrScr").style.marginRight = oRowActionColumnWidth;
				document.getElementById(sTableId + "-sapUiTableCtrlScr").style.marginRight = oRowActionColumnWidth;
			}
			document.getElementById(sTableId + "-rowacthdr").style.width = oRowActionColumnWidth;
			document.getElementById(sTableId + "-sapUiTableRowActionScr").style.width = oRowActionColumnWidth;
			document.getElementById(this.getId()).parentElement.style.width = oRowActionColumnWidth;
		}
	});

	return GanttRowAction;
});
