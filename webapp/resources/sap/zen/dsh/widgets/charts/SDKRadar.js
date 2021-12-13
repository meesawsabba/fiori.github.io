/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(B,S){"use strict";S.extend("sap.zen.SDKRadarChart",{initCvomChartType:function(){this.cvomType="viz/radar";},getDataFeeding:function(k,a,r,c){var b=this.getChartDataFeedingHelper();var d=b.getDataRadarFeedingColor(k,a,r,c);var e=[];var f=b.getDataRadarFeedingAxes(k,c);var g=[{"feedId":"radarAxesValues","binding":[{"type":"measureValuesGroup","index":1}]},{"feedId":"regionColor","binding":d},{"feedId":"regionShape","binding":e},{"feedId":"radarAxes","binding":f}];return g;}});return sap.zen.SDKRadarChart;});
