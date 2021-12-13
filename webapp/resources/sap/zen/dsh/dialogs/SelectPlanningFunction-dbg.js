/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/dialogs/SelectPlanningFunction",
  [
    "sap/base/Log",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/dsh/utils/ResourceBundle"
  ],
  function (
    Log, Fragment, JSONModel, MessageBox, ResourceModel, ResourceBundle
  ) {
    "use strict";
    var oDlgValueHelp;
    var fResolve, fReject;

    function handleDialog(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    var oTable;
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.SelectPlanningFunction",
            controller: {
              search: function () {
                oDlgValueHelp.setBusy(true);
                Promise.resolve(null).then(function () {
                  return oDlgValueHelp.getModel("om").getPlanningFunctionCatalog(
                    sap.ui.getCore().byId("fbpftext").getValue()
                  );
                }).then(
                  function (oRes1) {
                    oTable.getModel().setData(oRes1.catalog);
                    oTable.clearSelection();
                    oDlgValueHelp.setBusy(false);
                  }
                ).catch(
                  function (oError) {
                    Log.error(oError.stack);
                    oDlgValueHelp.setBusy(false);
                    MessageBox.show(
                      oError.message, {
                        icon: MessageBox.Icon.ERROR,
                        title: oDlgValueHelp.getModel("i18n").getResourceBundle().getText("ERROR_OPEN"),
                        actions: [MessageBox.Action.CLOSE]
                      }
                    );

                  }
                );
              },
              onOkValueHelp: function (oEvent) {
                oDlgValueHelp.close();
                fResolve({
                  Name: oEvent.getParameter("tokens")[0].getKey(),
                  Text: oEvent.getParameter("tokens")[0].getText()
                });
              },
              onCancelValueHelp: function () {
                oDlgValueHelp.close();
                fResolve(null);
              }
            }
          })
        ).then(function (oDlg) {
          oDlgValueHelp = oDlg;
          oDlgValueHelp.setModel(
            ResourceModel, "i18n"
          )
          oDlgValueHelp.selectPlanningFunction = function (oOM) {
            oDlgValueHelp.setBusy(true);
            oDlgValueHelp.open.apply(oDlgValueHelp);
            oDlgValueHelp.getTableAsync().then(
              function (oT) {
                oTable = oT;
                oDlgValueHelp.setModel(new JSONModel());
                oTable.setModel(new JSONModel());
                oTable.setModel(new JSONModel(), "columns");
                oTable.getModel(
                  "columns"
                ).setData({
                  cols: [{
                    label: "Key",
                    template: "key"
                  }, {
                    label: "Description",
                    template: "Description"
                  }]
                });
                oTable.getModel(
                  "columns"
                ).setData({
                  cols: [{
                    label: "Key",
                    template: "key"
                  }, {
                    label: "Description",
                    template: "Description"
                  }]
                });
                oTable.bindRows("/");
                oTable.getModel().setData([]);
                oDlg.setModel(oOM, "om");
                return oOM.getPlanningFunctionCatalog(
                  sap.ui.getCore().byId("fbpftext").getValue()
                );
              }
            ).then(
              function (oRes) {
                var oRes1 = oRes || {};
                oRes1.multipleValues = false;
                oRes1.Description = ResourceBundle.getText("OPEN");
                oDlgValueHelp.getModel().setData(oRes1);
                oTable.getModel().setData(oRes1.catalog);
                if (oTable.bindRows) {
                  oTable.bindRows("/");
                }
                oDlgValueHelp.setTokens([]);
                oDlgValueHelp.setBusy(false);

              }
            ).catch(
              function (oError) {
                oDlgValueHelp.setBusy(false);
                fReject(oError);
              }
            );
            return new Promise(handleDialog);
          };
          return oDlgValueHelp;
        });
      });
    }
    return getDialog;
  }
);
