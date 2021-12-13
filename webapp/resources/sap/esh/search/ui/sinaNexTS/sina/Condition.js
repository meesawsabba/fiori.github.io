/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SinaObject"],function(r,e,S){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.Condition=void 0;var C=(function(a){_(C,a);function C(p){var b=a.call(this,{sina:p.sina})||this;b.attributeLabel=p.attributeLabel;b.valueLabel=p.valueLabel;b.userDefined=p.userDefined;return b;}C.prototype.collectAttributes=function(){var b={};this._collectAttributes(b);return Object.keys(b);};return C;}(S.SinaObject));e.Condition=C;});})();
