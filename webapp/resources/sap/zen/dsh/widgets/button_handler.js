/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/zen/dsh/utils/BaseHandler"],function(q,B){"use strict";var a=function(){B.apply(this,arguments);var d=B.dispatcher;var b=function(o,c){var t=d.getValue(c,"caption");var e=c.tooltip;var f=c.image;o.setText(t);o.setTooltip(e);o.setEnabled(c.enabled);if(B.dispatcher.isMainMode()){var g=c.buttontype||"Default";o.setType(g);}if(f&&f.length>0){o.setIcon(f);if(c.iconfirst){o.setIconFirst(true);}else{o.setIconFirst(false);}}else{o.setIcon(null);}};this.create=function(c,C){var e=C["id"];var o=this.createButtonWithHeight(e);b(o,C);if(C.onclick){o.attachPress(function(){new Function(C.onclick)();});}return o;};this.update=function(c,C){if(C){b(c,C);}};this.getType=function(){return"button";};};var i=new a();B.dispatcher.addHandlers("button",i);return i;});
