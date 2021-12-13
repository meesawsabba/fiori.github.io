/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, window, Promise */
sap.ui.define(
  "sap/zen/dsh/utils/Utilities",
  [
    "sap/ui/core/Component",
    "sap/zen/commons/thirdparty/lodash",
    "sap/zen/dsh/dialogs/Component"
  ],
  function (Component, _) {
    "use strict";
    var Utilities = function () {
      var that = this;
      that.getDialogs = _.constant(
        Component.create(
          {
            name: "sap.zen.dsh.dialogs"
          }
        ).then(
          function (o)
          {
            return o.loaded();
          }
        ).then(_.identity)
      );
      that.trunc = Math.trunc || function (x) {
        return isNaN(x) ? NaN : (x > 0 ? Math.floor(x) : Math.ceil(x));
      };
    };
    return new Utilities();
  }
);
