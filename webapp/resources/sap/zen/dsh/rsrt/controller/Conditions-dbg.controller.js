/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Conditions.controller",
  [
    "sap/base/Log",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Log,
    Controller,
    JSONModel,
    _
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.rsrt.controller.Conditions", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          that.getASCOND = _.constant(
            Promise.resolve(
              sap.ui.core.Fragment.load({
                name: "sap.zen.dsh.rsrt.fragments.ASCOND",
                controller: that
              })
            ).then(function (oFrag) {
              oView.addDependent(oFrag);
              return oFrag;
            }).catch(function (oError) {
              Log.error(oError);
            })
          );
        },
        onExit: function () {
          var that = this;
          this.getView().destroyDependents();
          that.getView().removeAllDependents();
        },
        conditionPress: function (oEvent) {
          var that = this;
          var oItem = oEvent.getParameter("item");
          that._key = oItem.getKey();
          that.getASCOND().then(function (o) {
            o.setModel(new JSONModel({
              active: oItem.data().active
            }));
            o.openBy(oItem);
          });
        },
        activateCondition: function () {
          var that = this;
          var oOM = that.getView().getModel("om");
          oOM.getDataProvider("0").setConditionActive(
            that._key, true
          );
        },
        deactivateCondition: function () {
          var that = this;
          var oOM = that.getView().getModel("om");
          oOM.getDataProvider("0").setConditionActive(
            that._key, false
          );
        }
      }
    );
    return sap.zen.dsh.rsrt.controller.Conditions;
  }
);
