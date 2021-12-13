/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(
  [
    "sap/ui/core/Control",
    "sap/ui/core/HTML",
    "sap/ui/core/ResizeHandler",
    "sap/sac/grid/utils/GridUtils",
    "sap/sac/grid/Format",
    "sap/sac/grid/utils/Utilities"
  ],
  function (
    Control, HTML, ResizeHandler, GridUtils, Format, Utilities
  ) {
    "use strict";
    /**
     * Constructor for a new <code>Grid</code>.
     *
     * @class
     * Enables users to view and edit data in a grid. The grid is mimicking the familiar display of spreadsheets.
     *
     * <h3>Overview</h3>
     *
     * The user can view the data in the grid, trigger actions via a context menu, enter data into input ready
     * cells.
     *
     * <h3>Usage</h3>
     *
     * The <code>Grid</code> is mainly intended as a helper control for the <code>PivotTable</code>.
     * @extends sap.ui.core.Control
     *
     * @private @ui5-restricted sap.zen.dsh
     * @author SAP SE
     * @version 1.96.0
     *
     * @constructor
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     *
     * @alias sap.sac.grid.Grid
     **/
    var Grid = Control.extend(
      "sap.sac.grid.Grid", {
      renderer: "sap.sac.grid.GridRenderer",
      metadata: {
        properties: {
          /**
           * Maximum of rows to be displayed in the <code>Grid<code>
           */
          maxRows: {
            type: "int",
            group: "Dimension",
            defaultValue: 15
          },
          /**
           * Available rows in which the user can scroll
           */
          virtualRows: {
            type: "int",
            group: "Dimension"
          },
          /**
           * Uniform height of a row in the <code>Grid<code>.
           */
          rowHeight: {
            type: "int",
            group: "Dimension",
            defaultValue: 31
          },
          /**
           * Maximum of columns to be displayed in the <code>Grid<code>.
           */
          maxColumns: {
            type: "int",
            defaultValue: 20
          },
          /**
           * Available columns in which the user can scroll
           */
          virtualColumns: {
            type: "int"
          },
          /**
           * The limit of columns transported to the fronted
           */
          columnLimit: {
            type: "int",
            defaultValue: 20
          },
          /**
          * The limit of rows transported to the fronted
          */
          rowLimit: {
            type: "int",
            defaultValue: 125
          },
          /**
           * Indicator whether the grid should support data entry
           */
          input: {
            type: "boolean",
            defaultValue: false
          },
          /**
           * Number of fixed header rows
           */
          fixedRows: {
            type: "int",
            defaultValue: 0
          },
          /**
           * Number of fixed header columns
           */
          fixedColumns: {
            type: "int",
            defaultValue: 0
          },
          /**
           * offset column (handled specially, since a change needs to suppress invalidation of <code>UIArea</code>
           */
          offsetColumn: {
            type: "int",
            defaultValue: 0
          },
          /**
           * offset row (handled specially, since a change needs to suppress invalidation of <code>UIArea</code>
           */
          offsetRow: {
            type: "int",
            defaultValue: 0
          },
          /**
           *  Property for different table formats
           */
          format: {
            type: "sap.sac.grid.Format",
            multiple: false,
            defaultValue: Format.ExcelStyle
          }
        },
        aggregations: {
          /**
           * Cells to be displayed
           */
          cells: {
            "type": "sap.sac.grid.Cell",
            multiple: true,
            bindable: "bindable"
          },
          /**
           * Sematic Styles to be applied for cell, representing a given member
           */
          semanticStyles: {
            "type": "sap.sac.grid.SemanticStyle",
            multiple: true,
            bindable: "bindable"
          }
        },
        defaultAggregation: "cells",
        events: {
          /**
           * Fired when the user scrolls out of the area between available rows and virtual rows
           */
          requestMoreRows: {
            parameters: {
              /**
               * Number of current row
               */
              currentRow: "int",
              /**
               * Promise Resolver to be resolved or rejected when data was fetched
               */
              defered: "object"
            }
          },
          /**
           * Fired when the user scrolls out of the area between available columns and virtual columns
           */
          requestMoreColumns: {
            parameters: {
              /**
               * Number of current column
               */
              currentColumn: "int",
              /**
               * Promise Resolver to be resolved or rejected when data was fetched
               */
              defered: "object"
            }
          },
          /**
           * Is fired on click, the Pivot table displays the context menu
           */
          rightClick: {
            parameters: {
              /**
               * The cell on which the user clicked
               */
              cell: "sap.sac.grid.Cell",
              /**
               * The link which renders the clicked cell
               */
              link: "sap.m.Link"
            }
          },
          /**
           * Is fired on click on an icon (typically a collapse or expand) symbol
           */
          drill: {
            parameters: {
              /**
               * The cell  with the icon
               */
              cell: "sap.sac.grid.Cell"
            }
          }
        }
      },

      init: function () {
        this.reactTableContainer = this.getReactTableDivContainer(this.getId());
      },

      getReactTableDivContainer: function (sId) {
        var $Div = document.createElement('div');
        $Div.setAttribute('id', sId + '-reactNode');
        $Div.className = "sapUiSACReactNode";
        $Div.className = "reactTableComponent";
        return $Div;
      },

      onAfterRendering: function () {
        var that = this;
        GridUtils.renderSACGrid(that);
        var oSACGridControl = that;

        if (!this._iResizeHandlerId) {
          that.AnchorElement = GridUtils.findAnchorElement(that);
          if (!that.AnchorElement) {
            that.AnchorElement = oSACGridControl;
          }
          that._iResizeHandlerId = ResizeHandler.register(that.AnchorElement, function (oEvent) {
            var oTableModel = oSACGridControl.mSacTable && oSACGridControl.mSacTable.cachedData;
            if (oTableModel) {
              Utilities.decideWidgetDimensions(oSACGridControl, oTableModel, true);
              Utilities.updateTableData(oSACGridControl, oTableModel);
            }
          });
          // Listen to the theme changes - since we are handling the theme params from javascript
          sap.ui.getCore().attachThemeChanged(function (event) {
            GridUtils.renderSACGrid(that);
          });
        }

      },

      /**
       * internal method that tells the current Grid Format
       * fetches and compares with Pivot tables format to keep the consistency
       * @returns {string} Current Grid Format - Excel style / Business Style
       */
       _getFormat: function() {
        var sGridFormat = this.getFormat();
        var PivotTableControl = this.getParent() && this.getParent().getPivotTable && this.getParent().getPivotTable();
        var sPivotTableFormat = PivotTableControl && PivotTableControl.getFormat && PivotTableControl.getFormat();
        if (sPivotTableFormat && sGridFormat != sPivotTableFormat) {
          sGridFormat = sPivotTableFormat;
        }
        return sGridFormat;
      }

    }
    );
    return Grid;
  }
);
