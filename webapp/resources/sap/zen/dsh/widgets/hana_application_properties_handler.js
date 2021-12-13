/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(q,B){sap.zen.Application_properties=function(){"use strict";B.apply(this,arguments);this.createAndAdd=function(c,C){var a=C.customCss;if(a){if(document.createStyleSheet){document.createStyleSheet(a);}else{q("head").append(q("<link rel='stylesheet' href='"+a+"' type='text/css' media='screen' />"));}}return null;};this.updateComponent=function(){return null;};this.getType=function(){return"application_properties";};};var i=new sap.zen.Application_properties();B.dispatcher.addHandlers(i.getType(),i,"Decorator");return i;});
