/*!
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
/*global sap, window*/

sap.ui.define(
  [
    "sap/base/Log",
     "sap/ui/core/routing/HashChanger"
  ],
  function(Log,HashChanger){
    var eUndefined = -1;
    var eLoad = 0;
    var eGetServerInfo = 1;
    var eGetResponse = 2;
    var eSubmitCube = 3;

    var oHashChanger = new HashChanger();
    var Olap = function(){
      Log.info("Loaded main");
      var that = this;
      var nCounter = 0;
      var oPromiseMap={};
      that.worker = new window.Worker(sap.ui.require.toUrl("sap/zen/commons/thirdparty/wasabi/Microcube_worker.js"));
      var oWasabi;
      function ensureWasabi(){
        function handle(res,rej){
          fResolve = res;
          fReject = rej;
        }
        if(!oWasabi){
          nCounter++;
          var fReject, fResolve;
          oWasabi = new Promise(handle);
          oPromiseMap[nCounter] = {
            prom: oWasabi,
            reject: fReject,
            resolve: fResolve
          };
          var sHash = oHashChanger.getHash();
          var aMatch = sHash.match(/\/wasabi=(.+)(&|$)/);
          var sLoc = aMatch?aMatch[1]:".";
          that.worker.postMessage([nCounter,eLoad, sLoc]);
        }
        return oWasabi;
      }
      that.getServerInfo = function(){
        return ensureWasabi().then(
          function(){
            nCounter++;
            var fReject, fResolve;
            function handle(res,rej){
              fResolve = res;
              fReject = rej;
            }
            var oProm = new Promise(handle);
            oPromiseMap[nCounter] = {
              prom: oProm,
              reject: fReject,
              resolve: fResolve
            };
            that.worker.postMessage([nCounter,eGetServerInfo, null]);
            return oProm.then( function(a){return a[1];});
          }
        );
      };
      that.getResponse = function(requestBody){
        return ensureWasabi().then(
          function(){
            nCounter++;
            var fReject, fResolve;
            function handle(res,rej){
              fResolve = res;
              fReject = rej;
            }
            var oProm = new Promise(handle);
            oPromiseMap[nCounter] = {
              prom: oProm,
              reject: fReject,
              resolve: fResolve
            };
            that.worker.postMessage([nCounter,eGetResponse,requestBody]);
            return oProm.then( function(a){return a[1];});
          }
        );
      };
      that.submitCube = function(requestBody){
        return ensureWasabi().then(
          function(){
            nCounter++;
            var fReject, fResolve;
            function handle(res,rej){
              fResolve = res;
              fReject = rej;
            }
            var oProm = new Promise(handle);
            oPromiseMap[nCounter] = {
              prom: oProm,
              reject: fReject,
              resolve: fResolve
            };
            that.worker.postMessage([nCounter,eSubmitCube,requestBody]);
            return oProm.then( function(a){return a[1];});
          }
        );
      };
      that.worker.onmessage = function( event) {
        var msg = event.data;
        var commId = msg[0];
        var oProm = oPromiseMap[commId];
        if(msg[1]&&msg[1]instanceof Error){
          oProm.reject(msg[1]);
        }else{
          oProm.resolve(msg.splice(1));
        }
      };
    };
    return Olap;
  }
);
