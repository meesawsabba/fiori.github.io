/*!
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";function S(){var a="viz/scatter";var B="viz/bubble";var D="viz/dual";var R="viz/radar";var M="viz/multi_radar";this.isRadarChart=function(c){return c===R||c===M;};this.isScatterBubbleChart=function(c){return this.isScatterChart(c)||this.isBubbleChart(c);};this.isDualChart=function(c){return c!==undefined&&c.indexOf(D)!==-1;};this.isScatterChart=function(c){return c===a;};this.isBubbleChart=function(c){return c===B;};}return S;});
