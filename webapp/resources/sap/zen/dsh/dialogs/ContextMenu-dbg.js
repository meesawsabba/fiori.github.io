/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/dialogs/ContextMenu",
  [
    "sap/ui/core/Fragment",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Fragment, ResourceModel, _
  ) {
    "use strict";
    var oDlgCM;
    var fResolve;

    function handleDialog(resolve) {
      fResolve = resolve;
    }
    function getDialog(oComponent) {
      return oComponent.runAsOwner(
        function () {
          return Promise.resolve(
            Fragment.load(
              {
                name: "sap.zen.dsh.fragment.ContextMenu",
                controller: {
                  afterClose: function () {
                    oDlgCM.close();
                    fResolve(oDlgCM.getModel("om"));
                  }
                }
              })
          ).then(function (oDlg) {
            oDlgCM = oDlg;
            oDlgCM.setModel(ResourceModel, "i18n");
            oDlgCM.open = function (o, oPivot, oCM, oOM) {
              oDlgCM.setModel(oCM, "cm");
              oDlgCM.setModel(oOM, "om");
              _.forEach(
                oDlgCM.getContent()[0].byId("cm").getItems(),
                function (oI) {
                  oI.setExpanded(false);
                }
              );
              oDlg.getContent()[0].getPivot = _.constant(oPivot);
              oDlgCM.openBy(o);
              return new Promise(handleDialog);
            };
            return oDlgCM;
          });
        }
      );
    }
    return getDialog;
  }
);
