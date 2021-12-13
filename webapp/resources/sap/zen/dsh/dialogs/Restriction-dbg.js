/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/dialogs/Restriction",
  [
    "sap/base/Log",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/dsh/Axis",
    "sap/zen/dsh/DimensionType",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Log, Fragment, JSONModel, ResourceBundle, ResourceModel, Axis, DimensionType, _
  ) {
    "use strict";
    Log.info("Load restriction Dialog");
    var fResolve, fReject;

    function handleDialog(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    var oDialog = null;
    var sDataProviderName = "";
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.RestrictionDialog",
            controller: {
              onOk: function () {
                oDialog.setBusy(true);
                var oOM = oDialog.getModel("om");
                Promise.resolve(null).then(function () {
                  return oOM.getDataProvider(
                    sDataProviderName
                  ).addRestriction(
                    oDialog.getModel("Restriction").getData()
                  );
                }).then(function () {
                  oDialog.setBusy(false);
                  oDialog.close();
                  fResolve(true);

                }).catch(function (oError) {
                  oDialog.setBusy(false);

                  fReject(oError);
                  oDialog.close();
                });

              },
              beforeClose: function () {
                oDialog.setBusy(false);
              },
              onCancel: function () {
                oDialog.close();
                fResolve(false);
              }
            }
          }).then(
            function (oDlg) {
              oDialog = oDlg;
              oDlg.setModel(new JSONModel(), "Restriction");
              var fOpen = oDlg.open;
              oDlg.open = function (oOM, sDPName, sDim, sMem) {
                oDlg.setModel(ResourceModel, "i18n");
                sDataProviderName = sDPName;
                oDlg.setTitle(
                  ResourceBundle.getText("SELECTION_SETTINGS")
                );
                var oCS = oDlg.getModel("Restriction");
                oCS.setData({
                  changeMode: true,
                  dataProviderName: sDataProviderName,
                  displayMode: false,
                  Description: ResourceBundle.getText(
                    "RESTRICTION_DESCR",
                    1
                  ),
                  Keyfigure: sMem,
                  KFDescription: oOM.getDataProvider(sDataProviderName).getMemberDescription(sDim, sMem),
                  Dimension: sDim,
                  Dimensions: _.map(
                    _.filter(
                      oOM.getDataProvider(sDPName).Dimensions,
                      function (oD) {
                        var b = !oD.IsStructure && (
                          oD.Axis === Axis.Columns ||
                            oD.Axis === Axis.Rows ||
                            oD.Axis === Axis.Free
                        );
                        return b;
                      }
                    ),
                    function (oD) {
                      return {
                        Name: oD.Name,
                        Description: oD.Description,
                        ConstantSelection: false,
                        Values: []
                      };
                    }
                  )
                });
                oDlg.setModel(oOM, "om");
                fOpen.call(oDlg);
                return new Promise(handleDialog);
              };
              return oDlg;
            }
          ));
      });
    }
    return getDialog;
  });
