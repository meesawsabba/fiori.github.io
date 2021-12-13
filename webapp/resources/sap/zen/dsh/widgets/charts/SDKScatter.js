/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(B,S){"use strict";S.extend("sap.zen.SDKScatterChart",{initCvomChartType:function(){this.cvomType="viz/scatter";},getDataFeeding:function(k,a,r,c){var b=this.getChartDataFeedingHelper();var d=b.getDataScatterFeedingColor(k,a,r,c);var e=b.getDataScatterFeedingShape(k,a,r,c);var f=[{"feedId":"primaryValues","binding":[{"type":"measureValuesGroup","index":1}]},{"feedId":"secondaryValues","binding":[{"type":"measureValuesGroup","index":2}]},{"feedId":"regionColor","binding":d},{"feedId":"regionShape","binding":e}];return f;}});return sap.zen.SDKScatterChart;});
