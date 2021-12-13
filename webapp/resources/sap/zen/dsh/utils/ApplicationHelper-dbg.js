/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, Promise*/
sap.ui.define(
  "sap/zen/dsh/utils/ApplicationHelper",
  [
    "sap/base/Log",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (Log,_) {
    "use strict";
    Log.info("ApplicationHelper loaded");
    function ApplicationHelper() {
      function createSystem(oSystemLandscape,oSystem){
        var oSystemDescription = oSystemLandscape.createSystem();
        oSystemDescription.setName(oSystem.systemName);
        oSystemDescription.setTimeout(10000);
        oSystemDescription.setAuthenticationType(sap.firefly.AuthenticationType[oSystem.authentication || "NONE"]);
        oSystemDescription.setSystemType(sap.firefly.SystemType[oSystem.systemType]);
        oSystemDescription.setProtocolType(sap.firefly.ProtocolType[oSystem.protocol]);
        oSystemDescription.setHost(oSystem.host);
        oSystemDescription.setPort(oSystem.port);
        oSystemDescription.setSessionCarrierType( sap.firefly.SessionCarrierType.SAP_CONTEXT_ID_HEADER );
        oSystemLandscape.setSystemByDescription(oSystemDescription);
      }
      this.addSystem = function(oApplication, oSystem){
        createSystem(oApplication.getSystemLandscape(),oSystem);
        if(oSystem.getSystemType().isTypeOf(sap.firefly.SystemType.BW)){
          oApplication.getConnectionPool().setMaximumSharedConnections( oSystem.getName(), 10 );
        }
      };
      this.createApplication = function (aSystemLandscape,sMasterSystem) {
        var fResolve = null;
        var fReject = null;
        function handle(resolve,reject){
          fResolve = resolve;
          fReject = reject;
        }
        var oProm = new Promise(handle);
        sap.firefly.ApplicationFactory.createApplicationForDragonfly(
          function(oExtResult){
            if( oExtResult.hasErrors()){
              fReject(
                oExtResult.getErrors()
              );
            }else{
              fResolve(
                oExtResult.getData()
              );
            }
          }
        );
        return oProm.then(
          function(oApplication){
            var oSystemLandscape = sap.firefly.StandaloneSystemLandscape.create(oApplication);
            oApplication.setSystemLandscape(oSystemLandscape);
            _.forEach(
              aSystemLandscape,
              createSystem.bind(null,oSystemLandscape)
            );
            oSystemLandscape.setMasterSystemName(sMasterSystem);
            return oApplication;
          }
        );
      };
    }
    return new ApplicationHelper();
  }
);
