/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./Query"],function(r,e,Q){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.FacetQuery=void 0;var F=(function(a){_(F,a);function F(p){var b=a.call(this,p)||this;b.properties=p;return b;}F.prototype.clone=function(){return new F(this.properties);};F.prototype._execute=function(q){return Promise.resolve(null);};F.prototype._formatResultSetAsync=function(b){return Promise.resolve();};return F;}(Q.Query));e.FacetQuery=F;});})();
