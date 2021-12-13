/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(L){"use strict";L.info("Load CssPlugin");function C(){}var g=function(){return document.head||document.getElementsByTagName("head")[0]||document.documentElement;};C.prototype.normalize=function(n,a){if(!/\.css$/.test(n)){n=n+".css";}return a(n);};C.prototype.load=function(n,r,l){var c=(r.toUrl?r.toUrl(n):n);var a=document.createElement("link");a.type="text/css";a.rel="stylesheet";a.href=c;a.onload=function(){l(this.sheet);this.onerror=this.onload=null;};a.onerror=function(){l.error(new Error("Failed to load "+this.href));this.onerror=this.onload=null;};g().appendChild(a);};C.prototype.pluginBuilder="cssBuilder";return C;});
