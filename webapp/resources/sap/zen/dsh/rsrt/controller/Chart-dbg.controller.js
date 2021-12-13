/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Chart.controller",
  [
    "jquery.sap.global",
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/zen/commons/thirdparty/lodash"
  ],
  /* eslint-disable max-params */
  function (
    jQuery, Log, Controller, FeedItem, ErrorHandler, _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Chart", {
        onInit: function(){
          var that = this;
          var oView = that.getView();
          oView.getModel("om").attachRequestCompleted(
            function(){
              var oVizFrame = oView.byId("idVizFrame");
              oVizFrame.destroyFeeds();
              var aFeeds = oView.getModel("om").getProperty("/dataProvider/0/Chart/Feeds");
              _.forEach( aFeeds, function( oFeed ){
                oVizFrame.addFeed(
                  new FeedItem(
                    {
                      type: oFeed.type,
                      uid: oFeed.uid,
                      values: oFeed.values
                    }
                  )
                );
              });
              _.forEach(
                oView.byId("flatDS").getDimensions(),
                function (oD) {
                  oD.bindProperty("value", "om>" + oD.getIdentity());
                }
              );
              _.forEach(
                oView.byId("flatDS").getMeasures(),
                function (oM) {
                  oM.bindProperty("value", "om>" + oM.getIdentity());
                }
              );
              that.updateChart();
            }
          );
        },
        updateChart:  function(){
          var that = this;
          that.getOwnerComponent().getRootControl().byId(
            "ChartView"
          ).byId(
            "idVizFrame"
          ).setVizProperties(
            _.clone(
              that.getView().getModel(
                "om"
              ).getDataProvider(0).Chart.vizProperties
            )
          );
          that.getView().invalidate();
        },
        onChartPress: function () {
          var that = this;
          that.getOwnerComponent().getChartSettings().openDialog(
            that
          ).then(
            that.updateChart.bind(that)
          ).catch(
            ErrorHandler.handleWithPopup
          );
        },
        onBeforeRendering: function () {
          var that = this;
          that.getView().setBusy(true);
        },
        onAfterRendering: function () {
          var that = this;
          that.adjustHeight();
          var oAnchorElement = this.getOwnerComponent().getRootControl().byId("megaBox").getDomRef();
          var $Anchor = jQuery(oAnchorElement);
          $Anchor.sizeChanged(
            function(){
              that.adjustHeight();
            }
          );
        },
        adjustHeight: function(){
          var oView = this.getView();
          var oDR = oView.getDomRef();
          if(oDR){
            jQuery(
              oDR
            ).height(
              jQuery(
                this.getOwnerComponent().getRootControl().byId("megaBox").getDomRef()
              ).viewportHeight()
            );
          }
          oView.setBusy(false);
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Chart;
  }
);
