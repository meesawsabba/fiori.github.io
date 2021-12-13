/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/dsh/utils/PromiseQueue",
  [
    "sap/base/Log",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (Log, _) {
    "use strict";
    function PromiseQueue() {
      var that = this;
      var oP = Promise.resolve(null);
      that.addPromise = function (f) {
        oP = oP.then(f).catch(
          function (oError) {
            Log.error(oError);
          });
        return oP;
      };
    }
    return PromiseQueue;
  }
);
