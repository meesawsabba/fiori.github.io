/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/sac/grid/utils/Utilities"], function (Utilities) {
  "use strict";
  function TableEventHandlers() {
    var that = this;

    /**
     * maps the grid control's drill event to the react table's drillIconClicked event
     * @param {object} oParams column and row information
     * @param {*} oControl wrapper grid control object
     */
    that.onDrillIconClicked = function (oParams, oControl) {

      // call controls drill event
      var iColumnNumber = parseInt(oParams.col);
      var iRowNumber = parseInt(oParams.row);
      var oCellClicked = Object.keys(oControl.gridCells).length && oControl.gridCells[iRowNumber][iColumnNumber];
      // keepoffset flag to be used by Data provider to fetch resultset with offset
      var bKeepOffset = oParams.row > oControl.getRowLimit();
      if (bKeepOffset) {
        oControl.mergeNewDataWithExisitngData = true;
      }
      if (oCellClicked) {
        oControl.fireEvent("drill", {
          cell: oCellClicked,
          keepOffset: bKeepOffset
        });
      }
    };

    /**
     * maps the grid control's rightclick event to react table's onCellClicked event
     * @param {object} params column, row and source element information
     * source element information is used to open the context menu dialog
     * dialog needs a control to openby - it can be a ui5 control or a DOMRef(in this case)
     * @param {*} oControl wrapper grid control object
     */
    that.onCellClicked = function (params, oControl) {

      // call controls rightClick event
      var iColumnNumber = parseInt(params.col);
      var iRowNumber = parseInt(params.row);
      var oLink = params.event.srcElement;
      var oCellClicked = Object.keys(oControl.gridCells).length && oControl.gridCells[iRowNumber][iColumnNumber];

      if (oCellClicked && oLink) {
        oControl.fireEvent("rightClick", {
          cell: oCellClicked,
          link: oLink
        });
      }
    };

    /**
     * maps the grid contol's requestMoreRows event to react table's onReloadLimitReached event
     * onReloadLimitReached event gets called depending on the no. of rows rendered in the visible area/widget height of react table
     * for example - in a particular resolution- 25 rows are visible in the widget area of react table,
     * then onReloadLimitReached event gets called after every 25(plus-minus-5) rows are scrolled thorugh
     *
     * @param {object} oControl wrapper grid control object
     * @param {object} oParams scrolltop value - in pixels - from top of the table till the vertical scroll
     */
    that.requestMoreRows = function (oControl, oParams) {
      var iFixedRows = oControl.getFixedRows();
      var iCurrentRow = oControl.rowCount - iFixedRows;
      var iMaxVirtualRowsOfDataProvider = oControl.getVirtualRows();
      var iRowLimit = oControl.getRowLimit();
      var iRowHeight = oControl.getRowHeight();

      var bIsScrollDown = Utilities.isScrollDown(oControl);
      var bNewRowsNeedsToBeFetched = (iCurrentRow < iMaxVirtualRowsOfDataProvider);

      var iEstimateCurrentRowOffset = Math.ceil(oParams / iRowHeight); //current row based on scrollposition

      oControl.rowOffset = oControl.rowOffset ? oControl.rowOffset : 0;
      oControl.rowOffsetEnd = oControl.rowOffsetEnd ? oControl.rowOffsetEnd : iRowLimit;

      if (bIsScrollDown && bNewRowsNeedsToBeFetched) {
        if (Utilities.nextBatchDataFetchNeeded(oControl, oParams)) {
          oControl.rowOffsetEnd = oControl.rowOffsetEnd + iRowLimit;
          oControl.rowOffset = oControl.rowOffset + iRowLimit;
          oControl.mergeNewDataWithExisitngData = true;
          oControl.fireEvent("requestMoreRows", {
            currentRow: oControl.rowOffset
          });
        } else {
          Utilities.updateTableData(oControl);
        }
      } else if (iEstimateCurrentRowOffset > oControl.rowOffsetEnd || iEstimateCurrentRowOffset < oControl.rowOffset) {
        // check if estimate row offset is less than rowOffset or greater than rowOffsetEnd
        // then fire a call but dont do anything with the data.
        // this is to make sure expand collapse works properly
        iRowLimit = (iEstimateCurrentRowOffset > oControl.rowOffsetEnd) ? (-1 * iRowLimit) : iRowLimit;
        oControl.rowOffset = oControl.rowOffset - iRowLimit;
        oControl.rowOffsetEnd = oControl.rowOffsetEnd - iRowLimit;
        oControl.mergeNewDataWithExisitngData = true;
        oControl.fireEvent("requestMoreRows", {
          currentRow: oControl.rowOffset
        });

      } else {
        Utilities.updateTableData(oControl);
      }
    };

  }
  return new TableEventHandlers();
});