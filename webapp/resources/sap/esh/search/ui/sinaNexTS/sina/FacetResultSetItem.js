/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./ResultSetItem"],function(r,e,R){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.FacetResultSetItem=void 0;var F=(function(a){_(F,a);function F(p){var b,c,d;var f=a.call(this,p)||this;f.dimensionValueFormatted=(b=p.dimensionValueFormatted)!==null&&b!==void 0?b:f.dimensionValueFormatted;f.measureValue=(c=p.measureValue)!==null&&c!==void 0?c:f.measureValue;f.measureValueFormatted=(d=p.measureValueFormatted)!==null&&d!==void 0?d:f.measureValueFormatted;return f;}F.prototype.toString=function(){return this.dimensionValueFormatted+":"+this.measureValueFormatted;};return F;}(R.ResultSetItem));e.FacetResultSetItem=F;});})();
