/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./AttributeType","./AttributeMetadataBase"],function(r,e,A,a){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.AttributeGroupMetadata=void 0;var b=(function(c){_(b,c);function b(p){var d,f,g,h,i,j;var k=c.call(this,p)||this;k.type=A.AttributeType.Group;k.isSortable=false;k.attributes=[];k.id=(d=p.id)!==null&&d!==void 0?d:k.id;k.usage=(f=p.usage)!==null&&f!==void 0?f:k.usage;k.label=(g=p.label)!==null&&g!==void 0?g:k.label;k.isSortable=(h=p.isSortable)!==null&&h!==void 0?h:k.isSortable;k.template=(i=p.template)!==null&&i!==void 0?i:k.template;k.attributes=(j=p.attributes)!==null&&j!==void 0?j:k.attributes;return k;}return b;}(a.AttributeMetadataBase));e.AttributeGroupMetadata=b;});})();
