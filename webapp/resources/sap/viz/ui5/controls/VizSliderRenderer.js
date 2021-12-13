/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(function(){"use strict";var R={apiVersion:2};R.render=function(r,c){r.openStart("div",c).class("sapRangeSliderVizFrame").style("width",c.getWidth()).style("height",c.getHeight()).style("position","relative").openEnd();r.renderControl(c.getAggregation("_vizFrame"));r.renderControl(c.getAggregation("_rangeSlider"));r.close("div");};return R;},true);
