/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/zen/dsh/utils/BaseHandler","sap/zen/dsh/widgets/charts/SDKBaseChart","sap/zen/dsh/widgets/dataMappers/SDKPieDataMapper"],function(B,S,a){"use strict";S.extend("sap.zen.SDKPieChart",{initCvomChartType:function(){this.cvomType="viz/pie";},getDataMapper:function(){return new a();},getDataFeeding:function(){}});return sap.zen.SDKPieChart;});
