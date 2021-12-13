/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/DualDataSeriesHelper"],function(B,S,D){"use strict";S.extend("sap.zen.SDKColumnCombinationDualAxisChart",{init:function(){S.prototype.init.apply(this,arguments);this.registerHelper("sap.zen.DualDataSeriesHelper");D.apply(this,arguments);},getPropertyValues:function(){return{plotObjectType:this.getPlotObjectType()};},initCvomChartType:function(){this.cvomType="viz/dual_combination";this.cvomErrorMappings={"50005":"dualcolumn_combination_datamapping_rmd"};}});return sap.zen.SDKColumnCombinationDualAxisChart;});
