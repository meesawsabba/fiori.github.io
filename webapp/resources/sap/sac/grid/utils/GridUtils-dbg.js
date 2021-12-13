/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */

/* global ReactTable : true */
sap.ui.define(
  [
    "sap/base/Log",
    "sap/ui/core/theming/Parameters",
    "sap/sac/grid/utils/Utilities",
    "sap/sac/grid/utils/TableEventHandlers",
    "sap/sac/grid/Format",
    "sap/sac/grid/utils/ModelHelper",
    "sap/sac/grid/utils/CellStyle",
    "sap/sac/grid/thirdparty/sac.internal.grid.vendor",
    "sap/sac/grid/thirdparty/sac.internal.grid.main.2021.22"
  ],
  function (
    Log, ThemeParams, Utilities, TableEventHandlers, Format, ModelHelper, CellStyle
  ) {
    "use strict";
    function GridUtils() {
      var that = this;

      /**
       * forms the style object used in cells of react table rows
       * different style objects for different formats - Excel and Business style
       * @param {string} sStyleFormat Excel or Business style
       * @param {object} oCell grid control cell for which style is decided
       * @param {number} iFixedRows no of fixed rows in wrapper grid control
       * @param {number} iFixedColumns no of fixed columns in wrapper grid control
       * @param {object} oHierarchyInfo hierarchy level of the cell
       * @returns {object} style object used in cells of react table rows
       */
      function getStyleClassForSacTableCell(sStyleFormat, oCell, iFixedRows, iFixedColumns, oHierarchyInfo) {
        var oCellStyleInfo = {
          style: {},
          styleUpdatedByUser: true
        };
        var iCurrentRow = oCell.getRow(); var iCurrentCol = oCell.getColumn();
        var sGridCellType = oCell.getCellType();
        var cellBackgroundColor = ThemeParams.get("sapUiListHeaderBackground");
        var oCellCustomData = oCell.data();

        var isOverallResultsCell = oHierarchyInfo['isOverallResults'];

        if (sStyleFormat == Format.ExcelStyle) {
          var bFixedCellBgFill = ((iCurrentRow < iFixedRows) || (iCurrentCol < iFixedColumns)) && sGridCellType != 'Title';

          oCellStyleInfo.style = {
            "fillColor": (bFixedCellBgFill || isOverallResultsCell) ? cellBackgroundColor : 'transparent', // for fixed rows and columns, except Titles
            "wrap": false
          };
        } else if (sStyleFormat == Format.BusinessStyle) {

          var bNonMeasureStruc = oCellCustomData['cellDimension'] == "NonMeasureStructure";
          oCellStyleInfo.style = CellStyle.getStyleObjectForAlignmentAndBackGround(oCell, iFixedRows);

          if (oHierarchyInfo['showStyleLinesForDataLevel'] && sGridCellType != 'Title' && !bNonMeasureStruc) {
            oCellStyleInfo.style.lines = CellStyle.getStyleObjectForHierarchyLevel(oHierarchyInfo['level']);
          }
          var sSemanticClass = oCell.getSemanticClass();
          if (sSemanticClass && oCell.getDisplayValue()) {
            oCellStyleInfo.style.lines = CellStyle.getStyleObjectForBusinessScenario(sSemanticClass);
          }
          if (isOverallResultsCell) {
            // for overall result type of cells add the grey background
            oCellStyleInfo.style.fillColor = cellBackgroundColor;
          }
        }
        return oCellStyleInfo;
      }

      /**
       * forms the react table rows and cells array from the Grid controls cells aggregation
       * depending on the style format of the grid
       * @param {object} oControl wrapper grid control
       * @param {string} sGridFormat sacgrid format, excel style/business style/custom style
       * @returns {object} the rows along with cells in the structure needed by react table model
       */
      function getSacCellInformation(oControl, sGridFormat) {
        var iFixedColumns = oControl.getFixedColumns();
        var iFixedRows = oControl.getFixedRows();
        var aGridCells = oControl.getCells();

        var bReversedHierarchy = false;
        var iMaxColumnIndex = 0; var iMaxRowIndex = 0;

        // store rows and columns which are of type Overall Result(SUMME and total)
        var oOverallResultCells = {
          rows: [],
          columns: []
        };

        //oGridRowsWithCells is similar to oControl.getCells() but stores the cells information in a row column structure instead of a plain array
        var oGridRowsWithCells = oControl.mergeNewDataWithExisitngData ? oControl.gridCells : {};
        //oReactTableRowsWithCells will hold the information of all rows and cells inside rows
        //each row is an array with multiple cells, representing the columns of the table
        var oReactTableRowsWithCells = {};
        aGridCells.forEach(function (oCell) {

          //reacttablecellinfo object will hold the information of react table cells for each row
          var oReactTableCellInfo = {};

          var iRow = parseInt(oCell.getRow()); var iCol = parseInt(oCell.getColumn());
          var sCellText = oCell.getDisplayValue(); var sIcon = oCell.getIcon();
          iMaxRowIndex = (iRow > iMaxRowIndex) ? iRow : iMaxRowIndex;
          iMaxColumnIndex = (iCol > iMaxColumnIndex) ? iCol : iMaxColumnIndex;

          //each row is an array with multiple cells
          oReactTableRowsWithCells[iRow] = (oReactTableRowsWithCells[iRow]) ? oReactTableRowsWithCells[iRow] : [];

          //fetches and sets the information on hierarchy in data - drill icon, level of hierarchy, hierarchy padding
          var oHierarchyInfo = Utilities.getHierarchyInfo(sGridFormat, oCell, oReactTableRowsWithCells, iFixedColumns, iFixedRows, oOverallResultCells);
          oReactTableCellInfo = Object.assign(oReactTableCellInfo, oHierarchyInfo);

          //decide columnwidth
          var iColumnWidth = Utilities.calculateColumnWidth({
            displayText: sCellText,
            isBold: oHierarchyInfo['isInATotalsContext'],
            hierarchyPaddingLeft: oHierarchyInfo['hierarchyPaddingLeft']
          });
          oReactTableCellInfo.ColumnWidth = iColumnWidth;

          //decide the sactable cell type from Grid cell type
          oReactTableCellInfo.type = Utilities.cellTypeMapping(oCell.getCellType(), oHierarchyInfo['isInATotalsContext']);

          //fetches the style to be applied to the cell
          var oCellStyleInfo = getStyleClassForSacTableCell(sGridFormat, oCell, iFixedRows, iFixedColumns, oHierarchyInfo);
          oReactTableCellInfo = Object.assign(oReactTableCellInfo, oCellStyleInfo);

          //assign the cellInfo object to the row object
          oReactTableRowsWithCells[iRow][iCol] = oReactTableCellInfo;

          //fill the oGridRowsWithCells in the row column structure
          //will be used later to retrieve a cell from a given row and column
          oGridRowsWithCells[iRow] = (oGridRowsWithCells[iRow]) ? oGridRowsWithCells[iRow] : [];
          oGridRowsWithCells[iRow][iCol] = Utilities.extractUsefulInfoFromCell(oCell);

          //if the table hierarchy is reversed - bottom to top instead of top to bottom
          if (!bReversedHierarchy) {
            bReversedHierarchy = (sIcon === 'sap-icon://slim-arrow-up') ? true : false;
          }
        });
        Utilities.storePropertiesToControl(oControl, bReversedHierarchy, iMaxColumnIndex, iMaxRowIndex, oGridRowsWithCells);
        Utilities.fillMissingIndexes(oControl, oReactTableRowsWithCells);
        return oReactTableRowsWithCells;
      }

      /**
       * Creates and Renders the third-party React Table
       * this method is called everytime the wrapper grid control is re-rendered
       * method reads the cells aggregation from wrapper control and forms the oTableModel needed for rendering the React table
       * @param {object} oControl the wrapper Grid control object
       */
      that.renderSACGrid = function (oControl) {

        createTableInstance(oControl);

        var oTableModel;
        if (oControl.mSacTable && oControl.mSacTable.cachedData) {
          oTableModel = oControl.mSacTable.cachedData;
        } else {
          oTableModel = ModelHelper.fetchInitialTableModel(oControl.getId());
        }

        if (oControl.dataRequestedForExpandCollapse) {
          //do nothing
          oControl.dataRequestedForExpandCollapse = false;
          Utilities.updateTableData(oControl, oTableModel);
          return;
        }

        if (oControl.getCells().length > 0) {
          //check for no data found to fill one cell with No data Available text
          if (oControl.getCells().length === 1) {
            var oCell0 = oControl.getCells()[0];
            Utilities.showNoDataInSacTable(oCell0.getDisplayValue(), oControl);
            return;
          } else {
            Utilities.addRemoveCssClassToReactTable(false, "noDataInTable", oControl);
          }

          var sGridFormat = oControl._getFormat();
          var aSacCelllInfo = getSacCellInformation(oControl, sGridFormat);

          Utilities.addRowsAndColumnSettingsToTableModel(oControl, oTableModel, aSacCelllInfo);
          Utilities.addDataRegionPropertiesToTableModel(oControl, oTableModel);
          oTableModel.showGrid = (sGridFormat != Format.BusinessStyle);
          Utilities.decideWidgetDimensions(oControl, oTableModel);

          if (oControl.mSacTable && oTableModel.rows.length > 0) {
            Utilities.updateTableData(oControl, oTableModel);
          }
        }
      };

      /**
       * creates the react table instance and is stored in the wrapper Grid Conrol object
       * ReactTable is available as a global object from the thirdparty library
       * @param {object} oControl the Wrapper Grid control object
       */
      function createTableInstance(oControl) {
        if (!oControl.mSacTable) {
          var tableCallbacks = {

            // maps the grid control's rightclick event to react table's onCellClicked event
            onCellMouseUp: function (params) {
              // check if left clicked or right clicked
              // check if clicked on the cell value only then open the context menu
              if (params.event && params.event.button === 0 && Utilities.cellValueClicked(params)) {
                TableEventHandlers.onCellClicked(params, oControl);
              }
            },

            // maps the grid control's drill event to the react table's drillIconClicked event
            onDrillIconClicked: function (oParams) {
              TableEventHandlers.onDrillIconClicked(oParams, oControl);
              oControl.mSacTable.scrollPosition = {
                scrollTop: oControl.mSacTable.getScrollTop(),
                scrollLeft: oControl.mSacTable.getScrollLeft()
              };
            },

            // maps the grid contol's requestMoreRows event to react table's onReloadLimitReached event
            onReloadLimitReached: function (oParams) {
              TableEventHandlers.requestMoreRows(oControl, oParams);
            }
          };

          // see DefaultTableData.ts for all properties of initial model expected by react table
          var oTableModel = ModelHelper.fetchInitialTableModel(oControl.getId());

          oControl.mSacTable = new ReactTable.ReactTable(oTableModel, oControl.reactTableContainer, tableCallbacks);
        }
      }

      /**
       * loops to find out the Anchor VBox element inside which Pivot control is placed
       * Pivot control is used in financial apps, Grid Control is a helper control inside the Pivot Control
       * @param {object} oControl the SACGrid control
       * @returns {object} the anchor element - Vbox - inside which the Pivot table is placed
       */
      that.findAnchorElement = function (oControl) {
        var oAnchorElement = oControl.getParent();
        while (oAnchorElement && !(oAnchorElement instanceof sap.m.VBox)) {
          oAnchorElement = oAnchorElement.getParent();
        }
        return oAnchorElement;
      };

    }
    return new GridUtils();
  }
);
