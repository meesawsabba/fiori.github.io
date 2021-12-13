/*!
 * (c) Copyright 2010-2019 SAP SE or an SAP affiliate company.
 */
/*global sap*/
sap.ui.define(
  [
    "jquery.sap.global",
    "sap/ui/core/Control",
    "sap/zen/crosstab/IHeaderCell",
    "sap/zen/crosstab/CellStyleHandler",
    "sap/zen/crosstab/rendering/RenderingConstants",
    "sap/zen/crosstab/utils/Utils",
    "sap/zen/crosstab/library"
  ],
  function(
    jQuery, Control, IHeaderCell, CellStyleHandler,
    RenderingConstants
  ){
    "use strict";
    // Provides control sap.zen.crosstab.HeaderCell.
    jQuery.sap.declare("sap.zen.crosstab.HeaderCell");
    /**
     * Constructor for a new HeaderCell.
     *
     * @param {string} [sId] id for the new control, generated automatically if no id is given
     * @param {object} [mSettings] initial settings for the new control
     *
     * @class
     * Add your documentation for the new HeaderCell
     * @extends sap.ui.core.Control
     *
     * @constructor
     * @public
     * @deprecated since 1.89.0
     * @name sap.zen.crosstab.HeaderCell
    
     */
    Control.extend("sap.zen.crosstab.HeaderCell", /** @lends sap.zen.crosstab.HeaderCell.prototype */ { metadata : {

      library : "sap.zen.crosstab",
      properties : {

        /**
        Rowspan of the cell
         */
        rowSpan : {type : "int", group : "Misc", defaultValue : null},

        /**
        Colspan of the cell
         */
        colSpan : {type : "int", group : "Misc", defaultValue : null},

        /**
        Text of the cell
         */
        text : {type : "string", group : "Misc", defaultValue : null},

        /**
        helper to format the cell
         */
        formatter : {type : "object", group : "Misc", defaultValue : null},

        /**
        whether to merge the cell if the keys are equal
         */
        mergeKey : {type : "string", group : "Misc", defaultValue : null},

        /**
        sorting 
         */
        sort : {type : "string", group : "Misc", defaultValue : null},

        /**
        sort action
         */
        sortAction : {type : "string", group : "Misc", defaultValue : null},

        /**
        area of the cell
         */
        area : {type : "object", group : "Misc", defaultValue : null},

        /**
        the effective col span
         */
        effectiveColSpan : {type : "int", group : "Misc", defaultValue : null},

        /**
        the effective row span
         */
        effectiveRowSpan : {type : "int", group : "Misc", defaultValue : null},

        /**
        the row of the cell in the crosstab
         */
        row : {type : "int", group : "Misc", defaultValue : null},

        /**
        the column of the cell in the crosstab
         */
        col : {type : "int", group : "Misc", defaultValue : null},

        /**
        the level of the cell
         */
        level : {type : "int", group : "Misc", defaultValue : null},

        /**
        the drillstate of the cell
         */
        drillState : {type : "string", group : "Misc", defaultValue : null},

        /**
        the hierarcyh action of the cell
         */
        hierarchyAction : {type : "string", group : "Misc", defaultValue : null},

        /**
        the hierarchy tooltip
         */
        hierarchyTooltip : {type : "string", group : "Misc", defaultValue : null},

        /**
        the IE8 row span
         * @deprecated since 1.89.0
         */
        htmlIE8RowSpan : {type : "int", group : "Misc", defaultValue : 1},

        /**
        the text sort index
         */
        sortTextIndex : {type : "int", group : "Misc", defaultValue : null},

        /**
        the row of the tabe
         */
        tableRow : {type : "int", group : "Misc", defaultValue : null},

        /**
        the column of the table
         */
        tableCol : {type : "int", group : "Misc", defaultValue : null},

        /**
        the alignment of the cell
         */
        alignment : {type : "string", group : "Misc", defaultValue : null},

        /**
        the id of the associated member
         */
        memberId : {type : "string", group : "Misc", defaultValue : null},

        /**
        the id of the parent of the associated member
         */
        parentMemberId : {type : "string", group : "Misc", defaultValue : null},

        /**
        the node alignment
         */
        nodeAlignment : {type : "string", group : "Misc", defaultValue : null}
      }
    }});

    sap.zen.crosstab.HeaderCell.prototype.init = function () {
      this.aStyles = [];
      this.bLoading = false;
      this.bSelectable = false;
      this.bIsResult = false;
      this.bIsMobileResize = false;
      this.sUnit = "";
      this.bIsEntryEnabled = false;
      this.sPassiveCellType = RenderingConstants.PASSIVE_CELL_TYPE_NORMAL;
      this.iNumberOfLineBreaks = 0;
      this.sScalingAxis = null;
      this.bIsPivotCell = false;
      this.bIsSplitPivotCell = false;
      this.bIsRevertDrop = false;
    };

    sap.zen.crosstab.HeaderCell.prototype.getCellType = function() {
      return RenderingConstants.TYPE_HEADER_CELL;
    };

    sap.zen.crosstab.HeaderCell.prototype.isHeaderCell = function() {
      return true;
    };

    sap.zen.crosstab.HeaderCell.prototype.getCssClassNames = function (bIsIE8, bIsRtl, bIsMsIE) {
      return CellStyleHandler.getCssClasses(this.aStyles, bIsIE8, bIsRtl, bIsMsIE);
    };

    sap.zen.crosstab.HeaderCell.prototype.getStyleIdList = function () {
      return this.aStyles;
    };

    sap.zen.crosstab.HeaderCell.prototype.setStyleIdList = function (aNewStyles) {
      this.aStyles = aNewStyles;
    };

    sap.zen.crosstab.HeaderCell.prototype.addStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      if (this.aStyles.indexOf(iStyleId) === -1) {
        this.aStyles.push(iStyleId);
      }
    };

    sap.zen.crosstab.HeaderCell.prototype.removeStyle = function (sStyle) {
      var iStyleId = CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex !== -1) {
        this.aStyles.splice(iIndex, 1);
      }
    };

    sap.zen.crosstab.HeaderCell.prototype.hasStyle = function (sStyle) {
      var iStyleId =CellStyleHandler.getStyleId(
        sStyle,
        RenderingConstants.TYPE_HEADER_CELL
      );
      var iIndex = this.aStyles.indexOf(iStyleId);
      if (iIndex === -1) {
        return false;
      } else {
        return true;
      }
    };

    sap.zen.crosstab.HeaderCell.prototype.isLoading = function () {
      return this.bLoading;
    };

    sap.zen.crosstab.HeaderCell.prototype.setLoading = function (bLoading) {
      this.bLoading = bLoading;
    };

    sap.zen.crosstab.HeaderCell.prototype.isSelectable = function () {
      return this.bSelectable;
    };

    sap.zen.crosstab.HeaderCell.prototype.setSelectable = function (bSelectable) {
      this.bSelectable = bSelectable;
    };

    sap.zen.crosstab.HeaderCell.prototype.setResult = function (bIsResult) {
      this.bIsResult = bIsResult;
    };

    sap.zen.crosstab.HeaderCell.prototype.isResult = function () {
      return this.bIsResult;
    };

    sap.zen.crosstab.HeaderCell.prototype.getUnescapedText = function () {
      return sap.zen.crosstab.utils.Utils.unEscapeDisplayString(this.getText());
    };

    sap.zen.crosstab.HeaderCell.prototype.isMobileResize = function () {
      return this.bIsMobileResize;
    };

    sap.zen.crosstab.HeaderCell.prototype.setMobileResize = function (pbMobileResize) {
      this.bIsMobileResize = pbMobileResize;
    };

    sap.zen.crosstab.HeaderCell.prototype.setEntryEnabled = function (bIsEntryEnabled) {
      this.bIsEntryEnabled = bIsEntryEnabled;
    };

    sap.zen.crosstab.HeaderCell.prototype.isEntryEnabled = function () {
      return this.bIsEntryEnabled;
    };

    sap.zen.crosstab.HeaderCell.prototype.setUnit = function (sUnit) {
      this.sUnit = sUnit;
    };

    sap.zen.crosstab.HeaderCell.prototype.getUnit = function () {
      return this.sUnit;
    };

    sap.zen.crosstab.HeaderCell.prototype.getPassiveCellType = function () {
      return this.sPassiveCellType;
    };

    sap.zen.crosstab.HeaderCell.prototype.setPassiveCellType = function (sPCellType) {
      this.sPassiveCellType = sPCellType;
    };

    sap.zen.crosstab.HeaderCell.prototype.setNumberOfLineBreaks = function (iNumberOfLineBreaks) {
      this.iNumberOfLineBreaks = iNumberOfLineBreaks;
    };

    sap.zen.crosstab.HeaderCell.prototype.getNumberOfLineBreaks = function () {
      return this.iNumberOfLineBreaks;
    };

    sap.zen.crosstab.HeaderCell.prototype.getScalingAxis = function() {
      return this.sScalingAxis;
    };

    sap.zen.crosstab.HeaderCell.prototype.setScalingAxis = function(sScalingAxis) {
      this.sScalingAxis = sScalingAxis;
    };

    sap.zen.crosstab.HeaderCell.prototype.isPivotCell = function() {
      return this.bIsPivotCell;
    };

    sap.zen.crosstab.HeaderCell.prototype.setPivotCell = function(bIsPivotCell) {
      this.bIsPivotCell = bIsPivotCell;
    };

    sap.zen.crosstab.HeaderCell.prototype.isSplitPivotCell = function() {
      return this.bIsSplitPivotCell;
    };

    sap.zen.crosstab.HeaderCell.prototype.setSplitPivotCell = function(bIsSplitPivotCell) {
      this.bIsSplitPivotCell = bIsSplitPivotCell;
    };

    sap.zen.crosstab.HeaderCell.prototype.isRevertDrop = function() {
      return this.bIsRevertDrop;
    };

    sap.zen.crosstab.HeaderCell.prototype.setRevertDrop = function(bIsRevertDrop) {
      this.bIsRevertDrop = bIsRevertDrop;
    };

    sap.zen.crosstab.HeaderCell.prototype.getFormattedText = function() {
      var lText = this.getText();

      var oArea = this.getArea();
      var fRenderCallback = oArea.getRenderCellCallback();
      if (fRenderCallback) {
        var oCallbackResult = fRenderCallback(
          new IHeaderCell(
          )
        );
        lText = oCallbackResult.renderText;
      }
      var oFormatter = this.getFormatter();
      if (oFormatter) {
        lText = oFormatter.format(lText);
      }
      return lText;
    };
    return sap.zen.crosstab.HeaderCell;
  }
);
