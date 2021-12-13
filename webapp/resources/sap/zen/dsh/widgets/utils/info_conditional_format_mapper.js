/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/commons/thirdparty/lodash","sap/zen/dsh/utils/BaseHandler"],function(q,_){"use strict";var C=function(){};C.prototype.createDataPointStyle=function(s){var c=s.getConditionalFormatValues();var r=_.reduce(c,function(m,d,b){m.push({dataContext:d,properties:{"color":g(b)},displayName:""+b});return m;},[]);return{"rules":r};};function g(c){var b="sapzencrosstab-DataCellAlert"+c+"Background";return a(b);}function a(c){var $=q("<div style='display:none'></div>").appendTo("body");$.addClass(c);var r=$.css("background-color");$.remove();return r;}return C;});
