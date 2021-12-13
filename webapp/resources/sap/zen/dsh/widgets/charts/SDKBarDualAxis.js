/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/DualDataSeriesHelper"],function(B,S,D){"use strict";S.extend("sap.zen.SDKBarDualAxisChart",{init:function(){S.prototype.init.apply(this,arguments);this.registerHelper("sap.zen.DualDataSeriesHelper");D.apply(this,arguments);},getPropertyValues:function(){return{plotObjectType:this.getPlotObjectType()};},initCvomChartType:function(){this.cvomType="viz/dual_bar";this.cvomErrorMappings={"50005":"dualbar_datamapping_rmd"};}});return sap.zen.SDKBarDualAxisChart;});
