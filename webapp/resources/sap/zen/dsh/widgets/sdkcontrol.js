/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["jquery.sap.global","sap/base/Log","sap/zen/commons/thirdparty/lodash","sap/ui/core/Control"],function(q,L,_,C){"use strict";function r(c){if(!c)return undefined;var p=c.split(".");var R=window;for(var i=0;i<p.length;i++){var o=p[i];R=R[o];if(!R){break;}}return R;}return C.extend("sap.designstudio.sdk.SdkControl",{metadata:{},init:function(){},storeProperties:function(c,o){var h=r(c["handler_name"]);if(h){this.widget=new h(this);this.widget.oControlProperties=c;this.widget.oComponentProperties=o;}},dispatchProperties:function(c,o){this.widget.dispatchProperties(c,o);},renderer:function(){},advancedPropertyCall:function(){var f=arguments[1];var a=this.widget[f];if(a){var b=Array.prototype.slice.apply(arguments);b=b.slice(2);return a.apply(this.widget,b);}return null;},getDecorator:function(){if(this.widget&&this.widget.getDecorator){return this.widget.getDecorator();}return null;}});});
