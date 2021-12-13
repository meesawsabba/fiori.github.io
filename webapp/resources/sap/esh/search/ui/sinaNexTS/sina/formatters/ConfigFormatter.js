/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./Formatter","../../configurationEngine/configuratorFactory"],function(r,e,F,c){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.ConfigFormatter=void 0;var C=(function(a){_(C,a);function C(t,b){var d=a.call(this)||this;d.type=t;d.configuration=b;return d;}C.prototype.initAsync=function(){return c.createConfiguratorAsync({type:this.type,configuration:this.configuration,}).then(function(b){this.configurator=b;}.bind(this));};C.prototype.formatAsync=function(o){return this.configurator.configureAsync(o);};C.prototype.format=function(o){return this.configurator.configure(o);};return C;}(F.Formatter));e.ConfigFormatter=C;});})();
