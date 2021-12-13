/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/controller/NewLines.controller",
  [
    "sap/ui/core/mvc/Controller",
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Controller, Log, MessageToast, _
  ) {
    "use strict";
    Log.info("New lines controller load");
    Controller.extend(
      "sap.zen.dsh.controller.NewLines", {
        onInit: function () {
          var that = this;
          that.getView().setBusy(true);
          that.getView().loaded().then(
            function () {
              that.getView().setBusy(false);
            }
          );
        },
        onPaste: function (oEvent) {
          var that = this;
          var aCol = that.getView().getModel("NewLines").getData().cols;
          var aNew = _.concat(
            _.filter(
              that.getView().getModel("NewLines").getData().rows,
              function (oRow) {
                return _.some(oRow, _.identity);
              }
            ),
            _.map(
              oEvent.getParameters().data,
              function (aRow) {
                return _.reduce(
                  aRow,
                  function (oA, oC, nIndex) {
                    if (aCol[nIndex]) {
                      oA[aCol[nIndex].Name] = oC;
                    }
                    return oA;
                  }, {});
              }
            )
          );
          that.getView().getModel("NewLines").setProperty("/rows", aNew);
        },
        handleValueHelp: function () {
          MessageToast.show("Not yet implemented");
        }
      }
    );
    return sap.zen.dsh.controller.NewLines;
  }
);
