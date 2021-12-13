/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/dialogs/Open",
  [
    "sap/base/Log",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Log, Fragment, JSONModel, MessageBox, ResourceModel, ResourceBundle, _
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
          Fragment.load(
            {
              name: "sap.zen.dsh.fragment.Open",
              controller: {
                search: function () {
                  oDlgValueHelp.setBusy(true);
                  Promise.resolve(null).then(function () {
                    return oDlgValueHelp.getModel("om").getCatalog(
                      sap.ui.getCore().byId("fbotext").getValue(),
                      sap.ui.getCore().byId("fbosystem").getSelectedKey(),
                      sap.ui.getCore().byId("fbotype").getSelectedKey()
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
                  fResolve(
                    {
                      name: oEvent.getParameter("tokens")[0].getKey(),
                      systemName: sap.ui.getCore().byId("fbosystem").getSelectedKey(),
                      package: oEvent.getParameter("tokens")[0].data().row.Package,
                      schema: oEvent.getParameter("tokens")[0].data().row.Schema,
                      type: oEvent.getParameter("tokens")[0].data().row.Type || "query"
                    }
                  );
                },
                onCancelValueHelp: function () {
                  oDlgValueHelp.close();
                  fResolve(null);
                }
              }
            }
          )
        ).then(function (oDlg) {
          oDlgValueHelp = oDlg;
          oDlgValueHelp.setModel(
            ResourceModel, "i18n"
          );
          oDlgValueHelp.openQuery = function (oOM) {
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
                ).setData(
                  {
                    cols: [
                      {
                        label: "Key",
                        template: "key"
                      }, {
                        label: "Description",
                        template: "Description"
                      },
                      {
                        label: "Package",
                        template: "Package"
                      },
                      {
                        label: "Schema",
                        template: "Schema"
                      },
                      {
                        label: "Type",
                        template: "Type"
                      }]
                  });
                oTable.bindRows("/");
                oTable.getModel().setData([]);
                oDlg.setModel(oOM, "om");
                return oOM.getCatalog(
                  sap.ui.getCore().byId("fbotext").getValue(),
                  sap.ui.getCore().byId("fbosystem").getSelectedKey(),
                  sap.ui.getCore().byId("fbotype").getSelectedKey()
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
