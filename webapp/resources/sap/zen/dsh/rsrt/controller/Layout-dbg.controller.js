/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Layout.controller",
  [
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (Log, Controller, _) {
    "use strict";
    Log.info("Load Layout controll");
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Layout", {
        dimensionPress: function (oEvent) {
          var oItem = oEvent.getParameter("item");
          this.getOwnerComponent().getAxisActionMenu().getItem = _.constant(oItem);
          this.getOwnerComponent().getAxisActionMenu().openBy(oItem);
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Layout;
  }
);
