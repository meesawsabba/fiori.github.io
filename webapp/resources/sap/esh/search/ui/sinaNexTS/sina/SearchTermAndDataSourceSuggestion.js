/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SearchTermSuggestion","./SuggestionType"],function(r,e,S,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.SearchTermAndDataSourceSuggestion=void 0;var b=(function(c){_(b,c);function b(p){var d;var f=c.call(this,p)||this;f.type=a.SuggestionType.SearchTermAndDataSource;f.dataSource=(d=p.dataSource)!==null&&d!==void 0?d:f.dataSource;return f;}return b;}(S.SearchTermSuggestion));e.SearchTermAndDataSourceSuggestion=b;});})();
