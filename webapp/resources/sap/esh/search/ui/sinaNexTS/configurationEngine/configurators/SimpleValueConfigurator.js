/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","../../core/core","./Configurator"],function(r,e,c,C){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.SimpleValueConfigurator=void 0;var S=(function(a){_(S,a);function S(){return a!==null&&a.apply(this,arguments)||this;}S.prototype.initAsync=function(){if(c.isObject(this.configuration)){this.value=this.configuration.value;this.force=this.configuration.force;return;}this.value=this.configuration;this.force=false;};S.prototype.isSuitable=function(o){if(c.isString(o.type)&&["string","integer","object"].indexOf(o.type)>=0){return true;}return false;};S.prototype.configure=function(v){if(this.isInitialOrForced(v)){return this.value;}return v;};return S;}(C.Configurator));e.SimpleValueConfigurator=S;});})();
