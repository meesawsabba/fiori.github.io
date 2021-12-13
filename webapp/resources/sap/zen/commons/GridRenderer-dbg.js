/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/GridRenderer",
  [
    "sap/zen/commons/library",
    "sap/zen/commons/utils/jQuery",
    "sap/zen/commons/Format",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    easyGrid, jQuery, Format, _
  ) {
    "use strict";
    function GridRenderer() {
      var that = this;
      var fixedColumns = 0;
      var fixedRows = 0;
      var oHash = null;
      that.render = function (oRm, oControl) {
        oHash = oControl.getHash();
        var oCellControls = oControl.getCellControls();
        var oButtonControls = oControl.getButtonControls();
        fixedColumns = oControl.getFixedColumns();
        fixedRows = oControl.getFixedRows();
        var aRowHeader = [];
        var aColHeader = [];
        function renderCell(oCell, nColumn, nRow, nCI, nRI) {
          if (oCell) {
            if (nRow < fixedRows) {
              if (!nColumn < fixedColumns) {
                if (aColHeader[nColumn]) {
                  aColHeader[nColumn] = [aColHeader[nColumn], oCell.getId()].join(" ");
                } else {
                  aColHeader.push(oCell.getId());
                }
              }
            } else if (nColumn < fixedColumns) {
              if (aRowHeader[nRow]) {
                aRowHeader[nRow] = [aRowHeader[nRow], oCell.getId()].join(" ");
              } else {
                aRowHeader.push(oCell.getId());
              }
            }
          }
          oRm.openStart(
            "td"
          ).attr(
            "data-grid-coord", nRow + ":" + nColumn
          ).attr(
            "data-grid-column", nCI
          ).attr(
            "data-grid-row", nRI
          ).class(nColumn < oControl.getFixedColumns() ? "sapUiZenCommonsGridFixCol" : "sapUiZenCommonsGridDynCol");
          if (nRow === oControl.getFixedRows() - 1) {
            oRm.class("sapUiZenCommonsGridLastFixedRow");
          }
          if (oCell) {
            switch (oCell.getCellType()) {
            case easyGrid.CellType.Title:
              oRm.attr("data-help-id", oCell.getHelpId());
              break;
            }
          }
          if (nColumn >= fixedColumns && nRow >= fixedRows) {
            oRm.attr(
              "headers", _.concat(
                aRowHeader[nRow - fixedRows], aColHeader[nColumn - fixedColumns]
              ).join(" ")
            );
          }
          if (oControl._ColumnWidth2 && oControl._ColumnWidth2[nColumn]) {
            var sWi = oControl._ColumnWidth2[nColumn] + "px";
            oRm.style("width", sWi);
          }
          oRm.openEnd();
          var oButton = oButtonControls[[nRow, nColumn].join(":")];
          oRm.openStart("span").style("display", "inline-block").class("sapUiZenCommonsGridHierIcon").class(
            "sapUiIcon"
          ).class(
            "sapUiIconPointer"
          ).openEnd();
          if (oButton) {
            oRm.renderControl(oButton);
          }
          oRm.close("span");
          oRm.voidStart(
            "div"
          ).attr(
            "data-grid-column", nCI
          ).attr(
            "data-grid-row", nRI
          ).attr(
            "data-grid-coord", nRow + ":" + nColumn
          ).class(
            "sapUiZenCommonsGridCellDiv"
          ).voidEnd().renderControl(
            oCellControls[[nRI, nCI].join(":")]
          ).close("td");
        }
        function renderHSB() {
          oRm.openStart(
            "table"
          ).openEnd().openStart(
            "tr"
          ).openEnd().openStart(
            "td"
          ).attr(
            "colspan", oControl.getFixedColumns()
          ).class(
            "sapUiZenCommonsGridHsbHTd"
          ).openEnd().openStart(
            "div"
          ).class(
            "sapUiZenCommonsGridHsbHTdDiv"
          ).openEnd().close(
            "div"
          ).close(
            "td"
          ).openStart(
            "td"
          ).attr(
            "colspan", oControl.getMaxColumns() - oControl.getFixedColumns()
          ).openEnd().openStart(
            "div", oControl.getId() + "-hsb"
          ).class(
            "sapUiZenCommonsGridHsb"
          ).openEnd().openStart(
            "div", oControl.getId() + "-hsb-i"
          ).class(
            "sapUiZenCommonsGridHsbI"
          ).openEnd().openStart(
            "span"
          ).class(
            "sapUiZenCommonsGridHTooltip"
          ).openEnd().close(
            "span"
          ).openStart(
            "div", oControl.getId() + "-hsb-ii"
          ).class(
            "sapUiZenCommonsGridHsbII"
          ).openEnd().close(
            "div"
          ).close(
            "div"
          ).close(
            "div"
          ).close(
            "td"
          ).close(
            "tr"
          ).close("table");
        }
        function renderGridCells() {
          function getFormatClass(){
            switch(oControl.getFormat()){
            case Format.ExcelStyle: return "sapUiZenCommonsGridExcelStyle";
            case Format.BusinessStyle: return "sapUiZenCommonsGridBusinessStyle";
            case Format.BusinessStyleFormular: return "sapUiZenCommonsGridBusinessStyleFormular";
            case Format.CustomStyle: return "sapUiZenCommonsGridCustomStyle";
            default: return "sapUiZenCommonsGridBasicStyle";
            }
          }
          oRm.openStart("div").class(
            "sapUiZenCommonsGridInnerDiv"
          ).openEnd().openStart("table").class(
            "sapUiZenCommonsGridInnerTable"
          ).class(getFormatClass()).openEnd();
          oHash.rowRange.forEach(
            function (nRow, nRI) {
              oRm.openStart("tr").class("sapUiZenCommonsGridRow");
              if (!nRow) {
                oRm.class("sapUiZenCommonsGridFirstRow");
              }
              if (nRow < fixedRows) {
                oRm.class("sapUiZenCommonsGridFixedRow");
              }
              oRm.style(
                "height", oControl.getRowHeight() + "px"
              ).style(
                "max-height", oControl.getRowHeight() + "px"
              ).style(
                "min-height", oControl.getRowHeight() + "px"
              ).openEnd();
              oHash.colRange.forEach(
                function (nColumn, nCI) {
                  var oCell = oHash[nRI + ":" + nCI];
                  renderCell(oCell, nColumn, nRow, nCI, nRI);
                }
              );
              oRm.close("tr");
            }
          );
          oRm.close(
            "table"
          ).close("div");
        }
        function renderGrid() {
          oRm.openStart(
            "div"
          ).class(
            "sapUiZenCommonsGridOuterDiv"
          ).openEnd();
          if (oControl.getCells().length) {
            oRm.openStart(
              "table"
            ).class(
              "sapUiZenCommonsGridOuterTable"
            ).openEnd().openStart(
              "tr"
            ).openEnd().openStart(
              "td"
            ).class(
              "sapUiZenCommonsGridOuterCell11"
            ).openEnd();
            renderGridCells();
            oRm.close(
              "td"
            ).openStart(
              "td"
            ).class(
              "sapUiZenCommonsGridOuterCell12"
            ).openEnd().close(
              "td"
            ).close(
              "tr"
            ).openStart(
              "tr"
            ).openEnd().openStart(
              "td"
            ).openEnd();
            renderHSB(oRm, oControl);
            oRm.close(
              "td"
            ).close(
              "tr"
            ).close(
              "table"
            );
          }
          oRm.close("div");
        }
        function renderControl() {
          oRm.openStart("div");
          oRm.writeControlData(oControl);
          oRm.openEnd();
          renderGrid();
          oRm.close("div");
        }
        renderControl(oRm, oControl);
      };
    }
    easyGrid.GridRenderer = new GridRenderer();
    return easyGrid.GridRenderer;
  }, true
);
