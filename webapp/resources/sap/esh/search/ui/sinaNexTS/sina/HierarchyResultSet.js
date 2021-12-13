/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./FacetResultSet","./FacetType"],function(r,e,F,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.HierarchyResultSet=void 0;var H=(function(b){_(H,b);function H(p){var c=b.call(this,p)||this;c.type=a.FacetType.Hierarchy;c.node=p.node;return c;}return H;}(F.FacetResultSet));e.HierarchyResultSet=H;});})();
