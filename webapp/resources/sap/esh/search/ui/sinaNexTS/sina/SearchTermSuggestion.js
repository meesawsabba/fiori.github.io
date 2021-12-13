/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./Suggestion","./SuggestionType"],function(r,e,S,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.SearchTermSuggestion=void 0;var b=(function(c){_(b,c);function b(p){var d,f,g;var h=c.call(this,p)||this;h.type=a.SuggestionType.SearchTerm;h.childSuggestions=[];h.searchTerm=(d=p.searchTerm)!==null&&d!==void 0?d:h.searchTerm;h.filter=(f=p.filter)!==null&&f!==void 0?f:h.filter;h.childSuggestions=(g=p.childSuggestions)!==null&&g!==void 0?g:h.childSuggestions;return h;}return b;}(S.Suggestion));e.SearchTermSuggestion=b;});})();
