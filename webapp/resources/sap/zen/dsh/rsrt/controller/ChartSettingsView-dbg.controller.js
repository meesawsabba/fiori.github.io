/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/ChartSettingsView.controller",
  [
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/m/ColorPalettePopover",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Log,
    Controller,
    ColorPalettePopover,
    _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.ChartSettingsView", {
        onInit: function () {
          var that = this;
          that.getView().setBusy(true);
          that.getView().loaded().then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        openColorPicker: function (oEvent) {
          var oSource = oEvent.getSource();
          (
            new ColorPalettePopover({
              colorSelect: function (oEvent1) {
                var nPos = parseInt(_.find(
                  oSource.getCustomData(),
                  function (o) {
                    return o.getKey() === "position";
                  }
                ).getValue(), 10);
                oSource.getModel("cs").setProperty(
                  ["/colors", nPos, "color"].join("/"),
                  oEvent1.getParameter("value")
                );
                oSource.getModel("cs").setProperty(
                  ["/colors", nPos, "changed"].join("/"),
                  true);
              }
            })
          ).openBy(oEvent.getSource());
        },
        dimChange: function(){
          var that = this;
          that.getOwnerComponent().getRootControl().setBusy(true);
          var oDP = that.getOwnerComponent().getModel("om").getDataProvider("0");
          var oC = oDP.Chart;
          var oL = {
            rows : _.filter(
              [
                oC.hasCatDimension ? oC.catDimension : null,
                oC.hasCat2Dimension ? oC.cat2Dimension :  null,
                oC.hasColDimension ? oC.colDimension :  null,
                oC.hasDataFrameDimension ? oC.dataFrameDimension :  null,
              ],
              _.identity),
            columns: _.filter(
              [
                oC.hasValDimension ? oDP.Chart.valDimension : null,
                oC.hasVal2Dimension ? oDP.Chart.val2Dimension : null,
                oC.hasTitDimension ? oDP.Chart.titDimension : null,
                oC.hasTimeDimension ? oDP.Chart.timeDimension : null
              ],_.identity)
          };
          if(oL.rows.length || oL.columns.length){
            oDP.setAxesLayout(oL);
          }
          oDP.getResultSet().catch(
            function(oError){
              Log.error(oError);
            }
          ).then(
            function(){
              that.getOwnerComponent().getRootControl().setBusy(false);
            }
          );
        },
        updateChart:function(){
          var that = this;
          that.getOwnerComponent().getRootControl().byId("ChartView").getController().updateChart();
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.ChartSettingsView;
  }
);
