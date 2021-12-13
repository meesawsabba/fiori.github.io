/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./Suggestion","./SuggestionType"],function(r,e,S,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.ObjectSuggestion=void 0;var O=(function(b){_(O,b);function O(p){var c;var d=b.call(this,p)||this;d.type=a.SuggestionType.Object;d.object=(c=p.object)!==null&&c!==void 0?c:d.object;return d;}return O;}(S.Suggestion));e.ObjectSuggestion=O;});})();
