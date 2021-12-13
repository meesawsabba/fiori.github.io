/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/mdc/field/MultiValueFieldDelegate"],function(M){"use strict";var m=Object.assign({},M,{_transformConditions:function(c,k,d){var t=[];for(var i=0;i<c.length;i++){var I={};var C=c[i];I[k]=C.values[0];if(d){I[d]=C.values[1];}t.push(I);}return t;},updateItems:function(p,c,o){var l=o.getBinding("items");var b=o.getBindingInfo("items");var i=b.path;var t=b.template;var k=t.getBindingInfo("key");var K=k&&k.parts[0].path;var d=t.getBindingInfo("description");var D=d&&d.parts[0].path;var a=l.getModel();a.setProperty(i,this._transformConditions(c,K,D));}});return m;},false);
