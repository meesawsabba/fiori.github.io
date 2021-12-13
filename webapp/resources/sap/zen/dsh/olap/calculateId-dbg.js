/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap */
sap.ui.define(
  "sap/zen/dsh/olap/calculateId",
  [],
  function () {
    "use strict";
    var nCount = 0;
    return function () {
      return ++nCount;
    };
  }
);
