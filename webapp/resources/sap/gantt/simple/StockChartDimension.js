/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/core/theming/Parameters"],function(E,P){"use strict";var S=E.extend("sap.gantt.simple.StockChartDimension",{metadata:{library:"sap.gantt",properties:{name:{type:"string"},dimensionPathColor:{type:"sap.gantt.ValueSVGPaintServer"},remainCapacityColor:{type:"sap.gantt.ValueSVGPaintServer"},remainCapacityColorNegative:{type:"sap.gantt.ValueSVGPaintServer"},relativePoint:{type:"float",defaultValue:0}},defaultAggregation:"stockChartPeriods",aggregations:{stockChartPeriods:{type:"sap.gantt.simple.StockChartPeriod"}}}});S.prototype.getDimensionPathColor=function(){return this.getProperty("dimensionPathColor")||P.get("sapUiChartNeutral");};S.prototype.getRemainCapacityColor=function(){return this.getProperty("remainCapacityColor")||P.get("sapUiChartNeutral");};S.prototype.getRemainCapacityColorNegative=function(){return this.getProperty("remainCapacityColorNegative")||P.get("sapUiChartBad");};return S;},true);
