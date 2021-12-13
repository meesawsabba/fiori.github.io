/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log"],function(L){L.info("Load objectUtils");return{clone:function(a){if(typeof(a)!=="object"){return a;}if(a===null)return a;var o=a.constructor===Array?[]:{};for(var i in a){o[i]=typeof a[i]==="object"?arguments.callee.call(null,a[i]):a[i];}return o;}};});
