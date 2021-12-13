/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/base/ManagedObjectMetadata","sap/base/util/ObjectPath","sap/ui/util/XMLHelper","sap/ui/core/XMLTemplateProcessor","sap/ui/core/util/XMLPreprocessor","sap/base/util/isPlainObject","sap/base/Log"],function(M,a,O,X,b,c,d,L){"use strict";return{bySelectorExtensionPointEnabled:function(s,A,v){return Promise.resolve(this.bySelector(s,A,v));},bySelectorTypeIndependent:function(s,A,v){var C;return Promise.resolve().then(function(){if(s&&s.name){v=v||this.bySelector(s.viewSelector,A);return this.getExtensionPointInfo(s.name,v).then(function(e){return e?e.parent:undefined;});}C=this.getControlIdBySelector(s,A);return this._byId(C,v);}.bind(this));},bySelector:function(s,A,v){var C=this.getControlIdBySelector(s,A);return this._byId(C,v);},getControlIdBySelector:function(s,A){if(!s){return undefined;}if(typeof s==="string"){s={id:s};}var C=s.id;if(s.idIsLocal){if(A){C=A.createId(C);}else{throw new Error("App Component instance needed to get a control's ID from selector");}}return C;},getSelector:function(C,A,m){var s=C;if(typeof s!=="string"){s=(C)?this.getId(C):undefined;}else if(!A){throw new Error("App Component instance needed to get a selector from string ID");}if(m&&(m.id||m.idIsLocal)){throw new Error("A selector of control with the ID '"+s+"' was requested, "+"but core properties were overwritten by the additionally passed information.");}var v=this.checkControlId(s,A);if(!v){throw new Error("Generated ID attribute found - to offer flexibility a stable control ID is needed to assign the changes to, but for this control the ID was generated by SAPUI5 "+s);}var S=Object.assign({},m,{id:"",idIsLocal:false});if(this.hasLocalIdSuffix(s,A)){var l=A.getLocalId(s);S.id=l;S.idIsLocal=true;}else{S.id=s;}return S;},checkControlId:function(C,A){var s=C instanceof M?C.getId():C;var i=a.isGeneratedId(s);return!i||this.hasLocalIdSuffix(C,A);},hasLocalIdSuffix:function(C,A){var s=(C instanceof M)?C.getId():C;if(!A){L.error("Determination of a local ID suffix failed due to missing app component for "+s);return false;}return!!A.getLocalId(s);},_checkAndPrefixIdsInFragment:function(f,I){var p=X.getParseError(f);if(p.errorCode!==0){return Promise.reject(new Error(f.parseError.reason));}var C=f.documentElement;var r=[],e=[];if(C.localName==="FragmentDefinition"){r=this._getElementNodeChildren(C);}else{r=[C];}e=[].concat(r);function o(g){e.push(g);}var P=Promise.resolve();for(var i=0,n=r.length;i<n;i++){P=P.then(this._traverseXmlTree.bind(this,o,r[i]));}return P.then(function(){for(var j=0,m=e.length;j<m;j++){if(e[j].getAttribute("id")){e[j].setAttribute("id",I+"."+e[j].getAttribute("id"));}else{throw new Error("At least one control does not have a stable ID");}}return C;});},_getElementNodeChildren:function(N){var C=[];var e=N.childNodes;for(var i=0,n=e.length;i<n;i++){if(e[i].nodeType===1){C.push(e[i]);}}return C;},_getControlMetadataInXml:function(C){var s=this._getControlTypeInXml(C).replace(/\./g,"/");return new Promise(function(r,R){sap.ui.require([s],function(e){if(e.getMetadata){r(e.getMetadata());}R(new Error("getMetadata function is not available on control type"));},function(){R(new Error("Required control '"+s+"' couldn't be found"));});});},getControlMetadata:function(C){},getLibraryName:function(C){return this.getControlMetadata(C).then(function(m){return m.getLibraryName();});},_getControlTypeInXml:function(C){var s=C.namespaceURI;s=s?s+".":"";s+=C.localName;return s;},_traverseXmlTree:function(C,r){function e(p,o,i){return Promise.resolve().then(function(){if(!i){return this._getControlMetadataInXml(o,true);}return undefined;}.bind(this)).then(function(m){return m&&m.getAllAggregations();}).then(function(A){var f=this._getElementNodeChildren(o);var P=Promise.resolve();f.forEach(function(g){var I=A&&A[g.localName];P=P.then(function(){return e.call(this,o,g,I).then(function(){if(!I){C(g);}});}.bind(this));}.bind(this));return P;}.bind(this));}return e.call(this,r,r,false);},_getSerializedValue:function(p){if(this._isSerializable(p)&&typeof p!=="string"){return JSON.stringify(p);}return p;},_isSerializable:function(p){return d(p)||Array.isArray(p)||Object(p)!==p;},_escapeCurlyBracketsInString:function(p){return typeof p==="string"?p.replace(/({|})/g,"\\$&"):p;},_templateFragment:function(f,p){return Promise.resolve(c.process(b.loadTemplate(f,"fragment"),{name:f},p));},getPropertyBindingOrProperty:function(C,p){var P=this.getPropertyBinding(C,p);if(P){return Promise.resolve(P);}return this.getProperty(C,p);},setPropertyBindingOrProperty:function(C,p,B){var i=B&&(B.path||B.parts);var I=B&&typeof B==="string"&&B.substring(0,1)==="{"&&B.slice(-1)==="}";var o=i||I?"setPropertyBinding":"setProperty";this[o](C,p,B);},setVisible:function(C,v){},getVisible:function(C){},setStashed:function(C,s){},getStashed:function(C){},bindProperty:function(C,p,B){},unbindProperty:function(C,p){},bindAggregation:function(C,A,B){},unbindAggregation:function(C,A){},setProperty:function(C,p,P){},getProperty:function(C,p){},isPropertyInitial:function(C,p){},setPropertyBinding:function(C,p,P){},getPropertyBinding:function(C,p){},createAndAddCustomData:function(C,s,v,A){},createControl:function(C,A,v,s,S){},applySettings:function(C,s){},_byId:function(i,v){},getId:function(C){},getParent:function(C){},getControlType:function(C){},setAssociation:function(p,n,i){},getAssociation:function(p,n){},getAllAggregations:function(C){},getAggregation:function(p,n){},insertAggregation:function(p,A,o,i,v,s){},removeAggregation:function(p,A,o){},removeAllAggregation:function(p,A){},getBindingTemplate:function(C,A){},updateAggregation:function(p,A){},findIndexInParentAggregation:function(C){},getParentAggregationName:function(C,p){},findAggregation:function(C,A){},validateType:function(C,A,p,f,i){},instantiateFragment:function(f,n,v){},templateControlFragment:function(f,p,v){},destroy:function(C){},getChangeHandlerModulePath:function(C){return this._getFlexCustomData(C,"flexibility");},_getFlexCustomData:function(C){},getFlexDelegate:function(C){var D;var s=this._getFlexCustomData(C,"delegate");if(typeof s==="string"){try{D=JSON.parse(s);if(D.payload===undefined){D.payload={};}}catch(e){L.error("Flex Delegate for control "+this.getId(C)+" is malformed",e.message);}}return D;},attachEvent:function(C,e,f,D){},detachEvent:function(C,e,f){},getExtensionPointInfo:function(e,v){}};});
