/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/ui/core/Control",
    "sap/zen/crosstab/CellStyleHandler",
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/utils/Utils",
    "sap/zen/crosstab/library"
  ],
  function(jQuery, Control, CellStyleHandler, RenderingConstants, Utils){
    "use strict";
    // Provides control sap.zen.crosstab.DataCell.
    jQuery.sap.declare("sap.zen.crosstab.DataCell");
    /**
     * Constructor for a new DataCell.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the new DataCell
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @deprecated since 1.89.0
     * @name sap.zen.crosstab.DataCell
     */
    Control.extend("sap.zen.crosstab.DataCell", /** @lends sap.zen.crosstab.DataCell.prototype */ { metadata : {
      library : "sap.zen.crosstab",
      properties : {
        /**
         * the text of the data cell
         */
        text : {type : "string", group : "Misc", defaultValue : null},

        /**
         * the area of the data cell
         */
        area : {type : "object", group : "Misc", defaultValue : null},

        /**
         * the row of the data cell
         */
        row : {type : "int", group : "Misc", defaultValue : null},

        /**
         * the column of the data cell
         */
        col : {type : "int", group : "Misc", defaultValue : null},

        /**
         * the table row of the data cell
         */
        tableRow : {type : "int", group : "Misc", defaultValue : null},

        /**
         * the table column of the data cell
         */
        tableCol : {type : "int", group : "Misc", defaultValue : null}
      }
    }});


    /**
     *
     * @name sap.zen.crosstab.DataCell#addStyle
     * @function
     * @param {string} sSStyle
     * @type void
     * @public
     */

    ///**
    // * This file defines behavior for the control,
    // */

    sap.zen.crosstab.DataCell.prototype.init = function () {
      "use strict";
      this.aStyles = [];
      this.bLoading = false;
      this.bIsEntryEnabled = false;
      this.sUnit = "";
      this.sPassiveCellType = RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
      this.iNumberOfLineBreaks = 0;
    };
    sap.zen.crosstab.DataCell.prototype.getCellType = function() {
      return RenderingConstants.TYPE_DATA_CELL;
    };
    sap.zen.crosstab.DataCell.prototype.isHeaderCell = function() {
      return false;
    };
    sap.zen.crosstab.DataCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
      return CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
    };
    sap.zen.crosstab.DataCell.prototype.getStyleIdList = function () {
      return this.aStyles;
    };
    sap.zen.crosstab.DataCell.prototype.setStyleIdList = function (aNewStyles) {
      this.aStyles = aNewStyles;
    };
    sap.zen.crosstab.DataCell.prototype.addStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_DATA_CELL
      );
      if (this.aStyles.indexOf(iStyleId) === -1) {
        this.aStyles.push(iStyleId);
      }
    };
    sap.zen.crosstab.DataCell.prototype.removeStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle, RenderingConstants.TYPE_DATA_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex !== -1) {
        this.aStyles.splice(iIndex, 1);
      }
    };
    sap.zen.crosstab.DataCell.prototype.hasStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle, RenderingConstants.TYPE_DATA_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex === -1) {
        return false;
      } else {
        return true;
      }
    };
    sap.zen.crosstab.DataCell.prototype.getColSpan = function () {
      return 1;
    };
    sap.zen.crosstab.DataCell.prototype.getRowSpan = function () {
      return 1;
    };
    sap.zen.crosstab.DataCell.prototype.getEffectiveColSpan = function () {
      return 1;
    };
    sap.zen.crosstab.DataCell.prototype.getEffectiveRowSpan = function () {
      return 1;
    };
    sap.zen.crosstab.DataCell.prototype.isLoading = function () {
      return this.bLoading;
    };
    sap.zen.crosstab.DataCell.prototype.setLoading = function (bLoading) {
      this.bLoading = bLoading;
    };
    sap.zen.crosstab.DataCell.prototype.isSelectable = function () {
      return false;
    };
    sap.zen.crosstab.DataCell.prototype.getUnescapedText = function () {
      return Utils.unEscapeDisplayString(this.getText());
    };
    sap.zen.crosstab.DataCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
      this.bIsEntryEnabled = bIsEntryEnabled;
    };
    sap.zen.crosstab.DataCell.prototype.isEntryEnabled = function () {
      return this.bIsEntryEnabled;
    };
    sap.zen.crosstab.DataCell.prototype.setUnit = function (sUnit) {
      this.sUnit = sUnit;
    };
    sap.zen.crosstab.DataCell.prototype.getUnit = function () {
      return this.sUnit;
    };
    sap.zen.crosstab.DataCell.prototype.getPassiveCellType = function () {
      return this.sPassiveCellType;
    };
    sap.zen.crosstab.DataCell.prototype.setPassiveCellType = function (sPCellType) {
      this.sPassiveCellType = sPCellType;
    };
    sap.zen.crosstab.DataCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
      this.iNumberOfLineBreaks = iNumberOfLineBreaks;
    };
    sap.zen.crosstab.DataCell.prototype.getNumberOfLineBreaks = function () {
      return this.iNumberOfLineBreaks;
    };
    return sap.zen.crosstab.DataCell;
  }
);
