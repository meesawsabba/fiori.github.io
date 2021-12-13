/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap*/
sap.ui.define(
  "sap/zen/dsh/utils/SyncActionHelper",
  [
    "sap/base/Log",
    "sap/zen/dsh/utils/ListHelper",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (Log, ListHelper, _) {
    Log.info("Load SyncAction Helper");
    function SyncActionHelper() {
      var that = this;
      function reject(oExtResult){
        var oError = new Error(oExtResult.getSummary());
        oError.getMessages = _.constant(ListHelper.arrayFromList(
          oExtResult.getMessages()
        ).map(function (o) {
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
              encodeURIComponent(o.getMessageClass()), "',MSGNO='", encodeURIComponent(o.getCode()), "',MESSAGE_V1='',MESSAGE_V2='',MESSAGE_V3='',MESSAGE_V4='')/$value"
            ].join("") : null
          };
        }));
        return oError;
      }
      that.reject = reject;
      that.syncActionToPromise = function (fSyncAction, that, aParams) {
        var fResolve, fReject;
        function handleDialog(resolve, reject) {
          fResolve = resolve;
          fReject = reject;
        }
        function handle(oSyncAction) {
          if (oSyncAction.hasErrors()) {
            fReject(reject(oSyncAction));
          } else {
            fResolve(oSyncAction.getData());
          }
        }
        var oProm = new Promise(handleDialog);
        fSyncAction.apply(
          that, _.concat(
            [
              sap.firefly.SyncType.NON_BLOCKING, handle
            ],
            aParams
          )
        );
        return oProm;
      };
    }
    return new SyncActionHelper();
  }
);
