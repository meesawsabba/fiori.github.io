/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/olap/OlapPropertyBinding",
  [
    "sap/base/util/deepEqual",
    "sap/ui/model/ChangeReason",
    "sap/ui/model/PropertyBinding",
    "sap/zen/dsh/olap/calculateId",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (deepEqual, ChangeReason, PropertyBinding, calculateId, _) {
    "use strict";
    /**
     * Creates a new OlapPropertyBinding.
     *
     * This constructor should only be called by subclasses or model implementations, not by application or control code.
     * Such code should use {@link sap.zen.dsh.OlapModel#bindProperty OlapModel#bindProperty} on the corresponding model instance instead.
     *
     * @throws {Error} When one of the features is not (yet) supported by the OlapModel implementation
     *
     * @class
     * Property binding implementation for <code>OlapModel</code>.
     * @version 1.96.0
     * @alias sap.zen.dsh.olap.OlapPropertyBinding
     * @extends sap.ui.model.ListBinding
     * @protected
     */
    var OlapPropertyBinding = PropertyBinding.extend(
      "sap.zen.dsh.OlapPropertyBinding", {
        constructor: function (oModel, sPath, oContextGiven, mParameters) {
          var that = this;
          var oContext = oContextGiven;
          var oValue = null;
          PropertyBinding.apply(that, [oModel, sPath, oContext, mParameters]);
          function _getValue() {
            var sRP = oModel.resolve(sPath, oContext);
            return sRP? oModel.getProperty(sRP) : null;
          }
          that.getValue = function () {
            return oValue;
          };
          that.setValue = function (o) {
            var sP = oModel.resolve(sPath, oContext);
            oModel.setProperty(sP, o);
          };
          that.setContext = function (oCtx) {
            if (oContext !== oCtx) {
              sap.ui.getCore().getMessageManager().removeMessages(
                that.getDataState().getControlMessages(), true
              );
              oContext = oCtx;
              that.checkUpdate();
            } else {
              that.checkUpdate();
            }
          };
          that.getId = _.constant(calculateId());
          that.checkUpdate = function (bForceupdate) {
            var oV = _getValue();
            if (bForceupdate || !deepEqual(oV, oValue)) {
              oValue = oV;
              that.getDataState().setValue(oValue);
              that.checkDataState();
              that._fireChange({
                reason: ChangeReason.Change
              });
            }
          };
        }
      }
    );
    return OlapPropertyBinding;
  }
);
