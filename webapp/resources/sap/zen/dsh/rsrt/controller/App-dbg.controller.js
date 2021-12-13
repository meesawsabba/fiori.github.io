/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise, document*/
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/App.controller",
  [
    "jquery.sap.global",
    "sap/ui/core/mvc/Controller",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/m/MessageToast",
    "sap/zen/dsh/utils/TokenHelper",
    "sap/zen/dsh/NavigationCommandType",
    "sap/zen/commons/thirdparty/lodash"
  ],
  /* eslint-disable max-params */
  function (
    jQuery,
    Controller,
    ErrorHandler,
    MessageToast,
    TokenHelper,
    NavigationCommandType,
    _
  )
  /* eslint-enable max-params */
  {
    "use strict";
    function dateToYMD(date) {
      if (typeof (date) !== "object") {
        throw new Error("Invalid date");
      }
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return "" + y + "-" + (m <= 9 ? "0" + m : m) + "-" + (d <= 9 ? "0" + d : d);
    }
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.App", {
        displayMessages: function (oEvent) {
          var oSrc = oEvent.getSource();
          this.getOwnerComponent().getMsg().openBy(oSrc);
        },
        onClusterPress: function () {
          this.getView().byId("ChartView").byId("Map")[
            this.getView().getModel().getProperty("/mapCluster") ? "cluster" : "uncluster"
          ]();
        },
        onVariantSave: function (oEvent) {
          var that = this;
          var sKey = oEvent.getParameter("key");
          var sName = oEvent.getParameter("name");
          var aVariants = that.getView().getModel(
            "settings"
          ).getProperty("/variants");
          var oVariant = _.find(
            aVariants,
            function (o) {
              return o.key === sKey;
            }
          );
          if (!oVariant) {
            oVariant = {
              key: sKey,
              name: sName,
              appState: that.getOwnerComponent().Utilities.serialize()
            };
            aVariants.push(oVariant);
          } else {
            oVariant.name = sName;
            oVariant.appState = that.getOwnerComponent().Utilities.serialize();
          }
          that.getView().getModel("settings").setProperty("/variants", aVariants);
          return that.getOwnerComponent().Utilities.persistPersonalization().catch(
            ErrorHandler.handleWithPopUp
          );
        },
        onVariantSet: function (oEvent) {
          var that = this;
          var sKey = oEvent.getParameter("key");
          var oVariant = _.find(
            that.getView().getModel("settings").getProperty("/variants"),
            function (o) {
              return o.key === sKey;
            }
          );
          that.getOwnerComponent().Utilities.deserialize(
            oVariant ? oVariant.appState : null
          ).then(function () {
            return that.onRefresh();
          });
        },
        onVariantManage: function (oEvent) {
          var that = this;
          var aVariants = that.getView().getModel("settings").getProperty("/variants");
          var oDelHash = _.reduce(
            oEvent.getParameter("deleted"),
            function (oDH, s) {
              oDH[s] = true;
              return oDH;
            }, {}
          );
          var oRenHash = _.reduce(
            oEvent.getParameter("renamed"),
            function (oDH, o) {
              oDH[o.key] = o.name;
              return oDH;
            }, {}
          );
          aVariants = _.filter(
            aVariants,
            function (o) {
              return !oDelHash[o.key];
            }
          );
          aVariants = _.map(
            aVariants,
            function (o) {
              if (oRenHash[o.key]) {
                o.name = oRenHash[o.key];
              }
              return o;
            }
          );
          that.getView().getModel("settings").setProperty("/variants", aVariants);
          that.getOwnerComponent().Utilities.persistPersonalization().catch(ErrorHandler.handleWithPopUp);
        },
        onFIChange: function (oEvent) {
          var oSource = oEvent.getSource();
          if (oSource.getMaxTokens() != 1) {
            var aTK = TokenHelper.stringToTokens(oEvent.getParameter("newValue"));
            _.forEach(aTK, function (oTK) {
              oSource.addToken(oTK);
            });
          } else {
            oSource.removeAllTokens();
            oSource.addToken(TokenHelper.stringToToken(oEvent.getParameter("newValue")));
          }
          oSource.setValue(null);
        },
        onDateChange: function (oEvent) {
          var oMI = oEvent.getSource().getParent().getItems()[1];
          oMI.removeAllTokens();
          var d = new Date(oEvent.getSource().getDateValue());
          oMI.addToken(TokenHelper.stringToToken(
            dateToYMD(d)
          ));
        },
        onDateRangeChange: function (oEvent) {
          var oMI = oEvent.getSource().getParent().getItems()[1];
          oMI.removeAllTokens();
          var d1 = new Date(oEvent.getSource().getDateValue());
          var d2 = new Date(oEvent.getSource().getSecondDateValue());
          oMI.addToken(TokenHelper.stringToToken(
            dateToYMD(d1) + " - " + dateToYMD(d2)
          ));
        },
        onFilterItemChanged: function () {
          return null;
        },
        onExportExcel: function () {
          function download(filename, text) {
            var sNavi = "navigator";
            if (window[sNavi].msSaveBlob) { // IE 10+
              window.navigator.msSaveBlob(new window.Blob([text]), filename);
            } else {
              var element = document.createElement("a");
              element.setAttribute(
                "href", "data:text/plain;charset=utf-8," + encodeURIComponent(text)
              );
              element.setAttribute("download", filename);
              element.style.display = "none";
              document.body.appendChild(element);
              element.click();
              document.body.removeChild(element);
            }
          }
          function exportSVG(sTitle, sSVG) {
            download(sTitle + ".svg", sSVG);
          }
          var that = this;
          var sInnerTab = that.getView().getModel().getProperty("/innerTab");
          var sChartType = that.getView().getModel().getProperty("/chartType");
          if (
            sInnerTab === "chart" && sChartType !== "map"
          ) {
            exportSVG(
              that.getView().getModel("om").getDataProvider("0").QueryTitle,
              that.getView().byId("ChartView").byId("idVizFrame").exportToSVGString()
            );
          } else {
            that.getView().setBusy(true);
            that.getView().getModel("om").exportToExcel(
              "DataDownload.xlsx"
            ).catch(
              ErrorHandler.handleWithPopUp
            ).then(function () {
              that.getView().setBusy(false);
            });
          }
        },
        onBeforeRendering: function () {
          var oUtil = this.getOwnerComponent().Utilities;
          oUtil && oUtil.adjustFilterBar();
        },
        submitVariables: function () {
          var that = this;
          var oView = this.getView();
          var oOM = oView.getModel("om");
          oView.setBusy(true);
          Promise.resolve(null).then(function () {
            oOM.clearMessages();
            _.forEach(
              oView.byId("VariableBar").getFilterGroupItems(),
              function (oFG) {
                var oMI = oFG.getControl().getItems()[1];
                var aRange = _.map(oMI.getTokens(), TokenHelper.tokenToRange);
                oOM.setVariableValue(oFG.getName(), aRange);
              }
            );
            return oView.getModel("om").submitVariables();
          }).then(function () {
            _.forEach(
              oView.byId("VariableBar").getFilterGroupItems(),
              function (oFG) {
                var oV = oOM.getProperty("/variables/" + encodeURIComponent(
                  oFG.getName()
                ));
                var oMI = oFG.getControl().getItems()[1];
                var oDP = oFG.getControl().getItems()[2];
                var oDR = oFG.getControl().getItems()[0];
                oMI.removeAllTokens();
                _.forEach(oV.MemberFilter, function (o) {
                  oMI.addToken(TokenHelper.rangeToToken(o));
                  if (oDP.getVisible()) {
                    oDP.setDateValue(TokenHelper.datsToDate(o.Low));
                  } else if (oDR.getVisible()) {
                    oDR.setDateValue(TokenHelper.datsToDate(o.Low));
                    oDR.setSecondDateValue(TokenHelper.datsToDate(o.High));
                  }
                });
              }
            );
            if (_.some(oOM.getProperty("/messages"), function (o) {
              return o.Severity === "Error";
            })) {
              that.getOwnerComponent().getMsg().openBy(that.getView().byId("msgBtn"));
            } else {
              return oOM.synchronize();
            }
            return null;
          }).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(ErrorHandler.handleWithPopUp).then(
            function () {
              oView.setBusy(false);
            }
          ).then(function () {
            if (_.some(oOM.getProperty("/messages"), function (o) {
              return o.Severity === "Error";
            })) {
              setTimeout(function () {
                that.getOwnerComponent().getMsg().openBy(that.getView().byId("msgBtn"));
              }, 150);
            }
          });
        },
        onNavStarted: function (oEvent) {
          var that = this;
          that.getView().setBusy(
            oEvent.getParameter("navigationCmdType") !== NavigationCommandType.CellClick
          );
          var oOM = that.getView().getModel("om");
          oOM.clearMessages();
          return Promise.resolve(null).then(
            oEvent.getParameter("cmd")
          ).then(
            function () {
              if (sap.ushell && sap.ushell.Container){
                sap.ushell.Container.setDirtyFlag(false);
              }
            }
          ).then(
            function () {
              if (
                _.some(
                  oOM.getProperty("/dataProvider/0/Messages"),
                  function (o) {
                    return o.type === "Error";
                  }
                )
              ) {
                that.getOwnerComponent().getMsg().openBy(that.getView().byId("msgBtn"));
              }
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            });
        },
        filterDialogBO: function (oEvent) {
          var that = this;
          var oSource = oEvent.getSource();
          var oDlg = oSource.getFilterDialogContent() ? oSource.getFilterDialogContent()[0].getParent() : null;
          that._FilterDlg = oDlg;
        },
        onResetBuffer: function () {
          var that = this;
          that.getView().setBusy(true);
          var oDP = that.getView().getModel("om").getDataProvider(
            "0"
          );
          that.getView().getModel("om").resetBuffer().then(function () {
            oDP.synchronize();
          }).then(function () {
            MessageToast.show(
              that.getView().getModel("i18n").getResourceBundle().getText("Buffer_cleared")
            );
          }).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            });
        },
        onSaveBuffer: function () {
          var that = this;
          that.getView().setBusy(true);
          var oDP = that.getView().getModel("om").getDataProvider(
            "0"
          );
          oDP.synchronize().then(
            function () {
              return that.getView().getModel("om").saveBuffer();
            }
          ).then(function () {
            return oDP.synchronize();
          }).then(function () {
            MessageToast.show(
              that.getView().getModel("i18n").getResourceBundle().getText("Buffer_saved")
            );
          }).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            });
        },
        gotoLayout: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "layout");
        },
        gotoConditions: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "conditions");
        },
        gotoExceptions: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "exceptions");
        },
        gotoChart: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "chart");
        },
        gotoData: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "data");
        },
        shareActions: function (oEvent) {
          var that = this;
          var fnGetUser = jQuery.sap.getObject("sap.ushell.Container.getUser");
          that.getView().getModel().setProperty(
            "/jamVisible", !!fnGetUser && fnGetUser().isJamActive()
          );
          var oSrc = oEvent.getSource();
          that.getOwnerComponent().getASShare().openBy(oSrc);
        },
        furtherActions: function (oEvent) {
          this.getOwnerComponent().getASFA().openBy(oEvent.getSource());
        },
        onNewLines: function () {
          var that = this;
          that.getView().byId(
            "PivotTable"
          ).createNewLines().catch(
            ErrorHandler.handleWithPopUp
          );
        },
        onSettings: function () {
          var that = this;
          that.getView().getModel(
            "om"
          ).getDataProvider(
            0
          ).openAxisDialog(
          ).then(
            function(b){
              return b&&that.getView().getModel(
                "om"
              ).getDataProvider(
                0
              ).getResultSet();
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onOpen: function () {
          var that = this;
          return that.getView().getModel("om").openQueryDialog().catch(ErrorHandler.handleWithPopUp);
        },
        onCurrencyTranslation: function () {
          var that = this;
          var oDP = that.getView().getModel("om").getDataProvider("0");
          oDP.openCurrencyTranslationDialog(
          ).then(function(b){
            return b&&oDP.getResultSet();
          }).catch(
            ErrorHandler.handleWithPopUp
          );
        },
        onRefresh: function () {
          var that = this;
          if (sap.ushell && sap.ushell.Container){
            sap.ushell.Container.setDirtyFlag(false);
          }
          that.getView().setBusy(true);
          that.getView().byId("PivotTable").invalidate();
          that.getView().getModel("om").synchronize().catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onSubmitGeoFilter: function () {
          MessageToast.show("Not implemented yet");
        },
        clearGeoFilter: function () {
          MessageToast.show("Not implemented yet");
        },
        onSetGeoFilter: function () {
          MessageToast.show("Not implemented yet");
        },
        onSetGeoFilter2: function () {
          MessageToast.show("Not implemented yet");
        },
        onSelectRegion: function () {
          MessageToast.show("Not implemented yet");
        },
        onGeoDimChange: function () {
          MessageToast.show("Not implemented yet");
        },
        onChartProperties: function () {
          var that = this;
          that.getOwnerComponent().getChartSettings().openDialog(
            that.getView().byId("ChartView").getController()
          ).then(
            function(){
              that.byId(
                "ChartView"
              ).getController().updateChart();
            }
          ).catch(ErrorHandler.handleWithPopUp);
        },
        onShowGraph: function(){
          var that = this;
          that.getOwnerComponent().getGraphDialog().openDialog();
        },
        gotoGraph: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "graph");
        },
        gotoMap: function () {
          var that = this;
          that.getView().getModel().setProperty("/innerTab", "map");
        },
        onValueHelpRequest: function (oEvent) {
          var that = this;
          var oView = this.getView();
          var oSource = oEvent.getSource();
          var oOM = oView.getModel("om");
          var oFG = _.find(
            oView.byId("VariableBar").getFilterGroupItems(),
            function (o) {
              return o.getControl().getItems()[1] == oSource;
            }
          );
          var sVariable = oFG.getName();
          oView.setBusy(true);
          Promise.resolve(null).then(
            function () {
              return oOM.openVariableSelector(
                sVariable, true
              );
            }
          ).then(function (aToken) {
            if (oSource.getMaxTokens() === 1 && aToken && aToken.length) {
              oSource.removeAllTokens();
            }
            _.forEach(aToken, function (oToken) {
              oSource.addToken(oToken);
            });
          }).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onOpenEclipse: function () {
          MessageToast.show("Not implemented yet");
        },
        onBack: function () {
          var that = this;
          that.getView().setBusy(true);
          that.getView().getModel("om").undo().catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onBackToStart: function () {
          MessageToast.show("Not implemented yet");
        },
        onVariablePrompt: function () {
          this.getView().getModel(
            "om"
          ).getDataProvider(
            0
          ).variablePrompt().catch(
            ErrorHandler.handleWithPopUp
          );
        },
        onExecuteFunction: function (oEvent) {
          var that = this;
          that.getView().setBusy(true);
          that.getView().getModel(
            "om"
          ).processService(
            oEvent.getSource().data().name
          ).then(
            function(aMessages){
              that.getView().getModel( "om" ).addMessages(aMessages);
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onCreateFunction: function () {
          var that = this;
          that.getView().getModel(
            "om"
          ).openSelectFunction().then(function (oPlaFu) {
            if (oPlaFu) {
              that.getView().getModel(
                "om"
              ).addFunction(oPlaFu.Name, oPlaFu.Text);
            }
          }).then(function () {
            return that.getOwnerComponent().Utilities.saveAppState();
          }).catch(ErrorHandler.handleWithPopUp).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onFunctionPress: function () {
          var that = this;
          if (that.getView().getModel().getProperty("/functionsVisible") === true) {
            that.getView().getModel().setProperty("/filterVisible", false);
          }
        },
        onFilterPress: function () {
          var that = this;
          if (that.getView().getModel().getProperty("/filterVisible") === true) {
            that.getView().getModel().setProperty("/functionsVisible", false);
          }
        },
        onCreateCond: function () {
          var that = this;
          that.getView().getModel(
            "om"
          ).getDataProvider(
            0
          ).openConditionDialog(
          ).then(function(b){
            return b&&that.getView().getModel(
              "om"
            ).getDataProvider(
              0
            ).getResultSet();
          }).catch(ErrorHandler.handleWithPopUp).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onCreateExcept: function () {
          var that = this;
          that.getView().getModel(
            "om"
          ).getDataProvider(
            0
          ).openExceptionDialog(
          ).then(
            function(b){
              return b&& that.getView().getModel(
                "om"
              ).getDataProvider(
                0
              ).getResultSet();
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        applyConditions: function () {
          var that = this;
          that.getView().setBusy(true);
          this.getView().getModel("om").getResultSet().catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getView().setBusy(false);
            }
          );
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.App;
  }
);
