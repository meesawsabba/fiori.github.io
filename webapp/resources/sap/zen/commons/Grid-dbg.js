/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/Grid",
  [
   "sap/zen/commons/utils/jQuery",
    "sap/ui/core/Control",
    "sap/m/VBox",
    "sap/zen/commons/utils/GridUtils",
    "sap/zen/commons/GridRenderer"
  ],
  function (
    jQuery, Control, VBox, GridUtils
  ) {
    "use strict";
    /**
     * Constructor for a new <code>Grid</code>.
     * @public
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
     * @author SAP SE
     * @version 1.96.0
     *
     * @constructor
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new control
     * @public
     * @experimental
     * @alias sap.zen.commons.Grid
     **/
    var Grid = Control.extend(
      "sap.zen.commons.Grid", {
        renderer: "sap.zen.commons.GridRenderer",
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
              defaultValue: 25
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
             * offset column
             */
            offsetColumn: {
              type: "int",
              defaultValue: 0
            },
            /**
             * offset row
             */
            offsetRow: {
              type: "int",
              defaultValue: 0
            },
            /**
             *  Property for different table formats
             */
            format: {
              type: "sap.zen.commons.Format",
              multiple: false,
              defaultValue: sap.zen.commons.Format.ExcelStyle
            }
          },
          aggregations: {
            /**
             * Cells to be displayed
             */
            cells: {
              "type": "sap.zen.commons.Cell",
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
                cell: "sap.zen.commons.Cell",
                /**
                 * The link which renders the clicked cell
                 */
                link: "sap.m.Link"
              }
            },
            /**
             * Is fired on hover, when the user enters the cell
             */
            cellEnter: {
              parameters: {
                /**
                 * The cell  which the user entered
                 */
                cell: "sap.zen.commons.Cell",
                /**
                 * The dom element which the user entered
                 */
                element: "object"
              }
            },
            /**
             * Is fired on hover, when the user leaves the cell
             */
            cellLeave: {
              parameters: {
                /**
                 * The cell  which the user left
                 */
                cell: "sap.zen.commons.Cell"
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
                cell: "sap.zen.commons.Cell"
              }
            }
          },
          publicMethods: [
            "invalidateColumnWidth"
          ]
        },
        /**
         * clears all internal column widhts, when cells are rendered next time, the columns get auto fitted
         */
        invalidateColumnWidth: function () {
          delete this._maxFailedCol;
          delete this._ColumnWidth2;
        },
        init: function () {
          var that = this;
          (function () {
            var nOffsetRow = 0;
            var nOffsetCol = 0;
            that.clearOffset = function () {
            };
            that.clearOffsetCol = function () {
              that.invalidate();
            };
            that.getOffsetRow = function () {
              return nOffsetRow;
            };
            that.getOffsetColumn = function () {
              if (nOffsetCol < 0) {
                throw new Error("Invalid offset Column");
              }
              return nOffsetCol;
            };
            that.setOffsetColumn = function (n) {
              nOffsetCol = n;
            };
            that.setOffsetRow = function (n) {
              nOffsetRow = n;
            };
          }());
        },
        exit: function () {
          GridUtils.clearCellControls(this).clearButtonControls(this);
          delete this._$ffParent;
        },
        onBeforeRendering: function () {
          var that = this;
          GridUtils.calcHash(that).calcCellControls(that).calcButtonControls(that);
          delete that._$ffParent;
          delete that._kdSet; //Key Down registered
        },
        autoFit: function () {
          var that = this;
          var $Grid = jQuery(that.getDomRef());
          $Grid.find(".sapUiZenCommonsGridInnerTable").addClass("sapUiZenCommonsSize");
          var nARE = $Grid.width() - 10;
          var nURE = $Grid.find(".sapUiZenCommonsGridOuterCell11").width();
          var nNUR = nARE - nURE;
          var nFac = 1 + nNUR / nARE;
          if (nFac > 1.05) {
            GridUtils.handleColWidth(that, $Grid, nFac);
          }
          nNUR = $Grid.width() - $Grid.find(".sapUiZenCommonsGridOuterCell11").width();
          nFac = 1 + nNUR / $Grid.width();
          $Grid.find(".sapUiZenCommonsGridInnerTable").removeClass("sapUiZenCommonsSize");
        },
        onAfterRendering: function () {
          var that = this;
          var $Grid = jQuery(that.getDomRef());
          that.bInResize = false;
          if (!that.getCells().length) {
            return;
          }
          GridUtils.insertContentToGrid(that, $Grid);
          $Grid.find(
            ".ui-resizable-handle"
          ).css(
            "background-image", "none"
          );
          GridUtils.prepareOuterTableForResize(that, $Grid);
          var oAnchorElement = that.getParent();
          while (oAnchorElement && !(oAnchorElement instanceof VBox)) {
            oAnchorElement = oAnchorElement.getParent();
          }
          var $Anchor = oAnchorElement ? jQuery(oAnchorElement.getDomRef()) : jQuery(that.getParent() && that.getParent().getDomRef ? that.getParent().getDomRef() : $Grid);
          if (!that._$ffParent || $Anchor === that._$ffParent) {
            that._$ffParent = $Anchor;
            that._$ffParent.sizeChanged(
              function (oParameter) {
                if (!that.bInResize) {
                  delete that._maxFailedCol;
                  return GridUtils.doResize(that, jQuery(that.getDomRef()), oParameter);
                }
                return null;
              }
            );
          }
          GridUtils.ensureResisable(that, $Grid);
          GridUtils.handleColWidth(that, $Grid);
          $Grid.find(
            ".ui-resizable-handle"
          ).css(
            "background-image", "none"
          );
          GridUtils.prepareOuterTableForResize(that, $Grid);
          GridUtils.adjustHsbThumbPosition(that, $Grid);
          GridUtils.adjustVsbThumbPosition(that, $Grid);
          if ($Anchor.length) {
            GridUtils.doResize(that, $Grid, {
              width: $Anchor.width(),
              height: $Anchor.viewportHeight()
            });
          }
          if (that._nFocusColumn && that._nFocusRow) {
            if (
              $Grid.find("[data-grid-row=" + that._nFocusRow + "][data-grid-column=" + that._nFocusColumn + "]>div>a").length
            ) {
              $Grid.find("[data-grid-row=" + that._nFocusRow + "][data-grid-column=" + that._nFocusColumn + "]>div>a").focus();
            }
          }
        }
      }
    );
    return Grid;
  }
);