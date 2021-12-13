/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise */
sap.ui.define(
  "sap/zen/dsh/rsrt/utils/Utilities",
  [
    "sap/base/Log",
    "sap/ui/core/Component",
    "sap/zen/dsh/utils/TokenHelper",
    "sap/zen/dsh/ValueType",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/core/Fragment",
    "sap/zen/dsh/rsrt/controller/AxisAction.controller",
    "sap/zen/dsh/utils/ResourceBundle",
    "sap/zen/dsh/olap/OlapModel",
    "sap/zen/commons/thirdparty/lodash",
    "sap/ushell/library"
  ],
  function (Log, Component,TokenHelper, ValueType, HashChanger, Fragment, AxisActionController, ResourceBundle, OlapModel, _) {
    "use strict";
    var oHashChanger = new HashChanger();
    var Utilities = function (oComponent) {
      var that = this;
      function getParamValue(o,s){
        return Array.isArray(o[s])?o[s][0]: o[s];
      }
      var oCompData = null;
      var bStartupRead = false;
      that.readComponentData = function(){
        oCompData = (
          function(){
            if( !bStartupRead &&oComponent.getComponentData() && oComponent.getComponentData().startupParameters ){
              var oSP = oComponent.getComponentData().startupParameters;
              bStartupRead = true;
              return {
                name: getParamValue(oSP, "name"),
                systemName: getParamValue(oSP, "systemName"),
                systemType: getParamValue(oSP, "systemType"),
                package: getParamValue( oSP, "package" ),
                schema: getParamValue( oSP, "schema" ),
                host: getParamValue( oSP, "host" ),
                type: getParamValue( oSP, "type" ),
                port: getParamValue( oSP, "port" ),
                path: getParamValue( oSP, "path" ),
                protocol: getParamValue( oSP, "protocol" ) || (window.location.protocol === "http:" ? "HTTP" : "HTTPS")
              };
            } else {
              return {
                name: oComponent.getDataSourceName(),
                systemName: oComponent.getSystemName(),
                systemType: oComponent.getSystemType(),
                package: oComponent.getPackageName(),
                schema: oComponent.getSchemaName(),
                host: oComponent.getHost(),
                type: oComponent.getDataSourceType(),
                port: oComponent.getPort(),
                path: oComponent.getPath(),
                protocol: oComponent.getProtocolType() || (window.location.protocol === "http:" ? "HTTP" : "HTTPS")
              };
            }
          }());
      };
      that.attachFragments = function(){
        return oComponent.runAsOwner(
          function () {
            return Promise.all(
              _.map(
                [
                  {
                    name: "sap.zen.dsh.rsrt.fragments.Messages",
                    controller: oComponent.getRootControl().getController()
                  },
                  {
                    name: "sap.zen.dsh.rsrt.fragments.Share",
                    controller: oComponent.getRootControl().getController()
                  },
                  {
                    name: "sap.zen.dsh.rsrt.fragments.ASFA",
                    controller: oComponent.getRootControl().getController()
                  },
                  {
                    name: "sap.zen.dsh.rsrt.fragments.AxisActionMenu",
                    controller: AxisActionController
                  },
                  {
                    name: "sap.zen.dsh.rsrt.fragments.ChartSettings",
                    controller: {
                      onApply: function () {
                        oComponent.getChartSettings()._prom.resolve(oComponent.getChartSettings()._updater);
                      },
                      onOk: function () {
                        oComponent.getChartSettings()._prom.resolve(oComponent.getChartSettings()._updater);
                        oComponent.getChartSettings().close();
                      }
                    }
                  }
                ],
                Fragment.load
              )
            );
          }
        ).then(
          function (aFrags) {
            oComponent.getMsg = _.constant(aFrags[0]);
            oComponent.getASShare = _.constant(aFrags[1]);
            oComponent.getASFA = _.constant(aFrags[2]);
            oComponent.getAxisActionMenu = _.constant(aFrags[3]);
            oComponent.getChartSettings = _.constant(aFrags[4]);
            oComponent.getChartSettings().openDialog = function (oUpdater) {
              function Defer() {
                var that = this;
                function handle(resolve, reject) {
                  that.resolve = resolve;
                  that.reject = reject;
                }
                that.promise = new Promise(handle);
              }
              oComponent.getChartSettings()._prom = new Defer();
              oComponent.getChartSettings()._updater = oUpdater;
              oComponent.getChartSettings().open();
              return oComponent.getChartSettings()._prom.promise;
            };
            _.forEach(aFrags, function (oFrag) {
              oComponent.getRootControl().addDependent(oFrag);
            });
          }
        );
      };
      that.adjustLandscape = function(){
        if( oCompData.systemType ) {
          oComponent.getModel("om").addSystem(oCompData);
        }
      };
      that.getPersonalizer = function(){
        if (!sap.ushell.Container) {
          return {
            getPersData: _.constant(null)
            //Something with locaStorage?
          };
        }
        var oPersonalizationService = sap.ushell.Container.getService( "Personalization");
        var oScope = {
          keyCategory: oPersonalizationService.constants.keyCategory.FIXED_KEY,
          writeFrequency: oPersonalizationService.constants.writeFrequency.LOW,
          clientStorageAllowed: true
        };
        if (!oComponent.getComponentData().startupParameters.query && !oComponent.getComponentData().startupParameters.package) {
          return {
            getPersData: _.constant(null)
          };
        }
        var oPersId = {
          container: "sap.zen.dsh.rsrt",
          item:[
            "system:", "[", (oCompData.systemName || ""),"]",
            oCompData.type || "query:",
            "[",
            oCompData.schema || "",
            "][",
            oCompData.package ||"",
            "][",
            oCompData.name,
            "]"
          ].join(".")
        };
        return oPersonalizationService.getPersonalizer(oPersId, oScope, oComponent);
      };
      that.handleFexAnalysis = function(){
        if (window.___sapfinFlexAnal) {
          var o = {
            isFlex: true,
            om: {
              DataProvider: {},
              semanticStyles: window.___sapfinFlexAnal.om.semanticStyles
            }
          };
          o.om.DataProvider["0"] = window.___sapfinFlexAnal.om.DataProvider[window.___sapfinFlexAnal.dpName];
          delete window.___sapfinFlexAnal;
          return o;
        }
        return false;
      };
      that.openFlexAnalyis = function(oDataSource){
        if(oDataSource.isFlex){
          return oComponent.getModel("om").deserialize(
            oDataSource.om
          ).then(function () {
            return oComponent.getModel("om").submitVariables();
          }).then(function () {
            return oComponent.getModel("om").synchronize();
          });
        }else{
          return Promise.resolve(false);
        }
      };
      that.determineDataSource = function(){
        return that.loadAppState(
        ).then(
          function(b){
            if(b){
              return b;
            }
            return that.handleFexAnalysis(that);
          }
        ).then(
          function(b){
            if(b){
              return b;
            }
            return oCompData.name ? oCompData :oComponent.getModel("om").openQueryDialog();
          }
        );
      };
      that.adjustTitle = function(){
        if (sap.ushell.Container) {
          return oComponent.getService(
            "ShellUIService"
          ).then(
            function (oService) {
              var oDP = oComponent.getModel("om").getDataProvider(0);
              if (oDP && oService) {
                oService.setTitle(
                  ResourceBundle.getText("PREVIEW", [oComponent.getModel("om").getDataProvider(0).QueryTitle])
                );
              }
            }
          ).then(
            function () {
              oComponent.getRootControl().getModel().setProperty("/hasShellContainer", true);
            }
          ).catch(
            function (e) {
              Log.info("No Shell Service");
              Log.debug(e);
            }
          );
        }
        return null;
      };
      that.loadDataSource = function(oDataSource) {
        if(oDataSource instanceof OlapModel){ //It was deserialized earlier
          return oDataSource;
        }
        if(!oDataSource){
          throw new Error(ResourceBundle.getText("NO_DATASOURCE_SPECIFIED"));
        }
        return that.openFlexAnalyis(
          oDataSource
        ).then(
          function(b){
            return b || oComponent.getModel("om").addQuery(
              "0",
              oDataSource.name,
              oDataSource.systemName,
              oDataSource.package,
              oDataSource.schema,
              oDataSource.type
            );
          }
        );
      };
      that.terminateApplication = function(oError){
        Log.error(oError);
        oComponent.getRootControl().setBusy(false);
        if(sap.ushell.Container){
          sap.ushell.Container.getService(
            "CrossApplicationNavigation"
          ).toExternal(
            {
              target: {
                semanticObject: "Shell",
                action: "home"
              },
              params: {},
              writeHistory: true
            }
          );
        }
      };
      that.adjustFilterBar = function(){
        var oView = oComponent.getRootControl();
        var oOM = oComponent.getModel("om");
        var oSP = oComponent.getComponentData() ? oComponent.getComponentData().startupParameters : {};
        oComponent.getModel().setProperty("/showGraph",!!getParamValue(oSP, "showGraph"));
        oComponent.getModel().setProperty("/showMap",!!getParamValue(oSP, "showMap"));
        _.forEach(
          oView.byId("VariableBar").getFilterGroupItems(),
          function (oFG) {
            var oV = oOM.getProperty("/variables/" + encodeURIComponent(
              oFG.getName()
            ));
            oFG.setMandatory(
              oV.Mandatory
            );
            var aItems = oFG.getControl().getItems();
            var oMI = aItems[1];
            var oDR = aItems[0];
            var oDP = aItems[2];
            oMI.setVisible(oV.ValueType !== ValueType.Date);
            oDR.setVisible(oV.ValueType === ValueType.Date && oV.SupportsMultipleValues);
            oDP.setVisible(oV.ValueType === ValueType.Date && !oV.SupportsMultipleValues);
            if(oDP.getVisible()){
              _.forEach(
                oV.MemberFilter, function (o) {
                  oDP.setDateValue( TokenHelper.datsToDate(o.Low));
                }
              );
            }
            if(oDR.getVisible()){
              _.forEach(
                oV.MemberFilter, function (o) {
                  oDR.setDateValue( TokenHelper.datsToDate(o.Low));
                  oDR.setSecondDateValue(
                    TokenHelper.datsToDate(o.High));
                }
              );
            }
            oMI.setShowValueHelp(
              oV.SupportsValueHelp
            );
            oMI.setMaxTokens(oV.SupportsMultipleValues ? 100 : 1);
            oMI.removeAllTokens();
            _.forEach(oV.MemberFilter, function (o) {
              oMI.addToken(TokenHelper.rangeToToken(o));
            });
          }
        );
      };
      that.executeDataSourceIfPossible = function(){
        AxisActionController.connectToView(oComponent.getRootControl());
        var oDP = oComponent.getModel("om").getDataProvider(0);
        oComponent.getModel().setProperty("/showHeader", oDP.HasVariables);
        oComponent.getModel().setProperty("/filterVisible", oDP.HasVariables);
        return !oComponent.getModel("om").getProperty("/FlatVariables").length && oDP.getResultSet();
      };
      that.serialize = function () {
        return {
          main: _.clone(oComponent.getModel().getData()),
          om: oComponent.getModel("om").serialize(),
        };
      };
      that.deserialize = function (o) {
        if (!o) {
          return Promise.resolve(null);
        }
        oComponent.getModel().setData(o.main);
        return oComponent.getModel("om").deserialize(o.om);
      };
      that.updateVariants = function(oPersData){
        oComponent.getModel("settings").setProperty(
          "/variants", oPersData ? oPersData.variants || [] : []
        );
      };
      that.getPersData = function(){
        return that.getPersonalizer().getPersData();
      };
      that.persistPersonalization = function () {
        return Promise.resolve(
          that.getPersonalizer().setPersData(
            oComponent.getModel("settings").getData()
          )
        );
      };
      (function(){
        var oProm = oComponent.getModel(
          "om"
        ).dataLoaded(
        ).then(
          function(){
            return oComponent.rootControlLoaded();
          }
        ).then(
          function(){
            return oComponent.getRootControl().loaded();
          }
        ).then(
          that.attachFragments
        );
        that.initComp = function(){
          return oProm;
        };
      }());
      that.loadAppState = function(){
        var sHash = oHashChanger.getHash();
        var aMatch = sHash.match(/\/sap-iapp-state=(.+)(&|$)/);
        return (!aMatch) ? Promise.resolve(false) :  Promise.resolve(
          sap.ushell.Container.getService("CrossApplicationNavigation").getAppState(
            oComponent,
            aMatch[1]
          )
        ).then(
          function (oSavedAppState) {
            var oAppStateData = oSavedAppState.getData();
            return oAppStateData ? that.deserialize(oAppStateData) : false;
          }
        );
      };
      that.saveAppState =  function (bSaveOnDb) {
        if (!sap.ushell.Container) {
          return Promise.resolve(null);
        }
        var oAppState = sap.ushell.Container.getService("CrossApplicationNavigation").createEmptyAppState(
          oComponent, !bSaveOnDb
        );
        oAppState.setData(that.serialize());
        return Promise.resolve(
          oAppState.save()
        ).then(
          function () {
            var sHash = oHashChanger.getHash();
            var aMatch = sHash.match(/\/sap-iapp-state=(.+)(&|$)/);
            oHashChanger.replaceHash(
              aMatch ? sHash.replace(aMatch[1], oAppState.getKey()) : [
                sHash,
                "&/sap-iapp-state=",
                oAppState.getKey()
              ].join("")
            );
            return oAppState.getKey();
          }
        );
      };
    };
    return Utilities;
  }
);
