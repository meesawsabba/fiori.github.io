/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SinaObject"],function(r,e,S){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.HierarchyNode=void 0;var H=(function(a){_(H,a);function H(p){var b=a.call(this,p)||this;b.id=p.id;b.label=p.label;b.count=p.count;b.hasChildren=p.hasChildren;b.parentNode=null;b.childNodes=[];b.childNodeMap={};return b;}H.prototype.equals=function(o){return this.id===o.id;};H.prototype.addChildNode=function(c){if(this.childNodeMap[c.id]){return;}this.childNodes.push(c);this.childNodeMap[c.id]=c;c.parentNode=this;};return H;}(S.SinaObject));e.HierarchyNode=H;});})();
