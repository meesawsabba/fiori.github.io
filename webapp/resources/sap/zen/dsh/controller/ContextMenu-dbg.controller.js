/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/controller/ContextMenu.controller",
  [
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/HashChanger",
    "sap/m/MessageToast",
    "sap/zen/dsh/NavigationCommandType",
  ],
  function (
    jQuery,
    Controller,
    HashChanger,
    MessageToast,
    NavigationCommandType
  ) {
    "use strict";
    var oHashChanger = new HashChanger();
    Controller.extend(
      "sap.zen.dsh.controller.ContextMenu", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          oView.setBusy(true);
          oView.loaded().then(
            function () {
              that.getPivotTable = function () {
                return oView.getPivot();
              };
              oView.setBusy(false);
            }
          );
        },
        onAfterRendering: function () {
          this.getView().getModel("cm").getProperty("/sortTooltip") &&
            jQuery(this.getView().getDomRef()).find("#theContextMenu--nli11").find(">div").attr(
              "title", this.getView().getModel("cm").getProperty("/sortTooltip")
            );
        },
        toRows: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).toRows(
                that.getView().getModel("cm").getProperty("/Dimension")
              ).getResultSet();
            }
          });
        },
        toColumns: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).toColumns(
                that.getView().getModel("cm").getProperty("/Dimension")
              ).getResultSet();
            }
          });
        },
        exchange: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().data();
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).exchange(
                that.getView().getModel("cm").getProperty("/Dimension"), oData.dimension
              ).getResultSet();
            }
          });
        },
        openCharDlg: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd(
            {
              navigationCmdType: NavigationCommandType.ContextMenuCmd,
              cmd: function () {
                var oDP = that.getView().getModel("om").getDataProvider(
                  that.getPivotTable().getDataProviderName()
                );
                return oDP.openDimDialog(
                  that.getView().getModel("cm").getProperty("/Dimension")
                ).then(
                  function(b){
                    return b?oDP.getResultSet():oDP;
                  }
                );
              }
            }
          );
        },
        openKeyfigureDlg: function () {
          var that = this;
          var sDimName = that.getView().getModel("cm").getProperty("/Dimension");
          var sMember = that.getView().getModel("cm").getProperty("/Member");
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              var oDP = that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              );
              return oDP.openCellDialog(
                sDimName, sMember
              ).then(function(b){
                return b? oDP.getResultSet():oDP;
              });
            }
          });
        },
        openRRI: function (oEvent) {
          var oHashChanger = new HashChanger();
          oHashChanger.setHash(oEvent.getParameter("item").data().hash);
        },
        sortAsc: function () {
          var that = this;
          var oOM = that.getView().getModel("om");
          var sDimName = that.getView().getModel("cm").getProperty("/Dimension");
          var sMember = that.getView().getModel("cm").getProperty("/Member");
          var oDP = oOM.getDataProvider(that.getPivotTable().getDataProviderName());
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              oDP.sort(sDimName, sap.zen.dsh.SortDirection.ASCENDING,null, sMember);
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).getResultSet();
            }
          });
        },
        sortDesc: function () {
          var that = this;
          var sDimName = that.getView().getModel("cm").getProperty("/Dimension");
          var sMember = that.getView().getModel("cm").getProperty("/Member");
          var oDP = that.getView().getModel("om").getDataProvider(that.getPivotTable().getDataProviderName());
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              oDP.sort(sDimName, sap.zen.dsh.SortDirection.DESCENDING, null, sMember);
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).getResultSet();
            }
          });
        },
        displayAttributes: function () {
          MessageToast.show("not yet implemented");
        },
        removeDrilldown: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).removeDrilldown(that.getView().getModel("cm").getProperty("/Dimension"));
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).getResultSet();
            }
          });
        },
        collapseAll: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              MessageToast.show("not yet implemented");
            }
          });
        },
        drilldown: function (oEvent) {
          var that = this;
          var oCM = this.getView().getModel("cm");
          var oDP = this.getView().getModel("om").getDataProvider(that.getPivotTable().getDataProviderName());
          var oData = oEvent.getSource().data();
          this.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              oDP.drilldown(oCM.getProperty("/Dimension"), oData.dimension);
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).getResultSet();
            }
          });
        },
        createSelection: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).openCreateRestrictionDialog(
                that.getView().getModel("cm").getProperty("/Dimension"),
                that.getView().getModel("cm").getProperty("/Member")
              ).then(function(b){
                return b&& that.getView().getModel("om").getDataProvider(
                  that.getPivotTable().getDataProviderName()
                ).getResultSet();
              });
            }
          });
        },
        createFormular: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).openCreateFormulaDialog(
                that.getView().getModel("cm").getProperty("/Dimension"),
                that.getView().getModel("cm").getProperty("/Member")
              ).then(function(b){
                return b&&that.getView().getModel("om").getDataProvider(
                  that.getPivotTable().getDataProviderName()
                ).getResultSet();
              });
            }
          });
        },
        search: function () {
          var that = this;
          var oCM = that.getView().getModel("cm");
          var sMember = oCM.getProperty("/Member");
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              oHashChanger.setHash(
                "Action-search&/top=10&filter=" +
                  "{\"dataSource\":{\"type\":\"Category\",\"id\":\"All\",\"label\":\"All\",\"labelPlural\":\"All\"},\"searchTerm\":\"" +
                  sMember +
                  "\",\"rootCondition\":{\"type\":\"Complex\",\"operator\":\"And\",\"conditions\":[]}}"
              );
              return Promise.resolve(null);
            }
          });
        },
        keepFilterValue: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              var sDimName = that.getView().getModel("cm").getProperty("/Dimension");
              var sMember = that.getView().getModel("cm").getProperty("/Member");
              //that.getPivotTable().getEasyGrid().invalidateColumnWidth();
              that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).setFilter(
                sDimName, sMember
              ).getResultSet().then(function (oRes) {
                that.getPivotTable().getEasyGrid().clearOffset();
                return oRes;
              });
            }
          });
        },
        removeFilterValue: function () {
          var that = this;
          this.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              //that.getPivotTable().getEasyGrid().invalidateColumnWidth();
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).removeFilter(
                that.getView().getModel("cm").getProperty("/Dimension")
              ).getResultSet();
            }
          });
        },
        filterAndDrillDown: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().data();
          this.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              //that.getPivotTable().getEasyGrid().invalidateColumnWidth();
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).filterAndDrillDown(
                that.getView().getModel("cm").getProperty("/Dimension"),
                that.getView().getModel("cm").getProperty("/Member"),
                oData.dimension
              ).getResultSet();
            }
          });
        },
        toggle: function (oEvent) {
          var o = oEvent.getSource();
          if (o.getExpanded()) {
            o.collapse();
          } else {
            o.expand();
          }
        },
        displayElement: function () {
          MessageToast.show("Not yet implemented");
        },
        selectFilterValue: function () {
          var that = this;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).openSelector(
                that.getView().getModel("cm").getProperty("/Dimension")
              ).then(function(b){
                return b&&that.getView().getModel("om").getDataProvider(
                  that.getPivotTable().getDataProviderName()
                ).getResultSet();
              });
            }
          });
        },
        openSelectorFor: function (oEvent) {
          var that = this;
          var sDim = oEvent.getSource().data().dimension;
          that.getPivotTable().fireNavigationCmd({
            navigationCmdType: NavigationCommandType.ContextMenuCmd,
            cmd: function () {
              return that.getView().getModel("om").getDataProvider(
                that.getPivotTable().getDataProviderName()
              ).openSelector(
                sDim
              ).then(function(b){
                return b&that.getView().getModel("om").getDataProvider(
                  that.getPivotTable().getDataProviderName()
                ).getResultSet();
              });
            }
          });
          return sap.zen.dsh.controller.ContextMenu;
        }
      }
    );
  }
);
