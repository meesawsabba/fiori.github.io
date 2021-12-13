/*!
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  [
    "sap/base/Log",
    "sap/zen/commons/utils/jQuery",
    "sap/zen/commons/utils/Utilities",
    "sap/zen/commons/Format",
    "sap/ui/core/Icon",
    "sap/m/Input",
    "sap/m/Link",
    "sap/ui/core/CustomData",
    "sap/zen/commons/utils/ResourceBundle",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/commons/utils/jQuery"
  ],
  function(
    Log, jQuery, Utilities, Format, Icon, Input, Link, CustomData, ResourceBundle, _
  ) {
    "use strict";
    var KeyCodes = {
      Tab: 9,
      Up: 38,
      Down: 40,
      Left: 37,
      Right: 39
    };
    function removeVsb(oGrid, $Grid) {
      $Grid.find(
        ".sapUiZenCommonsGridOuterTable"
      ).css("width", "");
      $Grid.find(".sapUiZenCommonsGridVsb").remove();
      return oGrid;
    }
    function calcScrollHThumbPos(oGrid, $Grid) {
      var nVisCol = Math.min(oGrid.getMaxColumns() - oGrid.getFixedColumns(), oGrid.getHash().maxColumns-oGrid.getHash().minColumns +1 );
      var nMaxOffset = oGrid.getVirtualColumns() - nVisCol;
      var nReal = $Grid.find(".sapUiZenCommonsGridHsbII").width() - $Grid.find(".sapUiZenCommonsGridHsbI").width();
      return sap.ui.getCore().getConfiguration().getRTL() ? nReal - Math.round(oGrid.getOffsetColumn() * nReal / nMaxOffset) : Math.round(oGrid.getOffsetColumn() * nReal / nMaxOffset);
    }
    function calcScrollVThumbPos(oGrid, $Grid) {
      var nMaxOffset = oGrid.getVirtualRows() - Math.min(oGrid.getHash().maxRows + 1, oGrid.getMaxRows()) + oGrid.getFixedColumns();
      var nReal = $Grid.find(".sapUiZenCommonsGridVsbII").height() - $Grid.find(".sapUiZenCommonsGridVsbI").height();
      return Math.round(oGrid.getOffsetRow() * nReal / nMaxOffset);
    }
    function getVis(node) {
      return !node.getVisible || node.getVisible() && (node.getParent() ? getVis(node.getParent()) : true);
    }
    function getBusy(node) {
      return !node.getBusy || node.getBusy() && (node.getParent() ? getBusy(node.getParent()) : false);
    }
    function calcRanges(oGrid) {
      var oHash = oGrid.getHash();
      oHash.rowRange = _.take(_.concat(_.range(oGrid.getFixedRows()), _.range(oGrid.getFixedRows() + oGrid.getOffsetRow(), oHash.maxRows + 1)), oGrid.getMaxRows());
      oHash.colRange = _.take(_.concat(_.range(oGrid.getFixedColumns()), _.range(oGrid.getFixedColumns() + oGrid.getOffsetColumn(), oHash.maxColumns + 1)), oGrid.getMaxColumns());
    }
    function getColumn($Grid, nIndex) {
      return $Grid.find(
        [
          "td[data-grid-column=",
          nIndex,
          "]"
        ].join("")
      );
    }
    function setColumnWidth($Grid, nIndex, nWidth) {
      if (!Number.isFinite(nWidth)) {
        throw new Error("Invalid width for column:" + nIndex + " width:" + nWidth);
      }
      var $Col = $Grid.find([
        "td[data-grid-column=",
        nIndex,
        "]"
      ].join(""));
      if (!$Col.length) {
        return;
      }
      var $also = $Grid.find([
        "td[data-grid-column=",
        nIndex,
        "]>div"
      ].join(""));
      $also.width("100%");
      $Col.width(nWidth);
      $Col.css("max-width", nWidth + "px");
      $Col.css("min-width", nWidth + "px");
      if (nWidth !== $Col.width()) {
        Log.info("Failed to set width for column " + nIndex + " to: " + nWidth + " width: " + $Col.width());
      }
      $also.css("width", "");
    }
    function GridUtils() {
      var that = this;
      //Magic Constants for scrollbar width and icon size
      that.getDrillIconSize = _.constant(21);
      that.getScrollbarWidth = _.constant(16);
      //--------------------------------------------------
      var oRowStylesTd = {
        Title: {
          td: _.constant("sapUiZenCommonsGridTitleCellTd"),
          div: _.constant("sapUiZenCommonsGridTitleCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        },
        Header: {
          td: _.constant("sapUiZenCommonsGridHeaderCellTd"),
          div: _.constant("sapUiZenCommonsGridHeaderCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        },
        ResultHeader: {
          td: _.constant("sapUiZenCommonsGridHeaderResultCellTd"),
          div: _.constant("sapUiZenCommonsGridHeaderResultCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        },
        Result: {
          td: _.constant("sapUiZenCommonsGridStandardResultCellTd"),
          div: _.constant("sapUiZenCommonsGridStandardResultCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        },
        ResultCritical: {
          td: _.constant("sapUiZenCommonsGridStandardResultCellTd"),
          div: _.constant("sapUiZenCommonsGridStandardResultCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerCritical")
        },
        ResultPositive: {
          td: _.constant("sapUiZenCommonsGridStandardResultCellTd"),
          div: _.constant("sapUiZenCommonsGridStandardResultCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerPositive")
        },
        ResultNegative: {
          td: _.constant("sapUiZenCommonsGridStandardResultCellTd"),
          div: _.constant("sapUiZenCommonsGridStandardResultCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerNegative")
        },
        Standard: {
          td: function () {
            return "sapUiZenCommonsGridStandardCellTd";
          },
          div: _.constant("sapUiZenCommonsGridStandardCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        },
        Positive: {
          td: function () {
            return "sapUiZenCommonsGridStandardCellTd";
          },
          div: _.constant("sapUiZenCommonsGridStandardCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerPositive")
        },
        Negative: {
          td: function () {
            return  "sapUiZenCommonsGridStandardCellTd";
          },
          div: _.constant("sapUiZenCommonsGridStandardCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerNegative")
        },
        Critical: {
          td: function () {
            return  "sapUiZenCommonsGridStandardCellTd";
          },
          div: _.constant("sapUiZenCommonsGridStandardCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInnerCritical")
        },
        Empty: {
          td: function () {
            return "sapUiZenCommonsGridStandardCellTd";
          },
          div: _.constant("sapUiZenCommonsGridStandardCellDiv"),
          inner: _.constant("sapUiZenCommonsGridCellInner")
        }
      };
      function scrollTooltipHandlerVsb(oGrid, $Grid) {
        var nMaxOffset = oGrid.getVirtualRows() - Math.min(oGrid.getHash().maxRows + 1, oGrid.getMaxRows()) + oGrid.getFixedRows();
        oGrid._bScrollV = true;
        var $EasyGridVsbI = $Grid.find(".sapUiZenCommonsGridVsbI");
        var nReal = $Grid.find(
          ".sapUiZenCommonsGridVsbII"
        ).height() - $EasyGridVsbI.height();
        var nPosSB = $EasyGridVsbI.scrollTop();
        var nOC = Math.round(nMaxOffset * nPosSB / nReal);
        if (nOC > nMaxOffset) {
          Log.warning("Invalid offset ");
          nOC = nMaxOffset;
        }
        $Grid.find(
          ".sapUiZenCommonsGridVTooltip"
        ).text(
          ResourceBundle.getText(
            "VPOS",
            [
              nOC + 1,
              nOC + Math.min(oGrid.getHash().maxRows + 1, oGrid.getMaxRows()) - oGrid.getFixedRows(), oGrid.getVirtualRows()
            ]
          )
        );
      }
      function scrollTooltipHandlerHsb(oGrid, $Grid) {
        var nMaxOffset = oGrid.getVirtualColumns() - Math.min(oGrid.getHash().maxColumns + 1, oGrid.getMaxColumns()) + oGrid.getFixedColumns();
        oGrid._bScrollH = true;
        var $EasyGridHsbI = $Grid.find(".sapUiZenCommonsGridHsbI");
        var nReal = $Grid.find(
          ".sapUiZenCommonsGridHsbII"
        ).width() - $EasyGridHsbI.width();
        var nOC = null;
        var nPosSB = $EasyGridHsbI.scrollLeft();
        if (
          sap.ui.getCore().getConfiguration().getRTL()
        ) {
          nOC = Math.round(nMaxOffset * (nReal - nPosSB) / nReal);
        } else {
          nOC = Math.round(nMaxOffset * nPosSB / nReal);
        }
        if (nOC > nMaxOffset) {
          Log.warning("Invalid offset ");
          nOC = nMaxOffset;
        }
        var nVisCol = Math.min(oGrid.getMaxColumns() - oGrid.getFixedColumns(), oGrid.getHash().maxColumns-oGrid.getHash().minColumns +1 );
        $Grid.find(
          ".sapUiZenCommonsGridHTooltip"
        ).text(
          ResourceBundle.getText(
            "HPOS",
            [
              nOC + 1,
              nOC + nVisCol, oGrid.getVirtualColumns()
            ]
          )
        );
      }
      function scrollHandlerVsb(oGrid, $Grid) {
        if (!oGrid._bScrollV) {
          return;
        }
        delete oGrid._bScrollV;
        var nMaxOffset = oGrid.getVirtualRows() - Math.min(oGrid.getHash().maxRows + 1, oGrid.getMaxRows()) + oGrid.getFixedRows();
        var $EasyGridVsbI = $Grid.find(".sapUiZenCommonsGridVsbI");
        $EasyGridVsbI.off("mouseup");
        $EasyGridVsbI.off("mouseleave");
        $EasyGridVsbI.off("scroll");
        var nReal = $Grid.find(
          ".sapUiZenCommonsGridVsbII"
        ).height() - $EasyGridVsbI.height();
        var nPosSB = $EasyGridVsbI.scrollTop();
        var nOC = Math.round(nMaxOffset * nPosSB / nReal);
        if (oGrid.getOffsetRow() !== nOC) {
          if (nOC > nMaxOffset) {
            Log.warning("Invalid offset ");
          }
          if (Math.min(oGrid.getHash().maxRows + 1, oGrid.getMaxRows()) > oGrid.getFixedRows()) {
            adjustOffsetRow(oGrid, $Grid, Math.min(nOC, nMaxOffset));
          }
        }
        $EasyGridVsbI.on("mouseup", scrollHandlerVsb.bind(that, oGrid, $Grid));
        $EasyGridVsbI.on("mouseleave", scrollHandlerVsb.bind(that, oGrid, $Grid));
        $EasyGridVsbI.on("scroll", scrollTooltipHandlerVsb.bind(that, oGrid, $Grid));
      }
      function scrollHandlerHsb(oGrid, $Grid) {
        if (!oGrid._bScrollH) {
          return;
        }
        delete oGrid._bScrollH;
        var nMaxOffset = oGrid.getVirtualColumns() - Math.min(oGrid.getHash().maxColumns - 1, oGrid.getMaxColumns()) + oGrid.getFixedColumns();
        var $EasyGridHsbI = $Grid.find(".sapUiZenCommonsGridHsbI");
        $EasyGridHsbI.off("mouseup");
        $EasyGridHsbI.off("mouseleave");
        $EasyGridHsbI.off("scroll");
        var nReal = $Grid.find(
          ".sapUiZenCommonsGridHsbII"
        ).width() - $EasyGridHsbI.width();
        var nOC = null;
        var nPosSB = $EasyGridHsbI.scrollLeft();
        if (
          sap.ui.getCore().getConfiguration().getRTL()
        ) {
          nOC = Math.round(nMaxOffset * (nReal - nPosSB) / nReal);
        } else {
          nOC = Math.round(nMaxOffset * nPosSB / nReal);
        }
        if (oGrid.getOffsetColumn() !== nOC) {
          if (nOC > nMaxOffset) {
            Log.warning("Invalid offset ");
          }
          if (oGrid.getMaxColumns() > oGrid.getFixedColumns()) {
            adjustOffsetColumn(oGrid, $Grid, Math.min(nOC, nMaxOffset));
          }
        }
        $EasyGridHsbI.on("mouseup", scrollHandlerHsb.bind(that, oGrid, $Grid));
        $EasyGridHsbI.on("mouseleave", scrollHandlerHsb.bind(that, oGrid, $Grid));
        $EasyGridHsbI.on("scroll", scrollTooltipHandlerHsb.bind(that, oGrid, $Grid));
      }
      function adjustVsbThumbPostion(oGrid, $Grid) {
        if (!oGrid._adjustVsbThumCtr) {
          oGrid._adjustVsbThumCtr = 1;
        } else {
          return;
        }
        $Grid.find(".sapUiZenCommonsGridVsbI").scrollTop(
          calcScrollVThumbPos(oGrid, $Grid)
        );
        --oGrid._adjustVsbThumCtr;
      }
      function adjustOffsetRow(oGrid, $Grid, nOffsetRow) {
        if (isNaN(nOffsetRow)) {
          throw new Error("Invalid offsetRow:" + nOffsetRow);
        }
        oGrid.setOffsetRow(nOffsetRow);
        if (!handleRequestMoreRows(oGrid, $Grid)) {
          calcRanges(oGrid);
          that.insertContentToGrid(oGrid, $Grid);
          adjustVsbThumbPostion(oGrid, $Grid);
        }
      }
      function adjustOffsetColumn(oGrid, $Grid, nOffsetColumn, nFocusRow, nFocusColumn) {
        oGrid.setOffsetColumn(nOffsetColumn);
        if (!handleRequestMoreColumns(oGrid, $Grid, nFocusRow, nFocusColumn)) {
          calcRanges(oGrid);
          that.insertContentToGrid(oGrid, $Grid);
          adjustHsbThumbPosition(oGrid, $Grid);
        }
      }
      that.getStyle = function (sStyle) {
        return oRowStylesTd[sStyle];
      };
      that.clearButtonControls = function (oGrid) {
        _.forEach(
          oGrid.getButtonControls ? oGrid.getButtonControls() : [],
          function (o) {
            o.destroy();
          });
        return that;
      };
      that.calcButtonControls = function (oGrid) {
        var nFR = oGrid.getFixedRows();
        var nFC = oGrid.getFixedColumns();
        that.clearButtonControls(oGrid);
        var oHash = oGrid.getHash();
        var oButtonControls;
        if (oGrid.getButtonControls) {
          oButtonControls = oGrid.getButtonControls();
        } else {
          oButtonControls = {};
          oGrid.getButtonControls = _.constant(oButtonControls);
        }
        function doDrill(oEvent) {
          oEvent.preventDefault();
          oEvent.cancelBubble();
          var sAtr = jQuery(oEvent.getSource().getDomRef()).parent().parent().attr("data-grid-coord");
          var oCell = oGrid.getHash()[sAtr];
          if (!oCell) {
            Log.error("Cell: " + sAtr + " not found");
          } else {
            oGrid.fireDrill({
              cell: oCell
            });
          }
        }
        (function (sId, oBS) {
          _.forEach(
            oHash.rowRange,
            function (nR, nRI) {
              _.forEach(
                oHash.colRange,
                function (nC, nCI) {
                  if (nC < nFC || nR < nFR) {
                    var oIcon = new Icon(
                      [
                        sId,
                        "button",
                        nR,
                        nC
                      ].join("-"), oBS
                    );
                    oButtonControls[nRI + ":" + nCI] = oIcon;
                  }
                }
              );
            }
          );
        }(oGrid.getId(), {
          visible: false,
          press: doDrill
        }));
        return that;
      };
      that.clearCellControls = function (oGrid) {
        _.forEach(
          oGrid.getCellControls ? oGrid.getCellControls() : [],
          function ( o) {
            o.destroy();
          }, {}
        );
        return that;
      };
      that.ensureResisable = function (oGrid, $Grid) {
        var sId = oGrid.getId();
        _.forEach(
          $Grid.find(
            ".sapUiZenCommonsGridRow>td"
          ),
          function (o) {
            var $Elem = jQuery(o);
            var nCol = $Elem.attr("data-grid-column");
            var sAlso = ["sapUiZenCommonsGridAlsoResize", nCol, sId].join("_");
            var $Tds = $Grid.find([
              "td[data-grid-column=",
              nCol,
              "]"
            ].join(""));
            var $Divs = $Grid.find([
              "td[data-grid-column=",
              $Elem.attr("data-grid-column"),
              "]>div"
            ].join(""));
            $Divs.addClass(sAlso);
            $Elem.resizable({
              handles: "e",
              alsoResize: "." + sAlso,
              start: function () {
                oGrid.bInResize = true;
                $Tds.css("width", "");
                clearMaxMinWidth($Grid);
                $Grid.find(".sapUiZenCommonsGridVsb").css("visibility", "hidden");
                $Grid.find(".sapUiZenCommonsGridHsb").css("visibility", "hidden");
              },
              stop: function () {
                if (oGrid.getVirtualRows() > oGrid.getMaxRows()) {
                  $Grid.find(".sapUiZenCommonsGridVsb").css("visibility", "visible");
                }
                if (oGrid.getVirtualColumns() > oGrid.getMaxColumns()) {
                  $Grid.find(".sapUiZenCommonsGridVsb").css("visibility", "visible");
                }
                var nMW = _.max(_.map($Divs, function (o) {
                  return jQuery(o).width();
                }));
                storeColumnWidth(oGrid, $Grid);
                adjustMaxMinWidth($Grid);
                $Divs.width(nMW);
                storeColumnWidth(oGrid, $Grid);
                adjustMaxMinWidth($Grid);
                var nW = $Grid.find(
                  ".sapUiZenCommonsGridInnerTable"
                ).width();
                $Grid.find(
                  ".sapUiZenCommonsGridOuterTable"
                ).width(
                  nW + (
                    oGrid.getVirtualRows() > oGrid.getMaxRows() ? that.getScrollbarWidth() : 0
                  )
                );
                oGrid.bInResize = false;
                var oAnchorElement = oGrid.getParent();
                while (oAnchorElement && !(oAnchorElement instanceof sap.m.VBox)) {
                  oAnchorElement = oAnchorElement.getParent();
                }
                var $Anchor = oAnchorElement ? jQuery(oAnchorElement.getDomRef()) : jQuery(oGrid.getParent() && oGrid.getParent().getDomRef ? oGrid.getParent().getDomRef() : $Grid);
                if ($Anchor.length) {
                  that.doResize(oGrid, $Grid, {
                    width: $Anchor.width(),
                    height: $Anchor.height()
                  });
                }
                adjustHSB(oGrid, $Grid);
              }
            });
          }
        );
      };
      that.doResize = function (oGrid, $Grid, oParam) {
        if (!getVis(oGrid)) {
          return false;
        }
        if (!$Grid.length) {
          return false;
        }
        var $FR = $Grid.find(".sapUiZenCommonsGridFirstRow");
        if (!$FR.length) {
          Log.error("FirstRow not found");
          return false;
        }
        var nHeight = $FR.height();
        var nhh = oParam.height - 60;
        var nR = Utilities.trunc(nhh / nHeight);
        nR = Math.min(nR, oGrid.getVirtualRows() + oGrid.getFixedRows());
        if (
          nR > oGrid.getFixedRows() &&
            oGrid.getMaxRows() !== nR
        ) {
          oGrid.setMaxRows(nR);
          var nDRVis = oGrid.getMaxRows() - oGrid.getFixedRows();
          if (oGrid.getOffsetRow() + nDRVis > oGrid.getVirtualRows()) {
            adjustOffsetRow(oGrid, $Grid, oGrid.getVirtualRows() - nDRVis);
          }
        }
        var nwh = oParam.width;
        var nFAWidth = nwh - 2 * that.getScrollbarWidth();
        if (nFAWidth) {
          var o = _.reduce(
            _.range($FR.children().length),
            function (oRes, n) {
              var $Col = getColumn($Grid, n);
              if (oRes.end) {
                return oRes;
              } else {
                oRes.consumedWidth += $Col.outerWidth();
                oRes.mw.push($Col.outerWidth());
                if (oRes.consumedWidth < nFAWidth - 5) {
                  oRes.cols++;
                } else {
                  oRes.end = true;
                }
                return oRes;
              }
            }, {
              cols: 0,
              end: false,
              mw: [],
              consumedWidth: 0
            }
          );
          o.mw = oGrid._ColumnWidth2 && oGrid._ColumnWidth2[o.cols - 1] ? oGrid._ColumnWidth2[o.cols - 1] + 40 : 150;
          if (
            !o.end && o.consumedWidth
          ) {
            if (nFAWidth > o.consumedWidth + o.mw && oGrid._ColumnWidth2.length <= o.cols) {
              o.cols = o.cols + Math.ceil((nFAWidth - o.consumedWidth) / o.mw);
            } else if (nFAWidth > o.consumedWidth) {
              while (oGrid._ColumnWidth2.length > o.cols && nFAWidth > o.consumedWidth + oGrid._ColumnWidth2[o.cols]) {
                o.consumedWidth += oGrid._ColumnWidth2[o.cols];
                ++o.cols;
              }
            }
          }
          var nVisCol = Math.min(oGrid.getMaxColumns() - oGrid.getFixedColumns(), oGrid.getHash().maxColumns-oGrid.getHash().minColumns +1 );
          var nC = Math.min(o.cols, Math.min(oGrid.getVirtualColumns(),oGrid.getColumnLimit()) + oGrid.getFixedColumns());
          if (oGrid._maxFailedCol && nC >= o._maxFailedCol) {
            --nC;
          } else if ($Grid.width() < $FR.width() + 2 * that.getScrollbarWidth()) {
            if (oGrid._maxFailedCol) {
              oGrid._maxFailedCol = Math.min(oGrid._maxFailedCol, oGrid.getMaxColumns());
              nC = Math.min(nC, oGrid._maxFailedCol - 1);
            } else {
              oGrid._maxFailedCol = oGrid.getMaxColumns();
              nC = Math.min(nC, oGrid._maxFailedCol - 1);
            }
            if (nC >= oGrid._maxFailedCol) {
              nC = oGrid._maxFailedCol - 1;
            }
          }
          if (oGrid._maxFailedCol && nC >= oGrid._maxFailedCol) {
            nC = oGrid._maxFailedCol - 1;
          }
          if (nC && nC >= oGrid.getFixedColumns() && oGrid.getMaxColumns() !== nC) {
            Log.info("Set mc: " + nC);
            if (oGrid.getMaxColumns() > nC) {
              if (!oGrid._maxFailedCol || oGrid._maxFailedCol > oGrid.getMaxColumns()) {
                oGrid._maxFailedCol = oGrid.getMaxColumns();
              }
            }
            oGrid.setMaxColumns(nC);
            var nDCVis = oGrid.getMaxColumns() - oGrid.getFixedColumns();
            if (oGrid.getOffsetColumn() + nDCVis > oGrid.getVirtualColumns()) {
              adjustOffsetColumn(oGrid, $Grid, oGrid.getVirtualColumns() - nDCVis);
            }
          }
        }
        var sSVD = oGrid.getMaxColumns() - oGrid.getFixedColumns() >= oGrid.getVirtualColumns() ? "hidden" : "visible";
        $Grid.find(".sapUiZenCommonsGridHsb").css("visibility", sSVD);
        var sHV = oGrid.getMaxRows() - oGrid.getFixedRows() > oGrid.getVirtualRows() ? "hidden" : "visible";
        $Grid.find(".sapUiZenCommonsGridVsb").css("visibility", sHV);
        return true;
      };
      that.calcCellControls = function (oGrid) {
        function cmHandle(oEvent) {
          oGrid.fireRightClick({
            cell: sap.ui.getCore().byId(oEvent.getSource().data()["data-cmid"]),
            link: oEvent.getSource()
          });
        }
        var oCellControls;
        if (oGrid.getCellControls) {
          oCellControls = oGrid.getCellControls();
        } else {
          oCellControls = {};
          oGrid.getCellControls = _.constant(oCellControls);
        }
        that.clearCellControls(oGrid);
        var oHash = oGrid.getHash();
        _.forEach(
          oHash.rowRange,
          function (nR, nRI) {
            _.forEach(
              oHash.colRange,
              function (nC, nCI) {
                var sAcc = [nR + ":" + nC];
                var sAccI = [nRI + ":" + nCI];
                if (oGrid.getInput() && oGrid.getFixedColumns() <= nC && oGrid.getFixedRows() <= nR) {
                  oCellControls[sAccI] = new Input({
                    valueState: sap.ui.core.ValueState.None,
                    width: "95%"
                  });
                  oCellControls[sAccI].attachChange(
                    function (oEvent) {
                      var oC = oGrid.getHash()[sAcc];
                      if (oC) {
                        oC.setDisplayValue(oEvent.getParameter("value"));
                      } else {
                        Log.error("No cell found at:" + nR + ":" + nC);
                      }
                    }
                  );
                } else {
                  oCellControls[sAccI] = new Link({
                    subtle: true,
                    width: "100%",
                    wrapping: false,
                  });
                  oCellControls[sAccI].onAfterRendering = function(){
                    if(this.getText()===""){
                      jQuery(this.getDomRef()).attr("tabindex",0);
                    }
                  };
                  oCellControls[sAccI].attachPress(cmHandle);
                }
                oCellControls[sAccI].addStyleClass("sapUiZenCommonsGridDown").addStyleClass("sapUiZenCommonsGridSelect");
              }
            );
          }
        );
        return that;
      };
      that.calcHash = function (oGrid) {
        oGrid.getHash = _.constant(
          oGrid.getCells().length ? oGrid.getCells().reduce(
            function (oCurrent, oCell) {
              var nColumn = oCell.getColumn();
              var nRow = oCell.getRow();
              if (isNaN(nColumn) || isNaN(nRow)) {
                return oCurrent;
              }
              var sAcc = nRow + ":" + nColumn;
              oCurrent[sAcc] = oCell;
              return oCurrent;
            }, {
              maxRows: _.max(_.map(oGrid.getCells(), function (o) {
                return o.getRow();
              })),
              maxColumns: _.max(_.map(oGrid.getCells(), function (o) {
                return o.getColumn();
              })),
              maxDisplayLevel: _.max(_.map(oGrid.getCells(), function (o) {
                return o.getDisplayLevel();
              })),
              minRows: _.min(_.filter(_.map(oGrid.getCells(), function (o) {
                return o.getRow();
              }), function (n) {
                return n >= oGrid.getFixedRows();
              })),
              minColumns: _.min(_.filter(_.map(oGrid.getCells(), function (o) {
                return o.getColumn();
              }), function (n) {
                return n >= oGrid.getFixedColumns();
              }))
            }
          ) : {
            maxRows: -1,
            maxColumns: -1,
            minRows: -1,
            minColumns: -1,
            maxDisplayLevel: 0
          }
        );
        calcRanges(oGrid);
        return that;
      };
      function createVB(oGrid, $Grid) {
        if ($Grid.find(
          ".sapUiZenCommonsGridOuterCell12"
        ).children().length === 0) {
          $Grid.find(
            ".sapUiZenCommonsGridOuterCell12"
          ).append(
            [
              "<table><tbody><tr><td><div class=\"sapUiZenCommonsGridVsbIHeaderRow\"></div></td></tr><tr><td><div id=\"",
              oGrid.getId(),
              "-oGrid\" class=\"sapUiZenCommonsGridVsb\"><div id=\"",
              oGrid.getId(),
              "-vsb-i\" class=\"sapUiZenCommonsGridVsbI\"><span class=\"sapUiZenCommonsGridVTooltip\"></span><div id=\"",
              oGrid.getId(),
              "-vsb-ii\" class=\"sapUiZenCommonsGridVsbII\" ></div></div></td></tr></tbody></table>"
            ].join("")
          );
        }
        var nFRH = _.reduce($Grid.find(".sapUiZenCommonsGridFixedRow"), function (nSum, oEl) {
          return nSum + jQuery(oEl).height();
        }, 0);
        var nTableHeight = $Grid.find(
          ".sapUiZenCommonsGridInnerTable"
        ).height();
        $Grid.find(
          ".sapUiZenCommonsGridVsbII"
        ).height((nTableHeight - nFRH) * oGrid.getVirtualRows() / Math.max(1, oGrid.getMaxRows() - oGrid.getFixedRows()));
        $Grid.find(".sapUiZenCommonsGridVsbIHeaderRow").height(nFRH);
      }
      function handleRequestMoreRows(oGrid, $Grid) {
        if (!getBusy(oGrid) && (
          oGrid.getMaxRows() - oGrid.getFixedRows() + oGrid.getOffsetRow() > oGrid.getHash().maxRows ||
            oGrid.getMaxRows() - oGrid.getFixedRows() + oGrid.getOffsetRow() < oGrid.getHash().minRows
        )) {
          $Grid.off("mousewheel").off("mouseup").off("mouseleave");
          $Grid.find(".sapUiZenCommonsGridVsbI").off("scroll");
          oGrid.fireRequestMoreRows({
            currentRow: oGrid.getOffsetRow()
          });
          return true;
        }
        return false;
      }
      function handleRequestMoreColumns(oGrid, $Grid, nFocusRow, nFocusColumn) {
        if (!getBusy(oGrid) && (
          (
            oGrid.getMaxColumns() - oGrid.getFixedColumns() + oGrid.getOffsetColumn() > oGrid.getHash().maxColumns +1
          ) || (
            oGrid.getOffsetColumn() <  oGrid.getHash().minColumns +1
          )
        )) {
          $Grid.off("mousewheel").off("mouseup").off("mouseleave");
          oGrid._nFocusRow = nFocusRow;
          oGrid._nFocusColumn = nFocusColumn;
          oGrid.fireRequestMoreColumns({
            currentColumn: oGrid.getOffsetColumn()
          });
          return true;
        }
        return false;
      }
      function handleWheelColumns(oGrid, $Grid, wheelDelta) {
        var bRTL = sap.ui.getCore().getConfiguration().getRTL();
        var nOffsetColumn = oGrid.getOffsetColumn();
        if (
          wheelDelta < 0 && !bRTL ||
            wheelDelta > 0 && bRTL
        ) {
          if (!bRTL) {
            nOffsetColumn++;
            if (
              nOffsetColumn > oGrid.getVirtualColumns() +
                oGrid.getFixedColumns() - oGrid.getMaxColumns()
            ) {
              nOffsetColumn = oGrid.getVirtualColumns() + oGrid.getFixedColumns() - oGrid.getMaxColumns();
            }
          } else {
            nOffsetColumn--;
            if (nOffsetColumn < 0) {
              nOffsetColumn = 0;
            }
          }
        } else {
          if (bRTL) {
            nOffsetColumn++;
            if (
              nOffsetColumn > oGrid.getVirtualColumns() +
                oGrid.getFixedColumns() -
                oGrid.getMaxColumns()
            ) {
              nOffsetColumn =  oGrid.getVirtualColumns() + oGrid.getFixedColumns() - oGrid.getMaxColumns();
            }
          } else {
            nOffsetColumn--;
            if (nOffsetColumn < 0) {
              nOffsetColumn = 0;
            }
          }
        }
        adjustOffsetColumn(oGrid, $Grid, nOffsetColumn);
      }
      function handleWheelRows(oGrid, $Grid, wheelDelta) {
        var nOffsetRow = oGrid.getOffsetRow();
        if (
          wheelDelta < 0
        ) {
          nOffsetRow++;
          if (
            nOffsetRow > oGrid.getVirtualRows() + oGrid.getFixedRows() - oGrid.getMaxRows()
          ) {
            nOffsetRow = oGrid.getVirtualRows() + oGrid.getFixedRows() - oGrid.getMaxRows();
          }
        } else {
          nOffsetRow--;
          if (nOffsetRow < 0) {
            nOffsetRow = 0;
          }
        }
        if (nOffsetRow !== oGrid.getOffsetRow()) {
          adjustOffsetRow(oGrid, $Grid, nOffsetRow);
        }
      }
      function adjustHsbThumbPosition(oGrid, $Grid) {
        var $EasyGridHsbI = $Grid.find(".sapUiZenCommonsGridHsbI");
        $EasyGridHsbI.off("scroll");
        $EasyGridHsbI.scrollLeft(
          calcScrollHThumbPos(oGrid, $Grid)
        );
        delete oGrid._bScrollH;
        if ($EasyGridHsbI && $EasyGridHsbI.length) {
          $EasyGridHsbI.on("mouseup", scrollHandlerHsb.bind(that, oGrid, $Grid));
          $EasyGridHsbI.on("mouseleave", scrollHandlerHsb.bind(that, oGrid, $Grid));
          $EasyGridHsbI.on("scroll", scrollTooltipHandlerHsb.bind(that, oGrid, $Grid));
        }
      }
      function adjustHSB(oGrid, $Grid) {
        var nFixColCount = Math.min(oGrid.getMaxColumns(), oGrid.getFixedColumns());
        var nFixColWidth = _.sum(_.map(
          _.filter(
            $Grid.find(".sapUiZenCommonsGridFirstRow").find(
              ".sapUiZenCommonsGridFixCol"
            ),
            function (o, n) {
              return n < nFixColCount;
            }
          ),
          function (o) {
            return jQuery(o).width();
          }
        )) + 4 * nFixColCount;
        $Grid.find(
          ".sapUiZenCommonsGridHsbHTdDiv"
        ).width(
          nFixColWidth
        );
        $Grid.find(
          ".sapUiZenCommonsGridHsbI"
        ).width(
          $Grid.find(".sapUiZenCommonsGridFirstRow").width() - nFixColWidth
        );
        var nTableWidth = $Grid.find(
          ".sapUiZenCommonsGridHsbI"
        ).width();
        var nVisCol = Math.min(oGrid.getMaxColumns() - oGrid.getFixedColumns(), oGrid.getHash().maxColumns-oGrid.getHash().minColumns +1 );
        var n = nTableWidth * oGrid.getVirtualColumns() / Math.max(1, nVisCol);
        $Grid.find(
          ".sapUiZenCommonsGridHsbII"
        ).width(
          n
        );
        adjustHsbThumbPosition(oGrid, $Grid);
      }
      that.adjustHsbThumbPosition = adjustHsbThumbPosition;
      that.adjustVsbThumbPosition = adjustVsbThumbPostion;
      that.prepareOuterTableForResize = function (oGrid, $Grid) {
        oGrid.getVirtualRows() > oGrid.getMaxRows() - oGrid.getFixedRows() ? createVB(oGrid, $Grid): removeVsb(oGrid, $Grid);
        var nFRH = _.reduce($Grid.find(".sapUiZenCommonsGridFixedRow"), function (nSum, oEl) {
          return nSum + jQuery(oEl).height();
        }, 0);
        var nW = $Grid.find(
          ".sapUiZenCommonsGridInnerTable"
        ).outerWidth();
        $Grid.find(
          ".sapUiZenCommonsGridOuterTable"
        ).width(
          nW + that.getScrollbarWidth()
        );
        $Grid.find(
          ".sapUiZenCommonsGridVsbI"
        ).height(
          $Grid.find(
            ".sapUiZenCommonsGridInnerTable"
          ).height() - nFRH
        );
        $Grid.find(
          ".sapUiZenCommonsGridOuterCell11"
        ).width($Grid.find(".sapUiZenCommonsGridFirstRow").width());
        adjustHSB(oGrid, $Grid);
        var nHSBH = Math.max($Grid.find(
          ".sapUiZenCommonsGridHsbII"
        ).width(), 1);
        var nVSBH = $Grid.find(
          ".sapUiZenCommonsGridVsbII"
        ).height();
        var $EasyGridVsbI = null;
        $Grid.on(
          "mousewheel",
          function (oEvent) {
            if (oEvent.ctrlKey) {
              return;
            }
            if (oGrid.getMaxRows() - oGrid.getFixedRows() < oGrid.getVirtualRows()) {
              handleWheelRows(
                oGrid,
                $Grid,
                oEvent.originalEvent.wheelDelta,
                nVSBH
              );
            } else if (oGrid.getMaxColumns() - oGrid.getFixedColumns() < oGrid.getVirtualColumns()) {
              handleWheelColumns(oGrid, $Grid, oEvent.originalEvent.wheelDelta, nHSBH);
            } else {
              return;
            }
            oEvent.preventDefault();
          }
        );
        $EasyGridVsbI = $Grid.find(".sapUiZenCommonsGridVsbI");
        if ($EasyGridVsbI && $EasyGridVsbI.length) {
          $EasyGridVsbI.on("mouseup", scrollHandlerVsb.bind(that, oGrid, $Grid));
          $EasyGridVsbI.on("mouseleave", scrollHandlerVsb.bind(that, oGrid, $Grid));
          $EasyGridVsbI.on("scroll", scrollTooltipHandlerVsb.bind(that, oGrid, $Grid));
        }
      };
      that.insertContentToGrid = function (oGrid, $Grid) {
        if (getBusy(oGrid)) {
          return;
        }
        var oHash = oGrid.getHash();
        var oCellControls = oGrid.getCellControls();
        var oButtonControls = oGrid.getButtonControls();
        if (!oGrid._kdSet) {
          $Grid.on("keydown",function (oEvent) {
            delete oGrid._nFocusColumn;
            delete oGrid._nFocusRow;
            var $Elem = jQuery(oEvent.target);
            if ($Elem.prop("tagName") !== "A") {
              return;
            }
            var $td = jQuery(oEvent.target).parent().parent();
            var nRow = parseInt($td.attr("data-grid-row"), 10);
            var nCol = parseInt($td.attr("data-grid-column"), 10);
            switch (oEvent.which) {
            case KeyCodes.Tab:
              if (oEvent.shiftKey) {
                if (nCol === oGrid.getFixedColumns() && oGrid.getOffsetRow() > 0) {
                  adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() - 1);
                  $Grid.find("td[data-grid-column=" + oGrid.getMaxColumns() + "][data-grid-row=" + nRow + "]>div>a").focus();
                  oEvent.preventDefault();
                } else if (
                  nCol === oGrid.getFixedColumns() && oGrid.getOffsetColumn() > 0
                ) {
                  adjustOffsetColumn(oGrid, $Grid, oGrid.getOffsetColumn() - 1, nRow, nCol);
                  oEvent.preventDefault();
                }
              } else {
                if ($Grid.find(".sapUiZenCommonsGridFirstRow>td").length === nCol + 1) {
                  if ( oGrid.getFixedColumns() + oGrid.getVirtualColumns() > oGrid.getOffsetColumn() +oGrid.getMaxColumns()) {
                    adjustOffsetColumn(oGrid, $Grid, oGrid.getOffsetColumn() + 1, nRow, nCol);
                    oEvent.preventDefault();
                  } else if (oGrid.getMaxRows() === nRow + 1) {
                    if (oGrid.getVirtualRows() > oGrid.getMaxRows() - oGrid.getFixedRows()) {
                      adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() + 1);
                      oEvent.preventDefault();
                      $Grid.find("td[data-grid-column=0][data-grid-row=" + nRow + "]>div>a").focus();
                    }
                  }
                } else if (
                  nCol + 1 === oGrid.getFixedColumns() && oGrid.getOffsetColumn() > 0
                ) {
                  adjustOffsetColumn(oGrid, $Grid, 0, nRow, nCol);
                }
              }
              break;
            case KeyCodes.Up:
              if (oGrid.getFixedRows() === nRow && oGrid.getOffsetRow() > 0) {
                adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() - 1);
                oEvent.preventDefault();
                return;
              } else {
                $Grid.find("td[data-grid-column=" + nCol + "][data-grid-row=" + (nRow - 1) + "]>div>a").focus();
              }
              break;
            case KeyCodes.Down:
              if (oGrid.getMaxRows() === nRow + 1 && oGrid.getOffsetRow() + oGrid.getMaxRows() - oGrid.getFixedRows() < oGrid.getVirtualRows()) {
                adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() + 1);
                return;
              } else {
                $Grid.find("td[data-grid-column=" + nCol + "][data-grid-row=" + (nRow + 1) + "]>div>a").focus();
              }
              break;
            case KeyCodes.Left:
              if (nCol === oGrid.getFixedColumns() && oGrid.getOffsetRow() > 0) {
                adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() - 1, nRow, nCol);
                $Grid.find("td[data-grid-column=" + oGrid.getMaxColumns() + "][data-grid-row=" + nRow + "]>div>a").focus();
                oEvent.preventDefault();
              } else if (
                nCol === oGrid.getFixedColumns() && oGrid.getOffsetColumn() > 0
              ) {
                adjustOffsetColumn(oGrid, $Grid, oGrid.getOffsetColumn() - 1, nRow, nCol);
                oEvent.preventDefault();
              } else {
                $Grid.find("td[data-grid-column=" + (nCol - 1) + "][data-grid-row=" + nRow + "]>div>a").focus();
              }
              break;
            case KeyCodes.Right:
              if (oGrid.getMaxColumns() === nCol + 1) {
                if (oGrid.getOffsetColumn() < oGrid.getVirtualColumns() - oGrid.getMaxColumns() + oGrid.getFixedColumns()) {
                  adjustOffsetColumn(oGrid, $Grid, oGrid.getOffsetColumn() + 1, nRow, nCol);
                  oEvent.preventDefault();
                  $Grid.find("td[data-grid-column=0][data-grid-row=" + nRow + "]>div>a").focus();
                } else if (oGrid.getMaxRows() === nRow + 1) {
                  if (oGrid.getVirtualRows() > oGrid.getMaxRows() - oGrid.getFixedRows()) {
                    adjustOffsetRow(oGrid, $Grid, oGrid.getOffsetRow() + 1);
                    oEvent.preventDefault();
                    $Grid.find("td[data-grid-column=0][data-grid-row=" + nRow + "]>div>a").focus();
                  }
                }
              } else if (
                nCol + 1 === oGrid.getFixedColumns() && oGrid.getOffsetColumn() > 0
              ) {
                adjustOffsetColumn(oGrid, $Grid, 0, nRow, nCol);
              } else {
                $Grid.find("td[data-grid-column=" + (nCol + 1) + "][data-grid-row=" + nRow + "]>div>a").focus();
              }
              break;
            }
          });
          oGrid._kdSet = true;
        }
        function insertIcon($Td, oCell, nRI, nCI) {
          var oButton = oButtonControls[[nRI, nCI].join(":")];
          var sIcon = null;
          if (oCell) {
            sIcon = oCell.getIcon();
            $Td.attr("data-level",oCell.getDisplayLevel());
            if (oButton) {
              if(oGrid.getFormat()!==Format.BusinessStyleFormular){
                $Td.find("span").first().css(
                  "padding-left", oCell.getDisplayLevel() > 0 ? oCell.getDisplayLevel() + "em" : "");
              }
              if (oCell.getIcon()) {
                $Td.addClass("sapUiZenCommonsGridHierLevel");
              }
              if (oGrid.getFormat()!==Format.BusinessStyleFormular && sIcon) {
                if (!oButton.getVisible()) {
                  oButton.setVisible(true);
                }
                if (oButton.getSrc() !== sIcon) {
                  oButton.setSrc(sIcon);
                  oButton.setTooltip(
                    sIcon === "sap-icon://slim-arrow-down" ? ResourceBundle.getText("ARROW_DOWN") : ResourceBundle.getText("ARROW_RIGHT")
                  );
                }
              } else {
                if (oButton.getVisible()) {
                  oButton.setVisible(false);
                }
              }
              oButton.rerender();
            }
          }
        }
        /*eslint-disable complexity*/
        /*eslint-disable  max-statements */
        function insertCellContent($Td, oCell, nColumn, nRow, nCI, nRI) {
          var sAccessString = [nRI, nCI].join(":");
          var sDisplayValue = oCell ? oCell.getDisplayValue() : "";
          var sCellType = (oCell ? oCell.getCellType() : "Empty") || "Empty";
          $Td.removeClass(
            "sapUiZenCommonsGridHeaderResultCellTd"
          ).removeClass("sapUiZenCommonsGridHierLevel");
          $Td.attr("data-sap-semanticClass",null);
          insertIcon($Td, oCell, nRI, nCI);
          if (sCellType) {
            var oStyle = that.getStyle(sCellType);
            var oC = oCellControls[sAccessString];
            if (!oC) {
              Log.error("Invalid coord: " + sAccessString);
            } else {
              oC.removeStyleClass(
                "sapUiZenCommonsGridHeaderResultCellTd"
              ).addStyleClass(
                that.getStyle(sCellType).inner()
              );
              $Td.attr("data-sap-semanticClass",oCell && oCell.getSemanticClass());
            }
            $Td.addClass(
              that.getStyle(sCellType).td()
            );
          } else {
            throw new Error("Failed to find style for " + sCellType);
          }
          if (oCell) {
            $Td.attr(
              "data-help-id", oCell.getHelpId()
            );
          }
          $Td.on(
            "mouseenter",
            function () {
              oGrid.fireCellEnter({
                cell: oCell,
                element: oCellControls[sAccessString]
              });
            }
          ).on(
            "mouseleave",
            function () {
              oGrid.fireCellLeave({
                cell: oCell
              });
            }
          );
          var oCellControl = oCellControls[sAccessString];
          if (oCellControl instanceof Link) {
            oCellControl.setText(sDisplayValue);
          } else if (oCellControl instanceof Input) {
            oCellControl.setValue(
              sDisplayValue
            ).setValueState(
              oCell ? oCell.getValueState() : sap.ui.core.ValueState.None
            ).setEditable(
              oCell && oCell.getInputEnabled() || true
            );
          }
          if (oCellControl) {
            oCellControl.setTooltip(
              oCell ? oCell.getTooltip() : ""
            ).rerender();
            if ( oCell && oCellControl ) {
              var $cc = jQuery(oCellControl.getDomRef());
              var sAL = oCell.getAlertLevel();
              $cc.removeClass(
                function (index, sClassName) {
                  return sClassName.match (/sapUiCommonsZenAlert.*/);
                });
              if(sAL){
                $cc.addClass("sapUiZenCommonsGridAlertLevel" + sAL);
              }
            }
            jQuery(
              oCellControl.getDomRef()
            ).attr(
              "aria-label",
              ResourceBundle.getText("CELL_ARIA", [nRow + 1, nColumn + 1, sDisplayValue])
            );
            if (oCell) {
              oCellControl.removeAllCustomData();
              oCellControl.addCustomData(
                new CustomData({
                  key: "data-cmid",
                  value: oCell.getId()
                })
              );
            }
          }
          var $Div = $Td.find(".sapUiZenCommonsGridCellDiv");
          if (oStyle) {
            $Div.addClass(oStyle.div(nRow % 2 === 0));
          }
          $Div.css("display", "inline-block");
        }
        oHash.rowRange.forEach(
          function (nRow, nRI) {
            oHash.colRange.forEach(
              function (nColumn, nCI) {
                var sAcc = nRow + ":" + nColumn;
                insertCellContent(
                  $Grid.find(
                    "td[data-grid-coord=\"" + sAcc + "\"]"
                  ), oHash[sAcc], nColumn, nRow, nCI, nRI);
              }
            );
          }
        );
        if (oGrid._ColumnWidth2) {
          _.forEach(
            jQuery($Grid).find(
              ".sapUiZenCommonsGridFirstRow"
            ).children(),
            function (o, n) {
              var oElem = jQuery(o);
              oElem.width(oGrid._ColumnWidth2[n]);
            }
          );
        }
        jQuery(
          $Grid
        ).find(
          ".sapMInputBaseInner"
        ).addClass(
          "sapUiZenCommonsGridInput"
        );
        jQuery(
          $Grid
        ).find(
          ".sapMInputBaseContentWrapper"
        ).height(
          18
        ).addClass(
          "sapUiZenCommonsGridInput"
        );
        jQuery(
          $Grid
        ).find(
          ".sapMInput"
        ).height(
          18
        );
        var nVisCol = Math.min(oGrid.getMaxColumns() - oGrid.getFixedColumns(), oGrid.getHash().maxColumns-oGrid.getHash().minColumns +1 );
        $Grid.find(
          ".sapUiZenCommonsGridHTooltip"
        ).text(
          ResourceBundle.getText(
            "HPOS",
            [
              oGrid.getOffsetColumn() + 1, oGrid.getOffsetColumn() +nVisCol,
              oGrid.getVirtualColumns()
            ]
          )
        );
        $Grid.find(".sapUiZenCommonsGridVTooltip").text(
          ResourceBundle.getText(
            "VPOS",
            [
              oGrid.getOffsetRow() + 1,
              oGrid.getOffsetRow() + Math.min(
                oGrid.getMaxRows(),
                oGrid.getHash().maxRows + 1) - oGrid.getFixedRows(),
              oGrid.getVirtualRows()
            ]
          )
        );
      };
      function storeColumnWidth(oGrid, $Grid) {
        var $FirstRowChildren = $Grid.find(
          ".sapUiZenCommonsGridFirstRow"
        ).children();
        var aColW = _.map(_.range($FirstRowChildren.length), function (n) {
          return getColumn($Grid, n).width();
        });
        if (!oGrid._ColumnWidth2 || oGrid._ColumnWidth2.length <= aColW.length) {
          oGrid._ColumnWidth2 = aColW;
        } else {
          _.forEach(
            aColW,
            function (nValue, nIndex) {
              oGrid._ColumnWidth2[nIndex] = nValue;
            }
          );
        }
      }
      function clearMaxMinWidth($Grid) {
        var $FirstRowChildren = $Grid.find(
          ".sapUiZenCommonsGridFirstRow"
        ).children();
        _.forEach(_.range($FirstRowChildren.length), function (nIndex) {
          var $Col = $Grid.find([
            "td[data-grid-column=",
            nIndex,
            "]"
          ].join(""));
          $Col.css("max-width", "").css("min-width", "");
        });
      }
      function adjustMaxMinWidth($Grid) {
        var $FirstRowChildren = $Grid.find(
          ".sapUiZenCommonsGridFirstRow"
        ).children();
        _.forEach(_.range($FirstRowChildren.length), function (nIndex) {
          var $Col = $Grid.find([
            "td[data-grid-column=",
            nIndex,
            "]"
          ].join(""));
          $Col.css("max-width", $Col.width() + "px").css("min-width", $Col.width() + "px");
        });
      }
      that.handleColWidth = function (oGrid, $Grid, nFac) {
        var $FirstRowChildren = $Grid.find(
          ".sapUiZenCommonsGridFirstRow"
        ).children();
        if (nFac) {
          _.forEach(_.range($FirstRowChildren.length), function (nIndex) {
            setColumnWidth($Grid, nIndex, Math.round(nFac * getColumn($Grid, nIndex).width()));
          });
        }
        var aColW = _.map(_.range($FirstRowChildren.length), function (n) {
          return getColumn($Grid, n).width();
        });
        if (!oGrid._ColumnWidth2 || oGrid._ColumnWidth2.length <= aColW.length) {
          oGrid._ColumnWidth2 = aColW;
        } else {
          _.forEach(
            aColW,
            function (nValue, nIndex) {
              oGrid._ColumnWidth2[nIndex] = nValue;
            }
          );
        }
        _.forEach(oGrid._ColumnWidth2, function (nValue, nIndex) {
          setColumnWidth($Grid, nIndex, nValue);
        });
      };
    }
    return new GridUtils();
  }
);
