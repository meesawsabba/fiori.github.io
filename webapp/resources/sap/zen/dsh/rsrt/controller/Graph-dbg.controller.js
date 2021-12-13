/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Graph.controller",
  [
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
  ],
  function (
    Log, Controller, JSONModel
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Graph", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          var oOM =  oView.getModel( "om" );
          oView.setBusy(true);
          oOM.loaded().then(
            function(){
             oOM.attachRequestCompleted(
                function(){
                 oOM.getDataProvider(0).produceGraph();
                }
              );
            }
          ).catch(
            function(e){
              Log.error(e);
            }
          ).then(
            function(){
              oView.setBusy(false);
            }
          );
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Graph;
  }
);