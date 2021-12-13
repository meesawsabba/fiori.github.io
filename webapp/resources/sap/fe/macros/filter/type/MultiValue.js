/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Value"],function(V){"use strict";return V.extend("sap.fe.macros.filter.type.MultiValue",{formatConditionValues:function(v){return v;},formatValue:function(v,i){var r=v;if(typeof r==="string"){r=r.split("; ");}if(Array.isArray(r)){r=r.map(function(s){return V.prototype.formatValue.call(this,s,this.getElementTypeName(i));}.bind(this)).filter(function(s){return s!==undefined;});}return r||[];},parseValue:function(v,s){var o=this.getOperator();if(!v){v=[];}return v.map(function(a){return o.format({values:a||[]});});}});},true);
