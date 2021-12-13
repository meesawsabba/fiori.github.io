/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./AttributeMetadataBase"],function(r,e,A){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.AttributeMetadata=void 0;var a=(function(b){_(a,b);function a(p){var c,d,f,g,h,i,j;var k=b.call(this,p)||this;k.label=(c=p.label)!==null&&c!==void 0?c:k.label;k.isSortable=(d=p.isSortable)!==null&&d!==void 0?d:k.isSortable;k.format=(f=p.format)!==null&&f!==void 0?f:k.format;k.isKey=(g=p.isKey)!==null&&g!==void 0?g:k.isKey;k.semantics=(h=p.semantics)!==null&&h!==void 0?h:k.semantics;k.matchingStrategy=(i=p.matchingStrategy)!==null&&i!==void 0?i:k.matchingStrategy;k.isHierarchy=(j=p.isHierarchy)!==null&&j!==void 0?j:false;return k;}return a;}(A.AttributeMetadataBase));e.AttributeMetadata=a;});})();
