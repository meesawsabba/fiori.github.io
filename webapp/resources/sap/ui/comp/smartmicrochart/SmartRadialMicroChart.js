/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(["sap/ui/comp/library","sap/ui/core/Control","sap/suite/ui/microchart/library","sap/suite/ui/microchart/RadialMicroChart","sap/m/library","sap/ui/comp/smartmicrochart/SmartMicroChartBase","./SmartMicroChartRenderer"],function(l,C,M,R,a,S,b){"use strict";var c=S.extend("sap.ui.comp.smartmicrochart.SmartRadialMicroChart",{metadata:{library:"sap.ui.comp",designtime:"sap/ui/comp/designtime/smartmicrochart/SmartRadialMicroChart.designtime",properties:{enableAutoBinding:{type:"boolean",group:"Misc",defaultValue:false}},associations:{freeText:{type:"sap.m.Label",group:"Misc",multiple:false}}},renderer:b});c.prototype._CHART_TYPE=["Donut"];c.prototype.init=function(){this._bIsInitialized=false;this._bMetaModelLoadAttached=false;this.setProperty("chartType","Donut",true);this.setAggregation("_chart",new R(),true);};c.prototype.onBeforeRendering=function(){var o=this.getAggregation("_chart");o.setSize(this.getSize(),true);M._passParentContextToChild(this,o);};c.prototype._createAndBindInnerChart=function(){this._bindProperties();this._updateAssociations.call(this);};c.prototype._bindProperties=function(){var i=this.getAggregation("_chart");if(this._oDataPointAnnotations.Value&&!this._oDataPointAnnotations.TargetValue){if(this._hasMember(this._oDataPointAnnotations.Value,"Path")){i.bindProperty("percentage",{path:this._oDataPointAnnotations.Value.Path,type:"sap.ui.model.odata.type.Decimal"});}}else if(this._hasMember(this,"_oDataPointAnnotations.TargetValue.Path")&&this._hasMember(this,"_oDataPointAnnotations.Value.Path")){i.bindProperty("total",{path:this._oDataPointAnnotations.TargetValue.Path,type:"sap.ui.model.odata.type.Decimal"});i.bindProperty("fraction",{path:this._oDataPointAnnotations.Value.Path,type:"sap.ui.model.odata.type.Decimal"});}i.bindProperty("valueColor",{parts:[this._oDataPointAnnotations.Value&&this._oDataPointAnnotations.Value.Path||"",this._oDataPointAnnotations.Criticality&&this._oDataPointAnnotations.Criticality.Path||""],formatter:this._getValueColor.bind(this)});};return c;});
