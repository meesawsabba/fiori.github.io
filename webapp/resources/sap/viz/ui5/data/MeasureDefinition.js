/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['sap/ui/core/Element','sap/viz/library'],function(E,l){"use strict";var M=E.extend("sap.viz.ui5.data.MeasureDefinition",{metadata:{library:"sap.viz",properties:{group:{type:"int",group:"Misc",defaultValue:1},value:{type:"any",group:"Data",defaultValue:null},name:{type:"string",group:"Misc",defaultValue:null},identity:{type:"string",group:"Misc",defaultValue:null},format:{type:"any",group:"Misc",defaultValue:null},range:{type:"any[]",group:"Misc",defaultValue:[]},unit:{type:"string",group:"Misc",defaultValue:null}}}});M.prototype._getAdapter=function(){var t=this,b=this.getBindingInfo("value"),v,p,T,f;if(!b){v=this.getValue();return function(){return v;};}f=b.formatter;if(b.parts.length>1){if(f){return function(c){var V=[];b.parts.forEach(function(I,i){var v=c.getProperty(I.path);if(T){v=T.formatValue(v,"string");}V.push(v);});return f.call(t,V,c);};}else{throw new Error("MeasureDefinition doesn't support calculated bindings yet");}}else{p=b.parts[0].path;T=b.parts[0].type;if(!(T||f)){return function(c){return c.getProperty(p);};}return function(c){var v=c.getProperty(p);if(T){v=T.formatValue(v,"string");}if(f){v=f.call(t,v,c);}return v;};}};M.prototype._setUnitBinding=function(v){this._sUnitBinding=v;};M.prototype._getUnitBinding=function(){return this._sUnitBinding;};return M;});
