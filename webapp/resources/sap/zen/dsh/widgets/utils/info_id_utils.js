/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(){"use strict";function I(){}I.prototype.convertEnumToId=function(e){var c=e;if(c.indexOf("INFO_")===0){c=c.replace("INFO_","INFO/");}return c.toLowerCase();};I.prototype.convertIdToEnum=function(v){var c=v;if(c.indexOf("info/")===0){c=c.replace("info/","info_");}return c.toUpperCase();};return I;});
