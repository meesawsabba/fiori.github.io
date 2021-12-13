/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/controller/Settings.controller",
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (
    Controller
  ) {
    "use strict";
    var oNavService = sap.ushell && sap.ushell.Container ? sap.ushell.Container.getService(
      "CrossApplicationNavigation"
    ) : null;
    Controller.extend(
      "sap.zen.dsh.controller.Settings", {
        onInit: function () {
          var that = this;
          that.getView().setBusy(true);
          that.getView().loaded().then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        infoProvClick: function () {
          var that = this;
          var sSemObj = "";
          var sInfoProvider = that.getView().getModel().getProperty("/infoProviderName");
          var sType = that.getView().getModel().getProperty("/infoProviderType");
          var oParams = {};
          switch (sType) {
          case "compositeprovider":
            sSemObj = "BWCompositeProvider";
            oParams.hcprName = sInfoProvider;
            break;
          case "datastore":
            sSemObj = "BWDatastore";
            oParams.adsoName = sInfoProvider;
            break;
          case "aggregationlevel":
            sSemObj = "BWAggregationLevel";
            oParams.alvlName = sInfoProvider;
            break;
          case "openodsview":
            sSemObj = "BWOpenODSView";
            oParams.fbpaName = sInfoProvider;
            break;
          case "CDSView":
            sSemObj = "finrep";
            oParams.query = "!" + sInfoProvider;
            break;
          default:
            return;
          }
          oNavService.toExternal({
            target: {
              semanticObject: sSemObj,
              action: "preview"
            },
            params: oParams,
            writeHistory: true
          });
        }
      }
    );
    return sap.zen.dsh.controller.Settings;
  }
);
