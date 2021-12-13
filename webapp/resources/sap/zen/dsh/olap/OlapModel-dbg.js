/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/olap/OlapModel",
  [
    "sap/base/Log",
    "sap/zen/dsh/utils/Utilities",
    "sap/ui/model/Model",
    "sap/ui/model/Context",
    "sap/zen/dsh/ValueType",
    "sap/zen/dsh/olap/SystemLandscape",
    "sap/zen/dsh/utils/SyncActionHelper",
    "sap/zen/dsh/utils/ResultSetHelper",
    "sap/zen/dsh/utils/ListHelper",
    "sap/zen/dsh/utils/ApplicationHelper",
    "sap/zen/dsh/olap/OlapListBinding",
    "sap/zen/dsh/olap/OlapListGridBinding",
    "sap/zen/dsh/olap/OlapPropertyBinding",
    "sap/zen/dsh/olap/DataProvider",
    "sap/zen/commons/SpreadSheet/Workbook",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/firefly/library"
  ], /* eslint-disable max-params */
  function (
    Log, Utilities, Model, Context, ValueType, SystemLandscape, SyncActionHelper, ResultSetHelper, ListHelper, ApplicationHelper, OlapListBinding, OlapListGridBinding,
    OlapPropertyBinding,
    DataProvider, Workbook, _
  )
  /* eslint-enable max-params */
  {
    "use strict";
    var rS2D = new RegExp("/", "g");
    /**
     * Constructor for a new OlapMode.
     *
     * The Olap Model allows to access and change data from servers providing the InA Protocol.
     *
     * @class
     * Model implementation for InA provider
     *
     * The OlapModel can populate it's exposed data via Binding to Controls. The structure of
     * the exposed data is as follows:
     *  <b>Structure of Exposed Data</b>
     *
     * <ul>
     * <li>FlatVariables: The list of all input ready variables collected from all aggregated <code>DataProvider</code></li>
     * <li>DataProvider: The associative array of all <code>DataProvider</code> aggregated by the <OlapModel> </li>
     * <li>semanticStyles: The associative array of all <code>SemanticStyle</code> for the <code>OlapModel</code>
     * <li>Messages: The list of all messages posted by the Analytical Engine
     * </ul>
     *
     * @param {object} [mSettings] the settings for the new Olap Model.
     *   <ul>
     *     <li>systemLandscape: The list of addressable Analytic Engines
     *     <li>dataProvider: The associative array of all <code>DataProvider</code> aggregated by the <OlapModel>
     *  </ul>
     * @extends sap.ui.model.Model
     * @author SAP SE
     * @version 1.96.0
     * @public
     * @alias sap.zen.dsh.olap.OlapModel
     */
    var OlapModel = Model.extend(
      "sap.zen.dsh.olap.OlapModel", {
        constructor: function (mSettings) {
          var that = this;
          Model.apply(that);
          var mSett = _.clone(mSettings || {});
          mSett.systemLandscape = mSett.systemLandscape || SystemLandscape;
          mSett.masterSystem = mSett.masterSystem || "localAbapAnalyticEngine";
          var oApplication = null;
          var oFireflyReady = Promise.resolve(null).then(function () {
            return ApplicationHelper.createApplication(mSett.systemLandscape, mSett.masterSystem);
          }
          ).then(function (o) {
            oApplication = o;
            oApplication.getSession().setXVersion(sap.firefly.XVersion.V190_METADATA_CUBE_RESPONSE_SUPPRESS_PROPERTIES );
            oApplication.getSession().deactivateFeatureToggle(sap.firefly.FeatureToggleOlap.FUSION_SERVICE);
            sap.firefly.XStream.of(sap.firefly.FeatureToggleOlap.getAllFeatureToggles()).forEach(function(toggle) {
              var xVersion = toggle.getXVersion();
              if(xVersion > sap.firefly.FeatureToggleOlap.FUSION_SERVICE.getXVersion() && xVersion <= sap.firefly.XVersion.MAX){
                oApplication.getSession().activateFeatureToggle(toggle);
              }
            });
          }
          ).then(function () {
            setData({
              HasUndo: false,
              systems: _.map(
                ListHelper.arrayFromList(
                  oApplication.getSystemLandscape().getSystemNames()
                ),
                function (s) {
                  return {
                    name: s
                  };
                }
              ),
              colLimit: -1,
              rowLimit: 125,
              dataProvider: {},
              variables: {},
              semanticStyles: {},
              messages: [],
              Functions: []
            });
          }
          );
          var oModelData = null;
          var oBindings = {};
          
          function setData(oData) {
            oModelData = oData;
            that.checkUpdate();
          }
          
          function updateUndo(b) {
            if (oModelData.HasUndo !== b) {
              oModelData.HasUndo = b;
              that.checkUpdate();
            }
          }
          that.setDataAccessLanguage = function(lang){
            var systemLandscape = oApplication.getSystemLandscape();
            var systemNames = systemLandscape.getSystemNames();
            for (var snk=0; snk<systemNames.size();snk++){
              systemLandscape.getSystemDescription(systemNames.get(snk)).setLanguage(lang);
            }
          };
          that.getLocalId = _.constant(null);
          that.getVariantManagementReferenceForControl = _.constant(null);
          that.bindProperty = function (sPath, oContext, mParameters) {
            var oBinding = new OlapPropertyBinding(that, sPath, oContext, mParameters);
            oBindings[oBinding.getId()] = oBinding;
            return oBinding;
          };
          that.bindList = function (sPath, oContext, aSorters, aFilters, mParameters) {
            if (sPath.match(/^(\/)?dataProvider\/(.)*\/Grid\/renderGrid/)) {
              return new OlapListGridBinding(
                that, sPath, oContext, aSorters, aFilters, mParameters
              );
            } else {
              return new OlapListBinding(
                that, sPath, oContext, aSorters, aFilters, mParameters
              );
            }
          };
          
          function _getObject(sPath, oContext) {
            var oNode = oContext instanceof Context ? _getObject(oContext.getPath()) : oModelData;
            if (sPath) {
              var s = sPath.replace(rS2D, ".");
              if (s.startsWith(".")) {
                s = s.replace(".", "");
              }
              return _.get(oNode, s);
            } else {
              return oNode;
            }
          }
          
          that.isList = function (sPath, oContext) {
            return Array.isArray(_getObject(that.resolve(sPath, oContext)));
          };
          that.setLimit = function (oLimit) {
            oModelData.rowLimit = oLimit.rowLimit;
            oModelData.colLimit = oLimit.colLimit;
            that.checkUpdate();
            return that;
          };
          that.getLimit = function () {
            return {
              rowLimit: oModelData.rowLimit,
              colLimit: oModelData.colLimit
            };
          };
          that.getProperty = function (sPath, oContext) {
            return _getObject(sPath, oContext);
          };
          that.getCurrentControlVariantIds = _.constant([]);
          that.checkDirtyStateForControlModels = _.constant(null);
          that.setProperty = function (sPath, sValue) {
            var bRes = false;
            var a = sPath.split("/");
            if (a[a.length - 1] === "DisplayValue") {
              var oDP = that.getDataProvider(a[2]);
              oDP.setPlanValue(parseInt(a[a.length - 2], 10), sValue);
            } else if (a[a.length - 1] === "visibleWithPrio") {
              var oV = oModelData.FlatVariables[parseInt(a[2], 10)];
              oV.visibleWithPrio = sValue;
            } else {
              var aPath = _.filter(
                sPath.split("/"), _.identity
              );
              try {
                var sLast = aPath.pop();
                var sP1 = aPath.join(".");
                var m1 = _.get(oModelData, sP1);
                if (sLast !== "vizProperties" || sValue) {
                  if (m1) {
                    m1[sLast] = sValue;
                  } else {
                    Log.warning("Failed to set " + sValue + " on: " + sPath);
                  }
                }
                that.checkUpdate();
                bRes = true;
              } catch (oError) {
                Log.error(oError);
              }
            }
            return bRes;
          };
          that.undo = function () {
            return oFireflyReady.then(
              function () {
                var fResolve;
                var fReject;
                if (!oModelData.HasUndo) {
                  return Promise.resolve(that);
                }
                
                function handle(resolve, reject) {
                  fResolve = resolve;
                  fReject = reject;
                }
                
                var oProm = new Promise(handle);
                oApplication.getUndoManager().processUndo(
                  sap.firefly.SyncType.NON_BLOCKING, {
                    undoRedoActionFinished: function (oRes) {
                      if (oRes.hasErrors()) {
                        fReject(oRes.getErrors());
                      } else {
                        fResolve(oRes);
                      }
                    }
                  }
                );
                return oProm.then(
                  function () {
                    return Promise.all(
                      _.map(
                        oModelData.dataProvider,
                        function (oDP) {
                          return oDP.getResultSet(true);
                        }
                      )
                    );
                  }
                ).then(
                  function () {
                    return that;
                  }
                );
              }
            );
          };
          that.redo = function () {
            return oFireflyReady.then(
              function () {
                var fResolve;
                var fReject;
                
                function handle(resolve, reject) {
                  fResolve = resolve;
                  fReject = reject;
                }
                
                var oProm = new Promise(handle);
                oApplication.getUndoManager().processRedo(
                  sap.firefly.SyncType.NON_BLOCKING, {
                    undoRedoActionFinished: function (oRes) {
                      if (oRes.hasErrors()) {
                        fReject(oRes.getErrors());
                      } else {
                        fResolve(oRes);
                      }
                    }
                  }
                );
                return oProm.then(
                  function () {
                    return Promise.all(
                      _.map(
                        oModelData.dataProvider,
                        function (oDP) {
                          return oDP.getResultSet(true);
                        }
                      )
                    );
                  }
                );
              }
            );
          };
          that.setSemanticStyles = function (o) {
            oModelData.semanticStyles = _.clone(o);
          };
          that.getSemanticStyles = function () {
            return oModelData.semanticStyles;
          };
          that.addMessages = function (aMsg) {
            oModelData.messages = _.map(_.groupBy(_.concat(oModelData.messages, aMsg), "Text"), function (o) {
              return o[0];
            });
            return that.checkUpdate();
          };
          that.clearMessages = function (bUpdateBindings) {
            oModelData.messages = [];
            return bUpdateBindings ? that.checkUpdate() : that;
          };
          that.checkUpdate = function (bForceUpdate) {
            _.forEach(
              oBindings,
              function (oBinding, sKey) {
                if (oBinding) {
                  oBinding.checkUpdate(bForceUpdate);
                } else {
                  delete oBindings[sKey];
                }
              }, false
            );
            return that;
          };
          that.checkMessages = function () {
            _.forEach(
              oBindings,
              function (oBinding) {
                return oBinding.checkDataState ? oBinding.checkDataState() : null;
              }
            );
          };
          that.addBinding = function (oBinding) {
            oBindings[oBinding.getId()] = oBinding;
            return that;
          };
          that.removeBinding = function (oBinding) {
            delete oBindings[oBinding.getId()];
          };
          that.getSystemId = function () {
            return that.getProperty(
              "/serverInfo/SystemId"
            );
          };
          that.getDataProvider = function (sName) {
            return oModelData.dataProvider[sName];
          };
          
          function updateVariables(oQueryManager) {
            var aFlatVar = _.map(
              ListHelper.arrayFromList(
                oQueryManager.getVariableProcessor().getVariables()
              ),
              ResultSetHelper.transformVariable
            ).filter(function (oV) {
              return oV.InputEnabled;
            });
            oModelData.variables = _.reduce(
              aFlatVar,
              function (oVariables, oVar) {
                var oH = oVariables[oVar.Name];
                if (oH) {
                  var b = oH.visibleWithPrio;
                  oVariables[oVar.Name] = oVar;
                  oVariables[oVar.Name].visibleWithPrio = b;
                } else {
                  oVariables[oVar.Name] = oVar;
                }
                return oVariables;
              }, oModelData.variables);
            oModelData.FlatVariables = _.filter(
              oModelData.variables,
              function (oV) {
                return oV.InputEnabled;
              });
            that.checkUpdate();
          }
          
          that.addSystem = function (mSystem) {
            return oFireflyReady.then(
              function () {
                ApplicationHelper.addSystem(oApplication, mSystem);
                return that;
              }
            );
          };
          that.addQuery = function (sDataProviderName, sQueryName, sSystem, sPackage, sSchema, sType) {
            return ensurePlanningService(
              sSystem
            ).then(
              function () {
                var oQueryConfigService = sap.firefly.QueryServiceConfig.createWithDataSourceName(
                  oApplication, null, sQueryName
                );
                oQueryConfigService.setMode(sap.firefly.QueryManagerMode.DEFAULT);
                oQueryConfigService.setProviderType(sap.firefly.ProviderType.ANALYTICS);
                oQueryConfigService.setSupportsDimensionLazyLoad(true);
                var sDataSourceName = [
                  (sType || "query"), ":",
                  (sSchema ? "[" + sSchema + "]" : ""),
                  ((sSchema || sPackage) ? "[" + sPackage + "]" : ""),
                  "[", sQueryName, "]"
                ].join("");
                oQueryConfigService.setDataSourceByName(sDataSourceName);
                if (sSystem) {
                  oQueryConfigService.setSystemName(sSystem);
                }
                return SyncActionHelper.syncActionToPromise(
                  oQueryConfigService.processQueryManagerCreation,
                  oQueryConfigService,
                  []
                );
              }
            ).then(
              function (oQueryManager) {
                oModelData.dataProvider[sDataProviderName] = new DataProvider(
                  that, updateVariables, updateUndo, oApplication, oQueryManager, sDataProviderName
                );
                var aFlatVar = _.map(
                  ListHelper.arrayFromList(
                    oApplication.getOlapEnvironment().getVariableProcessor().getVariables()
                  ),
                  ResultSetHelper.transformVariable
                );
                oModelData.variables = _.reduce(
                  aFlatVar,
                  function (oVariables, oVar) {
                    oVariables[oVar.Name] = oVar;
                    return oVariables;
                  }, oModelData.variables);
                oModelData.FlatVariables = _.filter(
                  oModelData.variables,
                  function (oV) {
                    return oV.InputEnabled;
                  });
                return that.checkUpdate();
              });
          };
          that.setVariableValue = function (sVariable, aRange) {
            _.forEach(
              oModelData.dataProvider,
              function (oDP) {
                if (oDP.isVariableInputEnabled(sVariable)) {
                  oDP.setVariableValue(sVariable, aRange);
                }
              });
          };
          that.deserialize = function (o) {
            oModelData.dataProvider = {};
            oModelData.semanticStyles = o.semanticStyles || [];
            oModelData.Functions = o.Functions || [];
            return oFireflyReady.then(
              function () {
                return Promise.all(
                  _.map(
                    o.DataProvider,
                    function (sDef, sName) {
                      var oQueryConfigService = sap.firefly.QueryServiceConfig.createByDefinition(
                        oApplication, null, sap.firefly.XContent.createStringContent(sap.firefly.QModelFormat.INA_REPOSITORY, sDef)
                      );
                      return SyncActionHelper.syncActionToPromise(
                        oQueryConfigService.processQueryManagerCreation,
                        oQueryConfigService,
                        []
                      ).then(
                        function (oQueryManager) {
                          oModelData.dataProvider[sName] = new DataProvider(
                            that, updateVariables, updateUndo,
                            oApplication, oQueryManager, sName
                          );
                          var aFlatVar = _.map(
                            ListHelper.arrayFromList(
                              oApplication.getOlapEnvironment().getVariableProcessor().getVariables()
                            ),
                            ResultSetHelper.transformVariable
                          );
                          oModelData.variables = _.reduce(
                            aFlatVar,
                            function (oVariables, oVar) {
                              oVariables[oVar.Name] = oVar;
                              return oVariables;
                            }, oModelData.variables);
                          oModelData.FlatVariables = _.filter(
                            oModelData.variables,
                            function (oV) {
                              return oV.InputEnabled;
                            });
                          return that.checkUpdate();
                        });
                    }
                  ));
              }
            ).then(function () {
              return that.checkUpdate();
            });
          };
          that.serialize = function () {
            return {
              DataProvider: _.reduce(
                oModelData.dataProvider,
                function (oC, o) {
                  oC[o.Name] = o.serialize();
                  return oC;
                }, {}
              ),
              semanticStyles: that.getSemanticStyles(),
              Functions: oModelData.Functions
            };
          };
          that.openVariableSelector = function (sVar) {
            return Promise.resolve(null).then(function () {
              var oDP = _.find(
                oModelData.dataProvider,
                function (o) {
                  return o.hasVariableValueHelp(oModelData.variables[sVar].TechName);
                });
              if (!oDP) {
                throw new Error("Invalid Variable: " + sVar);
              }
              return oDP.openVariableSelector(sVar).then(function (aSelection) {
                if (!aSelection) {
                  return false;
                }
                _.forEach(oModelData.dataProvider, function (oDP) {
                  oDP.applySelectionToVariable(sVar, aSelection);
                });
                return true;
              });
            });
          };
          that.submitVariables = function () {
            return Promise.all(
              _.invokeMap(
                oModelData.dataProvider,
                "submitVariables"
              )
            ).then(function () {
              Log.info("All variables submitted");
            });
          };
          that.logoff = function () {
            Log.info("Log off not implemented");
          };
          var oPlanningService;
          
          function ensurePlanningService(sSystem, sDataAreaName) {
            return oFireflyReady.then(
              function () {
                if (oPlanningService) {
                  return oPlanningService;
                }
                if (sSystem) {
                  return null;
                }
                var oPlanningDataSource = sap.firefly.QDataSource.create();
                oPlanningDataSource.setDataArea(sDataAreaName || "MY_DATA_AREA");
                var oPlanningServiceConfig = sap.firefly.OlapApiModule.SERVICE_TYPE_PLANNING.createServiceConfig(oApplication);
                oPlanningServiceConfig.setDataSource(oPlanningDataSource);
                oPlanningServiceConfig.setSystemName(sSystem || mSett.masterSystem);
                return SyncActionHelper.syncActionToPromise(
                  oPlanningServiceConfig.processServiceCreation,
                  oPlanningServiceConfig,
                  []
                ).then(
                  function (oExtResult) {
                    oPlanningService = oExtResult.getData();
                    return oPlanningService;
                  }
                );
              }
            );
          }
          
          that.saveBuffer = function () {
            return ensurePlanningService().then(
              function (oPlanningService) {
                var pfs = oPlanningService.getPlanningContext().createCommandPublish();
                var fResolve, fReject;
                
                function handleDialog(resolve, reject) {
                  fResolve = resolve;
                  fReject = reject;
                }
                
                pfs.processCommand(sap.firefly.SyncType.NON_BLOCKING, {
                  onCommandProcessed: function (oRes) {
                    if (oRes.hasErrors()) {
                      fReject(oRes.getErrors());
                    } else {
                      fResolve(oRes);
                    }
                  }
                });
                return new Promise(handleDialog);
              });
          };
          that.resetBuffer = function () {
            return ensurePlanningService().then(
              function (oPlanningService) {
                var pfs = oPlanningService.getPlanningContext().createCommandReset();
                var fResolve, fReject;
                
                function handleDialog(resolve, reject) {
                  fResolve = resolve;
                  fReject = reject;
                }
                
                pfs.processCommand(sap.firefly.SyncType.NON_BLOCKING, {
                  onCommandProcessed: function (oRes) {
                    if (oRes.hasErrors()) {
                      fReject(oRes.getErrors());
                    } else {
                      fResolve(oRes);
                    }
                  }
                });
                return new Promise(handleDialog);
              });
          };
          that.processServiceFunction = function (sServiceName, mVariableMapping) {
            Log.info("VariableMapping: " + !!mVariableMapping);
            var fResolve, fReject;
            
            function handleDialog(resolve, reject) {
              fResolve = resolve;
              fReject = reject;
            }
            
            return ensurePlanningService().then(function (oPlanningService) {
              var pf = oPlanningService.getPlanningContext().createPlanningFunctionIdentifier(sServiceName);
              var pfs = oPlanningService.getPlanningContext().createRequestCreatePlanningFunction(pf);
              pfs.processCommand(sap.firefly.SyncType.NON_BLOCKING, {
                onCommandProcessed: function (oRes) {
                  if (oRes.hasErrors()) {
                    fReject(oRes.getErrors());
                  } else {
                    fResolve(oRes);
                  }
                }
              });
              return new Promise(handleDialog);
            }).then(
              function (oRes) {
                var oService = oRes.getData().getCreatedPlanningFunction();
                if (oService.getVariableContainer().hasInputEnabledVariables()) {
                  sap.firefly.VdDragonflyEntryPoint.createEntryPoint(
                    oService.getText() || sServiceName, oService.getVariableProcessor(), {
                      onRenderDone: _.constant(null),
                      onBeforeSubmit: _.constant(null),
                      onOk: function () {
                        try {
                          fResolve(oService);
                        } catch (oError) {
                          fReject(oError);
                        }
                      },
                      onCancel: function () {
                        fResolve(null);
                      }
                    }).open();
                  return new Promise(handleDialog);
                } else {
                  return oService;
                }
              }
            ).then(
              function (oService) {
                var oProm = new Promise(handleDialog);
                if (oService) {
                  oService.processCommand(
                    sap.firefly.SyncType.NON_BLOCKING, {
                      onCommandProcessed: function (oRes) {
                        that.clearMessages();
                        var aMsg = ListHelper.arrayFromList(
                          oRes.getMessages()
                        ).map(
                          function (o) {
                            var sSeverity = o.getSeverity().getName();
                            if (sSeverity === "Info") {
                              sSeverity = "Information";
                            }
                            return {
                              Text: o.getText(),
                              Severity: sSeverity,
                              Code: o.getCode(),
                              MessageClass: o.getMessageClass(),
                              LongTextUri: o.getMessageClass() ? [
                                "/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID='",
                                encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), ",',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
                              ].join("") : null
                            };
                          }
                        );
                        that.checkUpdate(true);
                        fResolve(aMsg);
                      }
                    }
                  );
                } else {
                  fResolve([]);
                }
                return oProm;
              });
          };
          that.processServiceSequence = function (sServiceName, mVariableMapping) {
            Log.info("VariableMapping: " + !!mVariableMapping);
            var fResolve, fReject;
            
            function handleDialog(resolve, reject) {
              fResolve = resolve;
              fReject = reject;
            }
            
            return ensurePlanningService().then(function (oPlanningService) {
              var pf = oPlanningService.getPlanningContext().createPlanningSequenceIdentifier(sServiceName);
              var pfs = oPlanningService.getPlanningContext().createRequestCreatePlanningSequence(pf);
              pfs.processCommand(sap.firefly.SyncType.NON_BLOCKING, {
                onCommandProcessed: function (oRes) {
                  if (oRes.hasErrors()) {
                    fReject(oRes.getErrors());
                  } else {
                    fResolve(oRes);
                  }
                }
              });
              return new Promise(handleDialog);
            }).then(
              function (oRes) {
                var oService = oRes.getData().getCreatedPlanningSequence();
                if (oService.getVariableContainer().hasInputEnabledVariables()) {
                  sap.firefly.VdDragonflyEntryPoint.createEntryPoint(
                    oService.getText() || sServiceName, oService.getVariableProcessor(), {
                      onRenderDone: _.constant(null),
                      onBeforeSubmit: _.constant(null),
                      onOk: function () {
                        try {
                          fResolve(oService);
                        } catch (oError) {
                          fReject(oError);
                        }
                      },
                      onCancel: function () {
                        fResolve(null);
                      }
                    }).open();
                  return new Promise(handleDialog);
                } else {
                  return oService;
                }
              }
            ).then(
              function (oService) {
                var oProm = new Promise(handleDialog);
                if (oService) {
                  oService.processCommand(
                    sap.firefly.SyncType.NON_BLOCKING, {
                      onCommandProcessed: function (oRes) {
                        that.clearMessages();
                        var aMsg = ListHelper.arrayFromList(
                          oRes.getMessages()
                        ).map(
                          function (o) {
                            var sSeverity = o.getSeverity().getName();
                            if (sSeverity === "Info") {
                              sSeverity = "Information";
                            }
                            return {
                              Text: o.getText(),
                              Severity: sSeverity,
                              Code: o.getCode(),
                              MessageClass: o.getMessageClass(),
                              LongTextUri: o.getMessageClass() ? [
                                "/sap/opu/odata/iwbep/message_text;o=LOCAL/T100_longtexts(MSGID='",
                                encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), ",',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
                              ].join("") : null
                            };
                          }
                        );
                        that.checkUpdate(true);
                        fResolve(aMsg);
                      }
                    }
                  );
                } else {
                  fResolve([]);
                }
                return oProm;
              });
          };
          that.synchronize = function (aDPNames) {
            var aTargets = aDPNames ? (function () {
              var oTarget = _.reduce(
                aDPNames,
                function (o, s) {
                  o[s] = true;
                  return o;
                },
                {}
              );
              return _.filter(
                oModelData.dataProvider,
                function (o, s) {
                  return oTarget[s] === true;
                });
            }()) : oModelData.dataProvider;
            return Promise.all(
              _.invokeMap(
                aTargets,
                "getResultSet"
              )
            ).then(
              function () {
                return that.checkUpdate();
              }
            );
          };
          that.openQueryDialog = function () {
            return Utilities.getDialogs().then(
              function (oDialogs) {
                return oDialogs.Open.openQuery(that);
              });
          };
          that.getPlanningFunctionCatalog = function (sText) {
            var fResolve, fReject;
            
            function handleDialog(resolve, reject) {
              fResolve = resolve;
              fReject = reject;
            }
            
            var oServiceConfig = sap.firefly.OlapCatalogApiModule.SERVICE_TYPE_PLANNING_CATALOG.createServiceConfig(oApplication);
            oServiceConfig.setSystemName(mSett.masterSystem);
            var oExtResult = oServiceConfig.processPlanningCatalogManagerCreation(
              sap.firefly.SyncType.BLOCKING, null, null);
            if (oExtResult.hasErrors()) {
              throw new Error(oExtResult);
            }
            var olapCatalogManager = oExtResult.getData();
            if (sText) {
              olapCatalogManager.setSearchOnName(true);
              olapCatalogManager.setSearchFilter(sText);
            }
            olapCatalogManager.processGetResult(sap.firefly.SyncType.NON_BLOCKING, {
              onPlanningCatalogResult: function (oExtResult) {
                try {
                  if (oExtResult.hasErrors()) {
                    return fReject(oExtResult.getErrors());
                  }
                  var oResult = oExtResult.getData();
                  var aList = [];
                  var oIterator = oResult.getObjectsIterator();
                  while (oIterator.hasNext()) {
                    var oItem = oIterator.next();
                    aList.push({
                      key: oItem.getObjectNameKey(),
                      DisplayKey: oItem.getObjectNameKey(),
                      Description: oItem.getObjectNameLongText()
                    });
                  }
                  fResolve({
                    description: "",
                    catalog: aList
                  });
                } catch (oError) {
                  fReject(oError);
                }
              }
            });
            return new Promise(handleDialog);
          };
          that.openSelectFunction = function () {
            return Utilities.getDialogs().then(
              function (oDialogs) {
                return oDialogs.SelectPlanningFunction.selectPlanningFunction(that);
              });
          };
          that.addFunction = function (sName, sText) {
            oModelData.Functions.push({
              Name: sName,
              Text: sText
            });
            that.checkUpdate(true);
            return that;
          };
          that.removeFunction = function (sName) {
            oModelData.Functions = _.filter(that.Functions, function (o) {
              return o.Name !== sName;
            });
            that.checkUpdate(true);
            return that;
          };
          that.getPlanningService = function () {
            return oPlanningService;
          };
          that.getCatalog = function (sText, sSystem, sType) {
            return oFireflyReady.then(
              function () {
                if (!sSystem) {
                  return [];
                }
                var fResolve, fReject;
                
                function handleDialog(resolve, reject) {
                  fResolve = resolve;
                  fReject = reject;
                }
                
                var fCatResolve, fCatReject;
                
                function handleCatalog(resolve, reject) {
                  fCatResolve = resolve;
                  fCatReject = reject;
                }
                
                var oProm1 = new Promise(handleCatalog);
                var oServiceConfig = sap.firefly.OlapCatalogApiModule.SERVICE_TYPE_OLAP_CATALOG.createServiceConfig(oApplication);
                oServiceConfig.setSystemName(sSystem);
                oServiceConfig.processLightweightOlapCatalogManagerCreation(
                  sap.firefly.SyncType.NON_BLOCKING,
                  function (oRes) {
                    if (oRes.hasErrors()) {
                      fCatReject(oRes.getErrors());
                    } else {
                      fCatResolve(oRes.getData());
                    }
                  }
                );
                return oProm1.then(
                  function (olapCatalogManager) {
                    olapCatalogManager.setResultMaxSize(10);
                    olapCatalogManager.setResultOffset(0);
                    olapCatalogManager.setSelectedType(sap.firefly.MetaObjectType[sType]);
                    olapCatalogManager.setTransientInfoProvidersIncluded(true);
                    if (sText) {
                      olapCatalogManager.setSearchOnName(true);
                      olapCatalogManager.setSearchFilter(sText);
                    }
                    var oProm = new Promise(handleDialog);
                    olapCatalogManager.processGetResult(
                      sap.firefly.SyncType.NON_BLOCKING,
                      {
                        onOlapCatalogResult: function (oExtResult) {
                          if (oExtResult.hasErrors()) {
                            return fReject(oExtResult.getErrors());
                          }
                          var oResult = oExtResult.getData();
                          var aList = [];
                          var oIterator = oResult.getObjectsIterator();
                          while (oIterator.hasNext()) {
                            var oItem = oIterator.next();
                            aList.push({
                              key: oItem.getName(),
                              DisplayKey: oItem.getName(),
                              Description: oItem.getText(),
                              Package: oItem.getPackageName(),
                              Schema: oItem.getSchemaName(),
                              Type: oItem.getType().getName()
                            });
                          }
                          return fResolve({
                            description: "",
                            catalog: aList
                          });
                        }
                      }
                    );
                    return oProm;
                  }
                );
              }
            );
          };
          that.exportToExcel = function (sTitle) {
            var oWB = new Workbook();
            return Promise.resolve(
              null
            ).then(
              function () {
                return Promise.all(
                  _.map(
                    oModelData.dataProvider,
                    function (oDP) {
                      return oDP.exportToExcel(oWB);
                    }
                  )
                );
              }
            ).then(
              function () {
                oWB.save(sTitle || "Download.xlsx");
                return that;
              }
            );
          };
          (function () {
            var oProm = oFireflyReady.then(
              function () {
                if (mSettings && mSettings.SemanticStyles) {
                  that.setSemanticStyles(mSettings.SemanticStyles);
                }
                return Promise.all(
                  _.map(
                    mSett.dataProvider || [],
                    function (oD, sName) {
                      var oRes = that.addQuery(
                        sName, oD.dataSourceName, oD.systemName, oD.packageName, oD.schemaName, oD.dataSourceType
                      );
                      return oD.synchronize ? oRes.then(function () {
                        return that.getDataProvider(sName).synchronize();
                      }) : oRes;
                    }
                  )
                );
              }
            );
            that.resetModel = function () {
              _.forEach(
                oModelData.dataProvider,
                function (oDP) {
                  oDP.resetToDefault();
                });
            };
            that.dataLoaded = _.constant(oProm);
            that.loaded = that.dataLoaded;
            that.metadataLoaded = that.dataLoaded;
            that.annotationsLoaded = that.dataLoaded;
            that.getMetaModel = _.constant(that);
            that.attachMetadataFailed = _.constant(null);
            that.fireMetadataFailed = _.constant(null);
            that.getODataEntityContainer = _.constant(null);
            that.getODataEntityType = _.constant(that);
            that.createBindingContext = _.constant(null);
            that.getODataEntitySet = _.constant(that);
          }()
          );
        },
        metadata: {
          publicMethods: [
            "openVariableSelector",
            "submitVariables",
            "saveBuffer",
            "resetBuffer",
            "processServiceFunction",
            "processServiceSequence",
            "synchronize",
            "openQueryDialog",
            "getPlanningFunctionCatalog",
            "openSelectFunction",
            "addFunction",
            "removeFunction",
            "addQuery",
            "serialize",
            "deserialize",
            "setLimit",
            "getLimit",
            "getDataProvider"
          ],
          events: {
            metadataFailed: {}
          }
        }
      }
    );
    /**
     * Let the user choose a value for a variable in a dialog
     * @param {string} sVar the name of the variable
     * @return {Promise<string>} the selecte value
     * @public
     */
    OlapModel.prototype.openVariableSelector = function () {
    };
    /**
     * Replace all input enabled variables with their entered values for all datat providers
     * @return {Promise<this>}the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.submitVariables = function () {
    };
    /**
     * Save the data buffer
     * @return {Promise<this>} the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.saveBuffer = function () {
    };
    /**
     * Reset the data buffer
     * @return {Promise<this>} the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.resetBuffer = function () {
    };
    /**
     * Process a data function, in case the function requires additional values, prompt the use in a dialogue
     * @param {string} sServiceName the name of the data function
     * @return {Promise<this>} the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.processServiceFunction = function () {
    };
    /**
     * Process a data sequence, in case the sequence requires additional values, prompt the use in a dialogue
     * @param {string} sServiceName the name of the data function
     * @return {Promise<this>} the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.processServiceSequence = function () {
    };
    /**
     * snychronize all aggregated dataproviders
     * if the user does not choose an Analytic Query, then the promise is rejected
     * @param {string[]} aDataProviderNames List of data provider that are to be synchronized (all if not supplied)
     * @return {Promise<sap.zen.dsh.olap.OlapModel>} the OlapModel, to allow chaining
     * @public
     */
    OlapModel.prototype.synchronize = function () {
    };
    /**
     * Display a dialog to allow the user to select an Analytic Query, returns a Promise containing the name,
     * if the user does not choose an Analytic Query, then the promise is rejected
     * @return {Promise<string>} the name of the <a href=https://help.sap.com/doc/saphelp_nw70/7.0.31/en-US/46/0278c96fd33d54e10000000a155369/frameset.htm" >Analytic Query</a>
     * @public
     */
    OlapModel.prototype.openQueryDialog = function () {
    };
    /**
     * retreive the list of data functions matching a given text
     * @param {string} sText the pattern that the description of the data function must match
     * @return {Promise<Object[]>} Promise of a list of name, description strings describing the retrieved data functions.
     * @public
     */
    OlapModel.prototype.getPlanningFunctionCatalog = function () {
    };
    /**
     * Display a dialog to allow the user to select a data function, returns a Promise containing the name,
     * if the user does not choose a data function, then the promise is rejected
     * @return {Promise<string>} the name of the <a href="https://help.sap.com/doc/saphelp_nw73ehp1/7.31.19/en-US/4c/acf4b354423b9fe10000000a42189b/frameset.htm" >Data Function</a>
     * @public
     */
    OlapModel.prototype.openSelectFunction = function () {
    };
    /**
     * @param {string} sName the name of the data function
     * @return {sap.zen.dsh.olap.OlapModel} the <code> OlapModel </code> to allow chaining
     * @public
     */
    OlapModel.prototype.removeFunction = function () {
    };
    /**
     * @param {string} sName the name of the data function
     * @param {string} sText the description of the data function
     * @return {sap.zen.dsh.olap.OlapModel} the <code> OlapModel </code> to allow chaining
     * @public
     */
    OlapModel.prototype.addFunction = function () {
    };
    /**
     * @param {object} oLimit the limit of the rows and columns that are exposed for bindings
     * @return {sap.zen.dsh.olap.OlapModel} the <code> OlapModel </code> to allow chaining
     * @public
     */
    OlapModel.prototype.setLimit = function () {
    };
    /**
     * @return {object} the limit of the rows and columns that are exposed for bindings
     * @public
     */
    OlapModel.prototype.getLimit = function () {
    };
    /**
     * serialize the Model with all aggregated <code>DataProvider</code>
     * The <code>OlapModel</code> be be deserialized from an equivalent such Object.
     * @return {object} a javascript object which represents the <code>OlapModel</code>.
     * @public
     */
    OlapModel.prototype.serialize = function () {
    };
    /**
     * deserialize the Model with all aggregated <code>DataProvider</code>
     * The <code>OlapModel</code> be be deserialized from an equivalent such Object.
     * @return {object} a javascript object which represents the <code>OlapModel</code> and which can be JSON stringified.
     * @public
     */
    OlapModel.prototype.deserialize = function () {
    };
    /**
     * adds a new query as a new System to the System Landscape .
     * The parameter should have the following properties:
     * <ul>
     *   <li> systemName <- the name of the system</li>
     *   <li> systemType <- "BW" | "HANA" | "DWC" | "WASABI" </li>
     *   <li> host <- the host of the system</li>
     *   <li> port <- the port
     *   <li> protocol <- "WASABI" | "HTTP" | "HTTPS"
     *   <li> client <- the client of the ABAP system </li>
     * </ul>
     * @param {object} mSystem The Definition of the system
     * @public
     * @returns {Promise<sap.zen.dsh.olap.DataProvider>} the Data Provider that was created
     */
    OlapModel.prototype.addSystem = function () {
    };
    /**
     * adds a new query as a new <code>DataProvider</code> .
     * The query is supposed to be defined as an analytical annotated
     *  <a href="https://help.sap.com/viewer/cc0c305d2fab47bd808adcad3ca7ee9d/LATEST/en-US/c2dd92fb83784c4a87e16e66abeeacbd.html targte="_blank">CDS View </a>
     * the naem of the query is the name of the DDIC view, prefixed by "2C"
     * @param {string} sDataProviderName  the name of the new <code>DataProvider</code>.
     * @param {string} sQueryName the name of the query which the <code>DataProvider</code> is supposed to expose.
     * @param {string} [sSystem] the name of the system in the landscape
     * @param {string} [sPackage] the name of the package
     * @param {string} [sSchema] the name of the schema
     * @param {string} [sType] the name of the type of the datasource
     * @public
     * @returns {Promise<sap.zen.dsh.olap.DataProvider>} the Data Provider that was created
     */
    OlapModel.prototype.addQuery = function () {
    };
    /**
     * undoes the last navigation step.
     * @returns {Promise<this>} the Olap Model
     * @public
     */
    OlapModel.prototype.undo = function () {
    };
    /**
     * retrieves a <code>DataProvider</code> aggregated by the <code>OlapModel</code>.
     *  sQueryName, sSystem
     * @param {string} sDataProviderName the name of the <code>DataProvider</code>.
     * @returns {sap.zen.dsh.olap.DataProvider} the Data Provider that was requested
     * @public
     */
    OlapModel.prototype.getDataProvider = function () {
    };
    /**
     * exports the Olap Model to excel
     * @param {string} WorkbookName the Name of the exported Workbook
     * @returns {Promise<this>} Promise of this to allow chaining
     * @public
     */
    OlapModel.prototype.exportToExcel = function () {
    };
    
    /**
     *  Reset the Olap Model to the default query
     *  @public
     */
    OlapModel.prototype.resetModel = function () {};
    /**
     * @param {string} Language code to be used in the subsequent data access calls
     */
    OlapModel.prototype.setDataAccessLanguage = function () {};
    return OlapModel;
  }
);
