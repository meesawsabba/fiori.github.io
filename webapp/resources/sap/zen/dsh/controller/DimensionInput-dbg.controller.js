/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/controller/DimensionInput.controller",
  [
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Controller,
    Log,
    _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.controller.DimensionInput", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          oView.setBusy(true);
          oView.loaded().then(
            function () {
              oView.setBusy(false);
            }
          );
        },
        onExit: function () {
          var that = this;
          that.getView().removeAllDependents();
        },
        tokenUpdate: function (oEvent) {
          var that = this;
          var sName = oEvent.getSource().data("name");
          var oDim = _.find(
            that.getView().getModel("Restriction").getProperty("/Dimensions"),
            function (o) {
              return o.Name === sName;
            }
          );
          if (!oDim) {
            throw new Error("Dimension Not Found");
          }
          var oRM = that.getView().getModel("Restriction");
          var sDataProviderName = oRM.getProperty("/dataProviderName");
          var oDimension = that.getView().getModel("om").getProperty(
            [
              "/dataProvider/" + sDataProviderName + "/Dimensions",
              encodeURIComponent(oDim.Name)
            ].join("/")
          );
          if (!oDimension) {
            throw new Error("Dimension Not Found");
          }
          var oHash = _.reduce(
            oEvent.getParameter(
              "removedTokens"
            ),
            function (oRes, oTok) {
              oRes[oTok.getKey()] = true;
              return oRes;
            }, {}
          );
          oDim.Values = _.filter(
            oDim.Values,
            function (oVal) {
              return !oHash[oVal.key];
            }
          );
          oDim.Values = _.concat(
            oDim.Values,
            _.map(
              oEvent.getParameter("addedTokens"),
              function (oT) {
                return oT.data();
              }
            )
          );
          oRM.checkUpdate();
        },
        handleValueHelp: function (oEvent) {
          var that = this;
          var sDimName = oEvent.getSource().data().name;
          var oRM = that.getView().getModel("Restriction");
          var sDataProviderName = oRM.getProperty("/dataProviderName");
          that.getView().getModel("om").getDataProvider(sDataProviderName).openSelector(
            sDimName, true
          ).then(
            function (aList) {
              if (aList) {
                var nIndex = _.findIndex(
                  oRM.getProperty("/Dimensions"),
                  function (oD) {
                    return oD.Name === sDimName;
                  }
                );
                oRM.setProperty(
                  [
                    "/Dimensions",
                    nIndex,
                    "Values"
                  ].join("/"),
                  aList
                );
              }
            }
          ).catch(Log.error);
        }
      }
    );
    return sap.zen.dsh.controller.DimensionInput;
  }
);
