/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SinaObject"],function(r,e,S){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.NavigationTarget=void 0;var N=(function(a){_(N,a);function N(p){var b,c,d;var f=a.call(this,p)||this;f.targetUrl=(b=p.targetUrl)!==null&&b!==void 0?b:f.targetUrl;f.label=(c=p.label)!==null&&c!==void 0?c:f.label;f.target=(d=p.target)!==null&&d!==void 0?d:f.target;return f;}N.prototype.performNavigation=function(p){p=p||{};var t=p.trackingOnly||false;if(!t){if(this.target){window.open(this.targetUrl,this.target,"noopener,noreferrer");}else{window.open(this.targetUrl,"_blank","noopener,noreferrer");}}};N.prototype.isEqualTo=function(o){if(!o){return false;}return this.targetUrl==o.targetUrl;};return N;}(S.SinaObject));e.NavigationTarget=N;});})();
