/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/dataMappers/SDKWaterfallDataMapper"],function(B,S,a){"use strict";S.extend("sap.zen.SDKHorizontalWaterfallChart",{initCvomChartType:function(){this.cvomType="viz/horizontal_waterfall";},getDataMapper:function(){return new a();},getDataFeeding:function(){return undefined;}});return sap.zen.SDKHorizontalWaterfallChart;});
