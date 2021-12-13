/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","../../core/util","./Formatter"],function(r,e,u,F){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.RemovePureAdvancedSearchFacetsFormatter=void 0;var R=(function(a){_(R,a);function R(){return a!==null&&a.apply(this,arguments)||this;}R.prototype.initAsync=function(){return Promise.resolve();};R.prototype.format=function(b){return u.removePureAdvancedSearchFacets(b);};R.prototype.formatAsync=function(b){b=u.removePureAdvancedSearchFacets(b);return Promise.resolve(b);};return R;}(F.Formatter));e.RemovePureAdvancedSearchFacetsFormatter=R;});})();
