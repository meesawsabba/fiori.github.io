/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/typeUtils"],function(L,T){"use strict";L.info("Load funcUtils");var A=Array.prototype.slice;function c(){var a=[];function C(){for(var i=0,l=a.length;i<l;i++){a[i].apply(this,arguments);}}function b(){for(var i=0,l=arguments.length;i<l;i++){if(T.isFunction(arguments[i])){a.push(arguments[i]);}else{throw new Error("Could not create call chain for non-function object");}}}C.chain=function(){return c.apply(null,[].concat(a,A.call(arguments)));};b.apply(null,arguments);return C;}var f={createCallChain:c};return f;});
