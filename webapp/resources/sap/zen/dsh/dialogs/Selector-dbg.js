/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/dialogs/Selector",
  [
    "sap/base/Log",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Token",
    "sap/zen/dsh/utils/ResourceModel",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/dsh/utils/TokenHelper",
    "sap/zen/dsh/DimensionType",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Log, Fragment, JSONModel, MessageBox, Token,
    ResourceModel, ResourceBundle, TokenHelper, DimensionType, _
  ) {
    "use strict";
    var oDlgValueHelp;
    var fResolve, fReject;
    var oOpText = {
      EQ: "",
      LT: "<",
      LE: "<=",
      GT: ">",
      GE: ">=",
      NE: "!"
    };
    function tokenFromFilter(oRange,oHashMap){
      function getText(){
        var oL = oHashMap[oRange.Low];
        var sLT = oL ? oL.description : oRange.Low;
        var oH = oHashMap[oRange.High];
        if(oRange.ComparisonOperator === "BT"){
          var sHT = oL && oH ? oH.description: oRange.High;
          return [sLT,sHT].join("-");
        } else {
          return [oOpText[oRange.ComparisonOperator],sLT].join("");
        }
      }
      var oToken = new Token({
        key: oRange.Low,
        text: getText()
      });
      oToken.data().range = oRange;
      if(oRange.ComparisonOperator === "NE"){
        oRange.ComparisonOperator = "EQ";
        oRange.exclude = true;
      }
      return oToken;
    }
    function handleDialog(resolve, reject) {
      fResolve = resolve;
      fReject = reject;
    }
    var oTable;
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.Selector",
            controller: {
              search: function () {
                oDlgValueHelp.setBusy(true);
                Promise.resolve(null).then(function () {
                  return oDlgValueHelp.getModel(
                    "om"
                  ).getDataProvider(
                    oDlgValueHelp.getModel().getProperty("/dpname")
                  ).getMemberCatalog(
                    oDlgValueHelp.getModel().getProperty("/dimension"),
                    sap.ui.getCore().byId("fbdimtext").getValue()
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
                        title: oDlgValueHelp.getModel(
                          "i18n"
                        ).getResourceBundle().getText("ERROR_OPEN"),
                        actions: [MessageBox.Action.CLOSE]
                      }
                    );
                  }
                );
              },
              onOkValueHelp: function (oEvent) {
                oDlgValueHelp.close();
                var f = fResolve;
                fResolve = null;
                f(
                  _.map(
                    oEvent.getParameter("tokens"),
                    function(o) {
                      var oRange = o.data("range");
                      return oRange? {
                        ComparisonOperator: oRange.exclude? "NE" : oRange.operation,
                        Low: oRange.value1 instanceof Date? TokenHelper.dateToYMD(
                          oRange.value1
                        ) : oRange.value1,
                        High: oRange.value2 instanceof Date?TokenHelper.dateToYMD(
                          oRange.value2
                        ) : oRange.value2
                      } : {
                        ComparisonOperator: "EQ",
                        Low: o.getKey(),
                        Text: o.getText()
                      };
                    }
                  )
                );
              },
              onAfterClose: function () {
                oDlgValueHelp.close();
                if(fResolve){
                  fResolve(null);
                }
              }
            }
          })
        ).then(function (oDlg) {
          oDlgValueHelp = oDlg;
          oDlgValueHelp.setModel(new JSONModel());
          oDlgValueHelp.setModel(
            ResourceModel, "i18n"
          );
          oDlgValueHelp.openSelector = function (
            oOM, sDataProvider, sDimension, aFilter
          ) {
            oDlgValueHelp.setBusy(true);
            oDlgValueHelp.getModel().setProperty(
              "/supportRanges",
              !oOM.getDataProvider(sDataProvider).Dimensions[sDimension].IsStructure
            );
            oDlgValueHelp.getModel().setProperty("/dpname", sDataProvider);
            oDlgValueHelp.getModel().setProperty("/dimension", sDimension);
            oDlgValueHelp.getModel().setProperty(
              "/description",
              oOM.getDataProvider(sDataProvider).Dimensions[sDimension].Description
            );
            oDlgValueHelp.open();
            oDlgValueHelp.getTableAsync().then(
              function (oT) {
                oTable = oT;
                oTable.setModel(new JSONModel());
                oTable.setModel(new JSONModel(), "columns");
                oTable.getModel(
                  "columns"
                ).setData(
                  {
                    cols: [
                      {
                        label: ResourceBundle.getText("KEY"),
                        template: "key"
                      },{
                        label: ResourceBundle.getText("DISPLAY_KEY"),
                        template: "displayKey"
                      },{
                        label: ResourceBundle.getText("Description"),
                        template: "description"
                      }
                    ]
                  }
                );
                oTable.getModel(
                  "columns"
                ).setData(
                  {
                    cols: [
                      {
                        label: "Key",
                        template: "key",
                        visible:false
                      },
                      {
                        label: ResourceBundle.getText("DISPLAY_KEY"),
                        template: "displayKey"
                      },
                      {
                        label: ResourceBundle.getText("Description"),
                        template: "description"
                      }
                    ]
                  }
                );
                oTable.getColumns()[0].setVisible(false);
                oTable.bindRows("/");
                oTable.getModel().setData([]);
                oDlg.setModel(oOM, "om");
                return oDlgValueHelp.getModel(
                  "om"
                ).getDataProvider(
                  oDlgValueHelp.getModel().getProperty("/dpname")
                ).getMemberCatalog(
                  oDlgValueHelp.getModel().getProperty("/dimension"),
                  sap.ui.getCore().byId("fbdimtext").getValue()
                );
              }
            ).then(
              function (oRes) {
                var oRes1 = oRes || {};
                oTable.getModel().setData(oRes1.catalog);
                if (oTable.bindRows) {
                  oTable.bindRows("/");
                }
                oDlgValueHelp.setTokens([]);
                var oFilterHash = _.reduce(
                  aFilter, function(oC,s){
                    oC[s]=true;
                    return oC;
                  },{});
                _.forEach(
                  oRes1.catalog,
                  function (oEntry, nIndex) {
                    if (oFilterHash[oEntry.key]) {
                      oTable.addSelectionInterval(nIndex, nIndex);
                    }
                  }
                );
                var oHashMap = _.reduce(
                  oRes1.catalog,
                  function (o, o1) {
                    o[o1.key] = o1;
                    return o;
                  }, {}
                );
                oDlgValueHelp.setTokens(
                  _.map(
                    aFilter,
                    function (o) {
                      var oTo = tokenFromFilter(o, oHashMap);
                      return oTo;
                    }
                  )
                );
                oDlg.setRangeKeyFields([{
                  key: "displayKey",
                  type: oOM.getDataProvider(sDataProvider).Dimensions[
                    sDimension
                  ].Type === DimensionType.DateDimension ? "date" : null,
                  label: "{i18n>DISPLAY_KEY}"
                }]);
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
