/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/dialogs/NewLines",
  [
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/base/Log",
    "sap/m/MessageToast",
    "sap/zen/dsh/Axis",
    "sap/zen/dsh/DimensionType",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (
    Fragment, JSONModel, Log, MessageToast, Axis, DimensionType, _
  ) {
    "use strict";
    var oDlgCLSetting;
    function getDialog(oComponent) {
      return oComponent.runAsOwner(function () {
        return Promise.resolve(
          Fragment.load({
            name: "sap.zen.dsh.fragment.NewLines",
            controller: {
              onOk: function () {
                var oNL = oDlgCLSetting.getModel("NewLines");
                var oDP = oDlgCLSetting.getModel("om").getDataProvider("0");
                oDlgCLSetting.setBusy(true);
                var aCols = oNL.getProperty("/cols");
                var aRows = _.filter(
                  oNL.getProperty("/rows"),
                  function (o) {
                    return _.some(o, _.identity);
                  }
                );
                oDP.setNewLines(
                  {
                    cols: aCols,
                    rows: aRows
                  }
                ).then(
                  function (oRes) {
                    oDlgCLSetting.setBusy(false);
                    if (oRes && oRes.length > 0 && _.find(
                      oRes,
                      function (oMsg) {
                        return oMsg.type === "Error";
                      }
                    )) {
                      return null;
                    } else {
                      oDlgCLSetting.close();
                      return oDP.refreshLeaveMsg();
                    }
                  }
                ).catch(
                  function (oError) {
                    Log.error(oError);
                  }
                );
              },
              onCancel: function () {
                oDlgCLSetting.close();
              },
              onAddLines: function () {
                var oNL = oDlgCLSetting.getModel("NewLines");
                oNL.setProperty("/rows", _.concat(oNL.getProperty("/rows"), _.range(8).map(function () {
                  return {};
                })));
              }
            }
          })
        ).then(
          function (oDlg) {
            oDlgCLSetting = oDlg;
            oDlgCLSetting.setModel(new JSONModel(), "NewLines");
            oDlgCLSetting.getModel("NewLines").setSizeLimit(1000);
            var fOpen = oDlgCLSetting.open;
            oDlgCLSetting.open = function (oOM) {
              var oNL = oDlgCLSetting.getModel("NewLines");
              oDlgCLSetting.setModel(oOM, "om");
              var oDP = oDlgCLSetting.getModel("om").getDataProvider("0");
              var aStru = _.filter(oDP.Dimensions, function (oDi) {
                return oDi.IsStructure;
              });
              var aMembers = _.flatten(_.map(aStru, function (oStru) {
                return oStru.StructureMembers;
              }));
              return Promise.all(
                _.filter(oDP.Dimensions, function (oD) {
                  return oD.Axis === Axis.Rows && !oD.IsStructure;
                }).map(function (oD) {
                  return oD.get();
                })
              ).then(function () {
                var aCols = _.concat(
                  _.orderBy(
                    _.filter(oDP.Dimensions, function (oD) {
                      return oD.Axis === Axis.Rows && !oD.IsStructure;
                    }),
                    "Position", "asc"
                  ).map(
                    function (oD) {
                      return {
                        Name: oD.Name,
                        IsDim: true,
                        IsDate: oD.DimensionType === DimensionType.Date,
                        Description: oD.Description || oD.Name,
                        type: sap.m.InputType.Text
                      };
                    }
                  ),
                  _.map(
                    oDP.getDataEntryMask().QueryCellNames,
                    function (sName) {
                      var oQC = _.find(
                        oDP.Cube.QueryDataCells,
                        function (oCell) {
                          return oCell.Name === sName;
                        }
                      );
                      return {
                        Name: sName,
                        IsDim: false,
                        QueryCellId: parseInt(sName, 10),
                        Description: _.map(
                          oQC.DimensionMemberReferences,
                          function (s) {
                            return _.find(aMembers, function (oMem) {
                              return !!oMem[s];
                            })[s];
                          }
                        ).map(function (oMem) {
                          return oMem.Description;
                        }).join(" / "),
                        type: sap.m.InputType.Number
                      };
                    }
                  )
                );
                oNL.setData({
                  rows: _.range(8).map(function () {
                    return _.reduce(
                      aCols,
                      function (oC) {
                        return oC;
                      }, {}
                    );
                  }),
                  cols: aCols
                });
                var oTable = oDlgCLSetting.getContent()[0].byId("newLineTable");
                _.forEach(
                  oTable.getColumns(),
                  function (oCol) {
                    var oControl = null;
                    var oData = oCol.data();
                    function onDateChanged(oEvent) {
                      Log.error(oEvent.getSource().getId());
                    }
                    function handleValueHelp() {
                      MessageToast.show("Not yet implemented");
                    }
                    if (oData.isDate) {
                      oControl = new sap.m.DatePicker({
                        change: onDateChanged,
                        dateValue: "{NewLines>" + oData.name + "}"
                      });
                    } else {
                      oControl = new sap.m.Input({
                        showValueHelp: oData.isDim,
                        valueHelpRequest: handleValueHelp,
                        value: "{NewLines>" + oData.name + "}"
                      });
                    }
                    oCol.setTemplate(oControl);
                  }
                );
                fOpen.apply(oDlgCLSetting);
              });
            };
            return oDlg;
          }
        );
      });
    }
    return getDialog;
  });
