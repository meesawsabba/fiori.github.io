/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/dialogs/Formular",
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
    var fResolve, fReject;

    function handleDialog(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    var oDialog = null;

    var oDlgFormular;
    var oPS = {
      "+": 1,
      "-": 2,
      "*": 3,
      "/": 4
    };
    var sDataProviderName = "";
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.FormularDialog",
            controller: {
              onOk: function () {
                oDialog.setBusy(true);
                var oHash = _.reduce(
                  oDlgFormular.getModel("Formular").getProperty("/Members"),
                  function (oC, o) {
                    oC[o.FDescription] = o.Name;
                    return oC;
                  }, {}
                );

                function buildParseTree(aItems) {
                  function isOpeningBracket(oItem) {
                    return oItem.getType() === "Operator" && oItem.getKey() === "(";
                  }

                  function isClosingBracket(oItem) {
                    return oItem.getType() === "Operator" && oItem.getKey() === ")";
                  }

                  function scanOperator(a) {
                    var nOB = 0;

                    function maxOp(sO1, sO2) {
                      if (!sO1) {
                        return sO2;
                      }
                      return oPS[sO1] <= oPS[sO2] ? sO1 : sO2;
                    }
                    return _.reduce(
                      a,
                      function (oCHO, o, nIndex) {
                        if (
                          isOpeningBracket(o)
                        ) {
                          nOB++;
                          return oCHO;
                        } else if (
                          isClosingBracket(o)
                        ) {
                          nOB--;
                          return oCHO;
                        } else if (o.getType() === "Operator" && nOB === 0) {
                          var sOP = maxOp(oCHO.operator, o.getKey());
                          if (sOP !== oCHO.operator) {
                            oCHO.operator = sOP;
                            oCHO.leftItems = a.slice(0, nIndex);
                            oCHO.rightItems = a.slice(nIndex + 1, a.length);
                          }
                          return oCHO;
                        } else {
                          return oCHO;
                        }
                      }, {
                        operator: null,
                        leftItems: null,
                        rightItems: null
                      }
                    );
                  }

                  function removeOuterBrakckets(a) {
                    if (
                      !isOpeningBracket(a[0]) ||
                        !isClosingBracket(a[a.length - 1])
                    ) {
                      return a;
                    }
                    var res = _.reduce(
                      a.slice(1, a.length - 1),
                      function (nC, o) {
                        var n = nC;
                        if (isOpeningBracket(o)) {
                          n++;
                        } else if (isClosingBracket(o)) {
                          n--;
                        }
                        return n;
                      }, 0
                    ) === 0 ? removeOuterBrakckets(a.slice(1, a.length - 1)) : a;

                    return res;
                  }

                  // Eliminate outer brackets,
                  var aI = removeOuterBrakckets(aItems);
                  // Check infix operator
                  var oOpe = scanOperator(aI);
                  if (oOpe.operator) {
                    return {
                      operator: oOpe.operator,
                      left: oOpe.leftItems ? buildParseTree(oOpe.leftItems) : null,
                      right: oOpe.rightItems ? buildParseTree(oOpe.rightItems) : null
                    };
                  } else if (
                    aI[0].getType() === "CustomFunction" ||
                      aI[0].getType() === "Function"
                  ) {
                    return {
                      operator: aI[0].getKey(),
                      left: buildParseTree(aI.slice(1, aI.length - 1))
                    };
                  } else {
                    return {
                      operator: aI[0].getType(),
                      left: aI[0].getType() === "Variable" ? oHash[aI[0].getKey()] : parseFloat(aI[0].getKey())
                    };
                  }
                }

                if (oDlgFormular.getContent()[0].byId("builder").getItems().length) {
                  var oParseTree = buildParseTree(
                    oDlgFormular.getContent()[0].byId("builder").getItems()
                  );
                  oDlgFormular.getModel("om").getDataProvider(
                    sDataProviderName
                  ).addFormula(
                    oDlgFormular.getModel("Formular").getProperty("/StructureKey"),
                    oDlgFormular.getModel("Formular").getProperty("/Description"),
                    oParseTree,
                    oDlgFormular.getModel("Formular").getProperty("/exceptionalAggregation"),
                    oDlgFormular.getModel("Formular").getProperty("/exceptionalAggregationDim")
                  ).then(function () {
                    fResolve(true);
                    oDlgFormular.close();
                  }).catch(function (oError) {
                    fReject(oError);
                    oDlgFormular.close();
                  });
                } else {
                  oDlgFormular.close();
                }
              },
              beforeClose: function () {
                oDialog.setBusy(false);

              },
              onCancel: function () {
                fResolve(false);
                oDlgFormular.close();
              }
            }
          }).then(function (oDlg) {
            oDialog = oDlg;
            oDlg.setModel(ResourceModel, "i18n");
            oDlgFormular = oDlg;
            oDlgFormular.setModel(new JSONModel(), "Formular");
            var fOpen = oDlgFormular.open;

            oDlgFormular.open = function (oOM, sDPName, sDim, oMember) {
              sDataProviderName = sDPName;
              var oCS = oDlgFormular.getModel("Formular");
              oDlgFormular.setModel(oOM, "om");
              var a = oOM.getProperty(
                [
                  "/dataProvider", sDataProviderName, "Dimensions",
                  encodeURIComponent(sDim)
                ].join("/")
              );
              var aDims = _.filter(
                oOM.getDataProvider(sDataProviderName).Dimensions,
                function (oD) {
                  return !oD.IsStructure;
                }).map(function (oD) {
                return {
                  Name: oD.Name,
                  Description: oD.Description
                };
              }).sort(function (oD1, oD2) {
                return oD1.Description < oD2.Description;
              });
              oDlgFormular.setTitle(
                ResourceBundle.getText(oMember ? "DISP_FORMULA" : "FORMULA_SETTINGS")
              );
              oCS.setData({
                changeMode: !oMember,
                displayMode: !!oMember,
                exceptionalAggregationDim: aDims[0].Name,
                dimensions: aDims,
                exceptionalAggregation: "DEFAULT",
                Structure: a.Description,
                StructureKey: a.Name,
                isValid: true,
                Expression: oMember ? oOM.getDataProvider(
                  sDataProviderName
                ).getFormulaContent(sDim, oMember) : "0",
                Members: _.map(
                  oOM.getDataProvider(sDataProviderName).getStructureMembers(sDim),
                  function (oMem) {
                    return {
                      Name: oMem.Name,
                      Description: oMem.Description,
                      FDescription: oMem.Description.replace(/\s/g, "")
                    };
                  }
                ),
                Description: oMember ? oMember.Description : ResourceBundle.getText(
                  "FORMULAR_DESCR",
                  1
                )
              });
              oDialog.setBusy(false);
              fOpen.call(oDlgFormular);

              return new Promise(handleDialog);
            };
            return oDlgFormular;
          }));
      });
    }
    return getDialog;
  }
);
