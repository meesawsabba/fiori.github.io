/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var S={apiVersion:2};S.render=function(r,c){if(c._bIsInitialized){r.openStart("div",c);if(c.getIsResponsive()){r.class("sapSuiteUiSmartMicroChartResponsive");}r.openEnd();r.renderControl(c.getAggregation("_chart"));r.close("div");}};return S;},true);
