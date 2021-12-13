/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./FacetResultSet","./FacetType"],function(r,e,F,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.DataSourceResultSet=void 0;var D=(function(b){_(D,b);function D(){var c=b!==null&&b.apply(this,arguments)||this;c.type=a.FacetType.DataSource;return c;}return D;}(F.FacetResultSet));e.DataSourceResultSet=D;});})();
