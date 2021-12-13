/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){var _=(this&&this.__extends)||(function(){var e=function(d,b){e=Object.setPrototypeOf||({__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;})||function(d,b){for(var p in b)if(Object.prototype.hasOwnProperty.call(b,p))d[p]=b[p];};return e(d,b);};return function(d,b){if(typeof b!=="function"&&b!==null)throw new TypeError("Class extends value "+String(b)+" is not a constructor or null");e(d,b);function a(){this.constructor=d;}d.prototype=b===null?Object.create(b):(a.prototype=b.prototype,new a());};})();sap.ui.define(["require","exports","./ConfigFormatter"],function(r,e,C){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.ConfigMetadataFormatter=void 0;var m={type:"object",typeName:"DataSources",properties:[{name:"dataSources",multiple:true,getElementId:function(d){return d.id;},type:{type:"object",typeName:"DataSource",properties:[{name:"label",type:"string",},{name:"labelPlural",type:"string",},{name:"attributesMetadata",multiple:true,getElementId:function(b){return b.id;},type:{type:"object",typeName:"AttributeMetadata",properties:[{name:"label",type:"string",},{name:"format",type:"string",},],},},],},},],};var a=(function(b){_(a,b);function a(c){return b.call(this,m,c)||this;}return a;}(C.ConfigFormatter));e.ConfigMetadataFormatter=a;});})();
