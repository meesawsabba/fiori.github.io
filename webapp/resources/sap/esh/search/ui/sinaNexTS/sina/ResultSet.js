/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./SinaObject","../core/Log","../core/core"],function(r,e,S,L,c){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.ResultSet=void 0;var R=(function(a){_(R,a);function R(p){var b,d,f,g,h;var i=a.call(this,p)||this;i.id=c.generateId();i.items=[];i.log=new L.Log();i.id=(b=p.id)!==null&&b!==void 0?b:i.id;i.title=(d=p.title)!==null&&d!==void 0?d:i.title;i.items=(f=p.items)!==null&&f!==void 0?f:i.items;i.query=(g=p.query)!==null&&g!==void 0?g:i.query;i.log=(h=p.log)!==null&&h!==void 0?h:i.log;return i;}R.prototype.toString=function(){var b=[];for(var i=0;i<this.items.length;++i){var d=this.items[i];b.push(d.toString());}return b.join("\n");};return R;}(S.SinaObject));e.ResultSet=R;});})();
