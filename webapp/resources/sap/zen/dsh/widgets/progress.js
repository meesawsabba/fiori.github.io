/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/m/ProgressIndicator"],function(q,L,P){"use strict";return P.extend("com.sap.ip.bi.ProgressIndicator",{initDesignStudio:function(){},renderer:{},setText:function(v){this.setDisplayValue(v);},getText:function(){return this.getDisplayValue();},setState:function(s){sap.m.ProgressIndicator.prototype.setState.call(this,sap.ui.core.ValueState[s]);this.onAfterRendering();},getState:function(){return sap.m.ProgressIndicator.prototype.getState.call(this);},setTooltip:function(v){sap.m.ProgressIndicator.prototype.setTooltip.call(this,v);this.$().attr("title",v);},getTooltip:function(){return sap.m.ProgressIndicator.prototype.getTooltip.call(this);},setPercentValue:function(v){if(v<0){v=0;}else if(v>100){v=100;}return sap.m.ProgressIndicator.prototype.setPercentValue.call(this,v);}});});
