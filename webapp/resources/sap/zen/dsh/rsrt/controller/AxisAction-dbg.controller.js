/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/AxisAction.controller",
  [
    "sap/zen/dsh/library",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    easyGrid,
    Controller,
    JSONModel,
    ErrorHandler,
    _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.AxisAction", {
        beforeOpen: function (oEvent) {
          var oData = oEvent.getSource().getItem().data();
          oEvent.getSource().setModel(new JSONModel(_.assign(oData, {
            ToRows: oData.Axis != easyGrid.Axis.Rows,
            ToColumns: oData.Axis != easyGrid.Axis.Columns,
            ToFree: oData.Axis != easyGrid.Axis.Free && !oData.IsStructure,
            Down: oData.Axis != easyGrid.Axis.Free && oData.Position != oData.LastPosition,
            Up: oData.Axis != easyGrid.Axis.Free && oData.Position != 0
          })));
        },
        up: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().getParent().getItem().data();
          that.getOwnerComponent().getRootControl().setBusy(true);
          Promise.resolve(null).then(
            function(){
              that.getView().getModel("om").getDataProvider(0).moveUp(
                oData.Name
              );
              return that.getView().getModel("om").getDataProvider(0).getResultSet();
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(function () {
            that.getOwnerComponent().getRootControl().setBusy(false);
          });
        },
        down: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().getParent().getItem().data();
          that.getOwnerComponent().getRootControl().setBusy(true);
          return Promise.resolve(null).then(
            function(){
              that.getView().getModel("om").getDataProvider(0).moveDown(
                oData.Name
              );
              return that.getView().getModel("om").getDataProvider(0).getResultSet();
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            function () {
              that.getOwnerComponent().getRootControl().setBusy(false);
            }
          );
        },
        move2Columns: function (oEvent) {
          var that = this;
          that.getOwnerComponent().getRootControl().setBusy(true);
          var sName =  oEvent.getSource().data().Name;
          Promise.resolve(
            null
          ).then(
            function(){
              that.getView().getModel("om").getDataProvider(0).toColumns(
                sName
              );
              return that.getView().getModel("om").getDataProvider(0).getResultSet();
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).then(function () {
            that.getOwnerComponent().getRootControl().setBusy(false);
          });
        },
        move2Rows: function (oEvent) {
          var that = this;
          var sName =  oEvent.getSource().data().Name;
          that.getOwnerComponent().getRootControl().setBusy(true);
          Promise.resolve(null).then(
            function(){
              that.getView().getModel("om").getDataProvider(0).toRows(
                sName
              );
              return that.getView().getModel("om").getDataProvider(0).getResultSet();
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).then(
            function () {
              that.getOwnerComponent().getRootControl().setBusy(false);
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          );
        },
        move2Free: function (oEvent) {
          var that = this;
          var sName =  oEvent.getSource().data().Name;
          that.getOwnerComponent().getRootControl().setBusy(true);
          Promise.resolve(null).then(
            function(){
              that.getView().getModel("om").getDataProvider(0).removeDrilldown(
                sName
              );
              return that.getView().getModel("om").getDataProvider(0).getResultSet();
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(function () {
            that.getOwnerComponent().getRootControl().setBusy(false);
          });
        },
        chaProp: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().getParent().getItem().data();
          var oDP = that.getView().getModel("om").getDataProvider(0);
          Promise.resolve(null).then(function () {
            return oDP.openDimDialog(
              oData.Name
            );
          }).then(
            function(b){
              return b?oDP.getResultSet():oDP;
            }
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(function () {
            that.getOwnerComponent().getRootControl().setBusy(false);
          });
        },
        selector: function (oEvent) {
          var that = this;
          var oData = oEvent.getSource().getParent().getItem().data();
          that.getView().getModel("om").getDataProvider(0).openSelector(
            oData.Name
          ).then(
            that.getOwnerComponent().Utilities.saveAppState
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(function () {
            that.getOwnerComponent().getRootControl().setBusy(false);
          });
        },
      }
    );
    return new sap.zen.dsh.rsrt.controller.AxisAction();
  }
);
