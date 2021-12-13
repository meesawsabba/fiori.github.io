/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/zen/dsh/controller/Pivot.controller",
  [
    "sap/zen/dsh/utils/Utilities",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/ui/core/mvc/Controller",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/zen/dsh/NavigationCmdType",
    "sap/zen/dsh/DimensionType",
    "sap/zen/dsh/CellValueType",
    "sap/zen/commons/CellType",
    "sap/zen/dsh/Axis",
    "sap/zen/dsh/SortType",
    "sap/zen/dsh/SortDirection"
  ],
  /*eslint-disable max-params*/
  function (
    Utilities,
    ResourceBundle,
    Controller,
    ErrorHandler,
    NavigationCmdType,
    DimensionType,
    CellValueType,
    CellType,
    Axis,
    SortType,
    SortDirection
  ) /*eslint-enable max-params*/ {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.controller.Pivot", {

        onAfterRendering: function() {
          var that = this;
          var oView = that.getView();
          oView.getModel("om").attachRequestSent (
            function(oDP) {
              if(that.getPivot().getDataProviderName() == oDP.getParameter("infoObject")) {
                that.getPivot().getEasyGrid().setBusyIndicatorDelay(0);
                that.getPivot().getEasyGrid().setBusy(true);
              }
            }
          );

          oView.getModel("om").attachRequestCompleted (
            function() {
              var oEasyGrid = that.getPivot().getEasyGrid();
              oEasyGrid.setBusy(false);
            }
          );

          oView.getModel("om").attachRequestFailed (
            function() {
              var oEasyGrid = that.getPivot().getEasyGrid();
              oEasyGrid.setBusy(false);
            }
          );
        },

        requestRows: function (oEvent) {
          var that = this;
          var oOM = that.getView().getModel("om");
          var oDP = oOM.getDataProvider(that.getPivot().getDataProviderName());
          var nOffset = oEvent.getParameter("currentRow");
          if (oDP && nOffset !== oDP.virtualOffsetRow) {
            that.getPivot().fireNavigationCmd(
              {
                navigationCmdType: NavigationCmdType.RowRequest,
                cmd: function () {
                  that.getPivot().getEasyGrid().setBusy(false);
                  return oDP.setOffsetRow(
                    nOffset
                  ).synchronize(
                    true
                  );
                }
              }
            );
          }
        },
        onExit: function () {
          var that = this;
          that.getView().removeAllDependents();
        },
        requestColumns: function (oEvent) {
          var that = this;
          var oOM = that.getView().getModel(
            "om"
          );
          var oDP = oOM.getDataProvider(that.getPivot().getDataProviderName());
          var nOffset = oEvent.getParameter("currentColumn");
          that.getPivot().fireNavigationCmd({
            navigationCmdType: sap.zen.dsh.NavigationCmdType.ColumnRequest,
            cmd: function () {
              that.getPivot().getEasyGrid().setBusy(false);
              return oDP.setOffsetCol(
                nOffset
              ).synchronize(true);
            }
          });
        },
        onDrill: function (oEvent) {
          var oCell = oEvent.getParameter("cell");
          var bKeepOffset = oEvent.getParameter("keepOffset");
          var oDP = this.getView().getModel(
            "om"
          ).getDataProvider(this.getPivot().getDataProviderName());
          function doDrill() {
            return Promise.resolve(null).then(function () {
              return oDP.drill(oCell.data("cellDimension"), oCell.data("tupleIndex"), bKeepOffset);
            });
          }
          this.getPivot().fireNavigationCmd({
            navigationCmdType: NavigationCmdType.HierarchyNavigation,
            cmd: doDrill,
            cell: oCell
          });
        },
        onRightClick: function (oEvent) {
          var that = this;
          var oCell = oEvent.getParameter("cell");
          var sDimName = oCell.data("cellDimension");
          var sMember;
          var sSortOrder;
          var sSortIcon = null;
          var sSortTooltip = null;
          var oView = that.getView();
          var oOM = oView.getModel("om");
          var oLink = oEvent.getParameter("link");
          var oDim = oOM.getDataProvider(that.getPivot().getDataProviderName()).Dimensions[sDimName];
          var oSel = null;
          if (oDim) {
            if (oDim.Axis === Axis.Rows) {
              oSel = oOM.getDataProvider(
                that.getPivot().getDataProviderName()
              ).getRowSelection(oCell.data("tupleIndex"));
            } else if (oDim.Axis === Axis.Columns) {
              oSel = oOM.getDataProvider(that.getPivot().getDataProviderName()).getColumnSelection(oCell.data("tupleIndex"));
            }
          } else if (oCell.getCellType() === CellType.STANDARD || oCell.getCellType() === CellType.RESULT) {
            oSel = oOM.getDataProvider(that.getPivot().getDataProviderName()).getSelection(oCell.data("dataRow"), oCell.data("dataColumn"));
          }
          function doCM(){
            return Promise.resolve(
              oCell.data().dataRow === null || oCell.data().dataColumn === null ? [] :
                that.getView().getModel("om").getDataProvider(
                  that.getPivot().getDataProviderName()
                ).getRRITargets(oCell.data().dataRow, oCell.data().dataColumn)
            ).then(
              function (aRRI) {
                var aFreeDim = oOM.getDataProvider(
                  that.getPivot().getDataProviderName()
                ).FreeDimensions;
                if (sDimName) {
                  sSortOrder = null;
                  if (
                    oCell.getCellType() === CellType.RESULT ||
                      oCell.getCellType() === CellType.STANDARD
                  ) {
                    sMember = null;
                  } else {
                    sMember = oCell.data("cellMember");
                  }
                  if (!oDim.IsStructure) {
                    if (oDim.SortDirection === SortDirection.DESCENDING) {
                      sSortIcon = "sap-icon://sort-descending";
                      sSortTooltip = ResourceBundle.getText("DESCENDING");
                    } else if (
                      oDim.SortDirection === SortDirection.ASCENDING
                    ) {
                      sSortIcon = "sap-icon://sort-ascending";
                      sSortTooltip = ResourceBundle.getText("ASCENDING");
                    }
                  }
                  var bHasSelCandidate = false;
                  var bHasDrill = oDim.HierarchyActive;
                  oView.getModel("cm").setData({
                    Dimension: oDim.Name,
                    axis: oDim.Axis,
                    isDataCell: oCell.data("dataRow") > -1,
                    Member: sMember,
                    hasDrill: bHasDrill,
                    isDynMember: false,
                    IsStructure: oDim.IsStructure,
                    IsKeyFigureStructure: oDim.Type === DimensionType.MeasureDimension,
                    hasSelCandidate: bHasSelCandidate,
                    sortOrder: sSortOrder,
                    sortIcon: sSortIcon,
                    sortTooltip: sSortTooltip,
                    sortType: oCell.data("cellValueType") === CellValueType.Text ? SortType.MemberText : SortType.MemberKey,
                    hierarchyActive: oDim.HierarchyActive,
                    hasFilter: oDim.HasFilter,
                    rri: aRRI,
                    FreeDimensions: aFreeDim,
                    dataCell: oCell.data("dataCell"),
                    hasMember: !!sMember
                  });
                } else {
                  oView.getModel("cm").setData({
                    row: oCell.data("dataRow"),
                    column: oCell.data("dataColumn"),
                    isDataCell: oCell.data("dataRow") > -1,
                    dataCell: oCell.data("dataCell"),
                    Dimension: false,
                    FreeDimensions: aFreeDim,
                    Member: false,
                    rri: aRRI,
                    IsStructure: false
                  });
                }
                return Utilities.getDialogs();
              }
            ).then(
              function (oDialogs) {
                return oDialogs.ContextMenu.open(
                  oLink,
                  that.getPivot(),
                  oView.getModel("cm"),
                  oView.getModel("om")
                );
              }
            ).catch(
              ErrorHandler.handleWithPopUp
            );
          }
          that.getPivot().fireNavigationCmd({
            cmd: doCM,
            anchor: oLink,
            cell: oCell,
            selection: oSel,
            navigationCmdType: NavigationCmdType.CellClick
          });
          return;
        }
      }
    );
    return sap.zen.dsh.controller.Pivot;
  }
);
