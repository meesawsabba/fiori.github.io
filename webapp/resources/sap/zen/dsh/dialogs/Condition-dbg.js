/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/zen/dsh/dialogs/Condition",
  [
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Fragment, JSONModel, ResourceBundle, ResourceModel, _
  ) {
    "use strict";
    var sDataProviderName;
    var oDialog;
    var fResolve, fReject;
    function handleDialogButton(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.ConditionDialog",
            controller: {
              onOk: function () {
                var oOM = oDialog.getModel("om");
                oDialog.close();
                oOM.getDataProvider(sDataProviderName)
                  .addCondition(oDialog.getModel("Condition").getData())
                  .then(function () {fResolve(true);})
                  .catch(function (oError) {fReject(oError);});
              },
              onCancel: function () {
                oDialog.close();
                fResolve(false);
              }
            }
          }).then(
            function (oDlg) {
              oDialog = oDlg;
              oDialog.setModel(ResourceModel, "i18n");
              oDlg.setModel(new JSONModel(), "Condition");
              var fOpen = oDlg.open;
              oDlg.open = function (oOM, sDPName) {
                sDataProviderName = sDPName;
                var oCS = oDlg.getModel("Condition");
                oDialog.setModel(oOM, "om");
                var a = _.filter(
                  oOM.getDataProvider(sDataProviderName).Dimensions,
                  function (oD) {
                    return oD.IsStructure;
                  }
                );
                oDlg.setModel(oOM, "om");
                oCS.setData({
                  measure1: a[0] && a[0].Members.length ? _.map(a[0].Members)[0].Name : "",
                  measure2: a[1] && a[1].Members.length ? _.map(a[1].Members)[1].Name : "",
                  Structure1: a[0] ? a[0].Description : null,
                  Structure1Key: a[0] ? a[0].Name : null,
                  Structure2Key: a[1] ? a[1].Name : null,
                  Structure2: a[1] ? a[1].Description : null,
                  Value: 5,
                  Members1: _.map(
                    a[0] ? a[0].Members : [],

                    function (oMem) {
                      return {
                        Name: oMem.Name,
                        Description: oMem.Description
                      };
                    }
                  ),
                  Members2: _.map(
                    a[1] ? a[1].Members : [],
                    function (oMem) {
                      return {
                        Name: oMem.Name,
                        Description: oMem.Description
                      };
                    }
                  ),
                  operator: "TOP_N",
                  Description: ResourceBundle.getText("COND_DESCR",
                    [_.map(oOM.getProperty("/dataProvider/0/Conditions") || [] ).length + 1]
                  )
                });
                fOpen.call(oDlg);
                return new Promise(handleDialogButton);

              };
              return oDlg;
            }
          )
        );
      });
    }
    return getDialog;
  }
);
