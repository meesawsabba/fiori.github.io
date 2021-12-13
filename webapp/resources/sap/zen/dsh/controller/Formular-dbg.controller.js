/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/controller/Formular.controller",
  [
    "sap/ui/core/mvc/Controller"
  ],
  function (
    Controller
  ) {
    "use strict";
    Controller.extend(
      "sap.zen.dsh.controller.Formular", {
        onInit: function () {
          var that = this;
          var oView = that.getView();
          oView.setBusy(true);
          oView.loaded().then(
            function () {
              var oBuilder = oView.byId("builder");
              oBuilder.allowFunction("RoundDown", false);
              oBuilder.allowFunction("RoundUp", false);
              oBuilder.allowFunction("Round", false);
              oBuilder.allowFunction("ABS", false);
              oBuilder.allowFunction("EXP", false);
              oBuilder.allowFunction("LOG", false);
              oBuilder.allowFunction("SQRT", false);
              oView.setBusy(false);
            }
          );
        },
        afterValidation: function (oEvent) {
          var that = this;
          that.getView().getParent().getButtons()[
            0
          ].setEnabled(
            !oEvent.getSource().getErrors().length
          );
          that.getView().getParent().getButtons()[
            0
          ].rerender();
        }
      }
    );
    return sap.zen.dsh.controller.Formular;
  }
);
