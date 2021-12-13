/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SearchResultSetItemAttributeBase"],function(r,e,S){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.SearchResultSetItemAttribute=void 0;var a=(function(b){_(a,b);function a(p){var c=b.call(this,p)||this;c.label=p.label;c.value=p.value;c.valueFormatted=p.valueFormatted;c.valueHighlighted=p.valueHighlighted;c.isHighlighted=p.isHighlighted;c.unitOfMeasure=p.unitOfMeasure;c.description=p.description;c.defaultNavigationTarget=p.defaultNavigationTarget;c.navigationTargets=p.navigationTargets;c.metadata=p.metadata;return c;}a.prototype.toString=function(){return this.label+":"+this.valueFormatted;};return a;}(S.SearchResultSetItemAttributeBase));e.SearchResultSetItemAttribute=a;});})();
