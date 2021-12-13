/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/dataMappers/SDKStackedWaterfallDataMapper"],function(B,S,a){"use strict";S.extend("sap.zen.SDKStackedWaterfallChart",{initCvomChartType:function(){this.cvomType="viz/stacked_waterfall";},getDataFeeding:function(){},getDataMapper:function(){return new a();}});return sap.zen.SDKStackedWaterfallChart;});
