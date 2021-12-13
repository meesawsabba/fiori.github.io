/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
/*global sap, window */
sap.ui.define(
  "sap/zen/dsh/rsrt/controller/Utils",
  [
    "sap/ui/core/routing/HashChanger",
    "sap/zen/dsh/library",
    "sap/zen/dsh/utils/Utilities",
    "sap/viz/ui5/controls/common/feeds/FeedItem",
    "sap/viz/ui5/api/env/Format",
    "sap/zen/commons/thirdparty/lodash"
  ],
  function (HashChanger, easyGrid, Utils, FeedItem, ChartFormatter, Format, _) {
    "use strict";
    var oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.zen.dsh");
    return {
      Params: _.reduce(
        decodeURIComponent(window.location.search.substring(1)).split("&"),
        function (o1, s) {
          var aPair = s.split("=");
          o1[aPair[0]] = aPair[1];
          return o1;
        }, {}
      ),
      NavService: sap.ushell.Container && sap.ushell.Container.getService("CrossApplicationNavigation"),
      Utilities: Utils,
      trunc: Math.trunc || function (x) {
        if (isNaN(x)) {
          return NaN;
        }
        if (x > 0) {
          return Math.floor(x);
        }
        return Math.ceil(x);
      },
      HashChanger: new HashChanger(),
      getChartTypes: function () {
        return _.map(
          _.filter(
            easyGrid.ChartType,
            function (s) {
              return s !== easyGrid.ChartType.PivotTable;
            }
          ),
          function (s) {
            return {
              key: s,
              name: oBundle.getText(s)
            };
          }
        );
      }
    };
  }
);
