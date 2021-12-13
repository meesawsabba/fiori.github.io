/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/commons/Cell",
  [
    "sap/ui/core/Element",
    "sap/zen/commons/CellType"
  ],
  function (
    Element, CellType
  ) {
    "use strict";
    /** Creates and initializes a new Cell.
     * settings.
     * @public
     *
     * @class Cell of a Grid.
     * @extends sap.ui.core.Element
     * @param {string} [sId] ID for the new control, generated automatically if no ID is given
     * @param {object} [mSettings] Initial settings for the new element
     * @abstract
     * @author SAP SE
     * @version 1.96.0
     * @experimental
     * @alias sap.zen.commons.Cell
     * @since 1.0.0
     */
    var oCell = Element.extend(
      "sap.zen.commons.Cell", {
        metadata: {
          library: "sap.zen.commons",
          properties: {
            /**
             * The value that is displayed in the cell
             */
            displayValue: {
              type: "string"
            },
            /**
             * The celltype of the cell. (HEADER, TITLE, RESULT, ...)
             */
            cellType: {
              type: "sap.zen.commons.CellType",
              defaultValue: CellType.STANDARD
            },
            /**
             * The Column of the <code>Cell</code>
             */
            column: {
              type: "int",
              defaultValue: 0
            },
            /**
             * The Icon to be displayed in the <code>Cell</code>
             */
            icon: {
              type: "string"
            },
            /**
             * The Help Id of the <code>Cell</code>. Intended to be used by WebAssist/Enable Now.
             */
            helpId: {
              type: "string"
            },
            /**
             * The value state of the  <code>Cell</code>. This property is used for entry ready cells.
             */
            valueState: {
              type: "sap.ui.core.ValueState"
            },
            /**
             * The row of the <code>Cell</code>.
             */
            row: {
              type: "int",
              defaultValue: 0
            },
            /**
             * The indent level of the <code>Cell</code>.
             */
            displayLevel: {
              type: "int"
            },
            /**
             * Indicates whether the <code>Cell</code> is input enabled.
             */
            inputEnabled: {
              type: "boolean"
            },
            /**
             * The semantic class of the Cell. The css class associated to the class is put into the cells td.
             */
             semanticClass: {
              "type": "string"
            },
             /**
             * The Alert Level of the cell for exeptional reporting
             */
            alertLevel: {
              type: "sap.zen.commons.AlertLevel"
            }
          }
        }
      }
    );
    return oCell;
  }
);
