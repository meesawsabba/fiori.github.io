/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, document */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Share.controller",
  [
    "sap/base/Log",
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/mvc/Controller",
    "sap/zen/dsh/utils/ErrorHandler",
    "sap/m/MessageToast"
  ],
  function (
    Log,
    ResourceModel,
    Controller,
    ErrorHandler,
    MessageToast
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Share", {
        onInit: function () {
          var that = this;
          that.getView().loaded().then(function () {
            var oBMB = that.getView().byId("bookmarkButton");
            that.getView().setModel(
              new ResourceModel({
                bundle: sap.ui.getCore().getLibraryResourceBundle("sap.m")
              }),
              "share"
            );
            oBMB.setBeforePressHandler(
              function () {
                var oComp = that.getOwnerComponent();
                oComp.getRootControl().setBusy(true);
                var oDP = oComp.getModel("om").getDataProvider("0");
                oComp.Utilities.saveAppState(true).then(
                  function (sKey) {
                    oBMB.setCustomUrl(
                      [
                        "#Report-anaylzeData?",
                        encodeURIComponent(oDP.QueryName),
                        "&/sap-iapp-state=",
                        encodeURIComponent(sKey)
                      ].join("")
                    );
                    if (!oBMB.getInfo()) {
                      oBMB.setInfo(
                        sap.ui.core.format.DateFormat.getDateTimeInstance().format(
                          new Date()
                        )
                      );
                    }
                    oComp.getRootControl().setBusy(false);
                  }
                ).catch(
                  function (e) {
                    Log.error(e);
                    oComp.getRootControl().setBusy(false);
                  }
                );
              }
            );
            if (that.getView().getModel()) {
              that.getView().getModel().setProperty("/isBusy", false);
            }
          });
        },
        shareEmailPressed: function () {
          var that = this;
          var oComp = that.getOwnerComponent();
          oComp.getRootControl().setBusy(true);
          oComp.Utilities.saveAppState(true).then(
            function (sId) {
              var oDP = oComp.getModel("om").getDataProvider("0");
              var aM = document.URL.match(/(.*)#(.+)-(.+)\?/);
              sap.m.URLHelper.triggerEmail(
                null,
                oDP.QueryTitle||oDP.QueryName,
                [
                  document.URL.match(/(.*)#/)[1],
                  "#", aM[2],"-",aM[3],"?name=",
                  encodeURIComponent(oDP.QueryName),
                  "&type=",
                  encodeURIComponent(oDP.QueryType),
                  "&systemName=",
                  encodeURIComponent(oDP.SystemName),
                  "&/sap-iapp-state=",
                  encodeURIComponent(sId)
                ].join(""),null,null,true
              );
            }
          ).catch(
            ErrorHandler.handleWithPopUp
          ).then(function () {
            oComp.getRootControl().setBusy(false);
          });
          that.getView().getParent().close();
        },
        shareJamPressed: function () {
          MessageToast.show("Not yet implemented");
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Share;
  }
);
