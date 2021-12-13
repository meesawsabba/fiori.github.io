/*
 * SAPUI5
  (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log","sap/zen/dsh/widgets/sap_viz/funcUtils"],function(L,F){L.info("Load Class");var t=/xyz/.test(function(){window.xyz;})?/\b_super\b/:/.*/;var c=F.createCallChain;function z(){}function e(a){var _=z.prototype=this.prototype;var s=this.chain?this.chain(a.constructor):c(this,a.constructor);var p=s.prototype=new z();p.constructor=s;delete a.constructor;var b;for(var f in a){b=a[f];p[f]=typeof b==="function"&&typeof _[f]==="function"&&t.test(b)?(function(n,g){return function(){this._super=_[n];var r=g.apply(this,arguments);return r;};})(f,b):b;}s.extend=e;return s;}function d(a){if(typeof a==="function"){a.extend=e;return a;}else{var b=a.constructor||function(){};var p=b.prototype;for(var f in a){if(Object.prototype.hasOwnProperty.call(a,f)){p[f]=a[f];}}b.extend=e;return b;}}return{define:d,extend:e};});
