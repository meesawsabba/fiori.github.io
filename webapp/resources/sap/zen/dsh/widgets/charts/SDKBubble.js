/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart"],function(B,S){"use strict";S.extend("sap.zen.SDKBubbleChart",{getDataFeeding:function(k,a,r,c,b){var d=this.getChartDataFeedingHelper();var e=d.getDataBubbleFeedingColor(r,c);var f=d.getDataBubbleFeedingShape(r,c);var g=d.getDataBubbleFeedingHeight(b);var h=[{"feedId":"primaryValues","binding":[{"type":"measureValuesGroup","index":1}]},{"feedId":"secondaryValues","binding":[{"type":"measureValuesGroup","index":2}]},{"feedId":"bubbleWidth","binding":[{"type":"measureValuesGroup","index":3}]},{"feedId":"bubbleHeight","binding":g},{"feedId":"regionColor","binding":e},{"feedId":"regionShape","binding":f}];return h;},initCvomChartType:function(){this.cvomType="viz/bubble";}});return sap.zen.SDKBubbleChart;});
