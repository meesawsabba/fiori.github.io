/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Exceptions.controller",
  [
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Controller, JSONModel,
    _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Exceptions", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          that.getASEXC = _.constant(
            Promise.resolve(
              sap.ui.core.Fragment.load({
                name: "sap.zen.dsh.rsrt.fragments.ASEXC",
                controller: that
              })
            ).then(function (oFrag) {
              oView.addDependent(oFrag);
              return oFrag;
            })
          );
        },
        onExit: function () {
          var that = this;
          this.getView().destroyDependents();
          that.getView().removeAllDependents();
        },
        exceptionPress: function (oEvent) {
          var that = this;
          var oItem = oEvent.getParameter("item");
          that._key = oItem.getKey();
          that.getASEXC().then(
            function (o) {
              o.setModel(new JSONModel({
                active: oItem.data().active
              }));
              o.openBy(oItem);
            }
          );
        },
        activateException: function () {
          var that = this;
          var oOM = that.getView().getModel("om");
          oOM.getDataProvider("0").setExceptionActive(
            that._key, true
          );

        },
        deactivateException: function () {
          var that = this;
          var oOM = that.getView().getModel("om");
          oOM.getDataProvider("0").setExceptionActive(
            that._key, false
          );
        }

      }
    );
    return sap.zen.dsh.rsrt.controller.Exceptions;
  }
);
