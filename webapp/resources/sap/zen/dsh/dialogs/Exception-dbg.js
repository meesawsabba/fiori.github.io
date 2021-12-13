/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/dialogs/Exception",
  [
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Fragment, JSONModel, ResourceModel, ResourceBundle, _
  ) {
    "use strict";
    var fResolve, fReject;

    function handleDialog(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    var oDialog;
    var sDataProviderName;
    function getDialog(oComponent) {
      return oComponent.runAsOwner(
        function () {
          return Promise.resolve(
            Fragment.load(
              {
                name: "sap.zen.dsh.fragment.ExceptionDialog",
                controller: {
                  onOk: function () {
                    var oOM = oDialog.getModel("om");
                    var oDp = oOM.getDataProvider(sDataProviderName);
                    oDialog.close();
                    Promise.resolve(null).then(function () {
                      return oDp.addException(
                        oDialog.getModel("Exception").getData()
                      );
                    }).then(function () {
                      return fResolve(
                        true
                      );
                    }).catch(
                      function (oError) {
                        fReject(oError);
                      });
                  },
                  onCancel: function () {
                    oDialog.close();
                    return fResolve(
                      false
                    );
                  }
                }
              }
            ).then(
              function (oDlg) {
                oDialog = oDlg;
                oDlg.setModel(new JSONModel(), "Exception");
                oDlg.setModel(ResourceModel, "i18n");
                var fOpen = oDlg.open;
                oDlg.open = function (oOM, sDPName) {
                  sDataProviderName = sDPName;
                  var oCS = oDlg.getModel("Exception");
                  var a = _.filter(
                    oOM.getDataProvider(sDataProviderName).Dimensions,
                    function (oD) {
                      return oD.IsStructure;
                    }
                  );
                  oDlg.setModel(oOM, "om");
                  oCS.setData({
                    alertLevel: 1,
                    measure1: a[0] ? _.map(a[0].Members)[0].Name : "",
                    measure2: a[1] ? _.map(a[1].Members)[1].Name : "",
                    measure1d: a[0] ? _.map(a[0].Members)[0].Name : "",
                    measure2d: a[1] ? _.map(a[1].Members)[1].Name : "",
                    Structure1: a[0] ? a[0].Description : null,
                    Structure1Key: a[0] ? a[0].Name : null,
                    Structure2Key: a[1] ? a[1].Name : null,
                    Structure2: a[1] ? a[1].Description : null,
                    Value: 0,
                    Members1: _.map(
                      a[0] ? a[0].Members : [],
                      function (oMem, sKey) {
                        return {
                          Name: sKey,
                          Description: oMem.Description
                        };
                      }
                    ),
                    Members2: _.map(
                      a[1] ? a[1].Members : [],
                      function (oMem, sKey) {
                        return {
                          Name: sKey,
                          Description: oMem.Description
                        };
                      }
                    ),
                    operator: "GREATER_THAN",
                    Description: ResourceBundle.getText(
                      "EXC_DESCR",
                      [
                        _.map(
                          oOM.getProperty(
                            "/dataProvider/0/Exceptions"
                          ) || []
                        ).length + 1
                      ]
                    )
                  });
                  fOpen.call(oDlg);
                  return new Promise(handleDialog);
                };
                return oDlg;
              }
            )
          );
        }
      );
    }
    return getDialog;
  }
);
