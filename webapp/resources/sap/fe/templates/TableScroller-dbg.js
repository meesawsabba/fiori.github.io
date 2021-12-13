/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(
	[],
	function() {
		"use strict";

		var TableScroller = {
			/**
			 * Scrolls an MDC table to a given row, identified by its context path.
			 * If the row with the path can't be found, the table stays unchanged.
			 *
			 * @param {sap.ui.mdc.Table} oTable The table to be scrolled
			 * @param {string} sRowPath The path identifying the row to scroll to
			 */
			scrollTableToRow: function(oTable, sRowPath) {
				var oTableRowBinding = oTable.getRowBinding();

				var getTableContexts = function() {
					if (oTable.data().tableType === "GridTable") {
						return oTableRowBinding.getContexts(0);
					} else {
						return oTableRowBinding.getCurrentContexts();
					}
				};

				var findAndScroll = function() {
					var oTableRow = getTableContexts().find(function(item) {
						return item && item.getPath() === sRowPath;
					});
					if (oTableRow) {
						oTable.scrollToIndex(oTableRow.getIndex());
					}
				};

				if (oTableRowBinding) {
					var oTableRowBindingContexts = getTableContexts();

					if (
						(oTableRowBindingContexts.length === 0 && oTableRowBinding.getLength() > 0) ||
						oTableRowBindingContexts.some(function(context) {
							return context === undefined;
						})
					) {
						// The contexts are not loaded yet --> wait for a change event before scrolling
						oTableRowBinding.attachEventOnce("dataReceived", findAndScroll);
					} else {
						// Contexts are already loaded --> we can try to scroll immediately
						findAndScroll();
					}
				}
			}
		};

		return TableScroller;
	},
	/* bExport= */
	true
);
