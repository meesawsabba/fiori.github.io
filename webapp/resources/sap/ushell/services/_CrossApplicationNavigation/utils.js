// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define(["sap/base/util/ObjectPath","sap/base/Log","sap/ushell/utils/UrlParsing"],function(O,L,U){"use strict";var a={};a.extractGetLinksParameterOptions=function(g){return a.parseGetLinksParameters(g).filter(function(p){return Object.keys(p.options).length>0;}).map(function(p){return{name:p.name,options:p.options};});};a.extractGetLinksParameterDefinition=function(g){return a.parseGetLinksParameters(g).reduce(function(r,p){r[p.name]=p.value;return r;},{});};a.parseGetLinksParameters=function(g){if(Object.prototype.toString.apply(g)!=="[object Object]"){return[];}var p=JSON.parse(JSON.stringify(g));return Object.keys(p).map(function(P){var v=p[P];var o={};if(Object.prototype.toString.apply(v)==="[object Object]"){v=v.value;delete p[P].value;o=p[P];}return{name:P,value:v,options:o};});};a.safeParseToObject=function(o){try{return JSON.parse(o);}catch(e){L.error("Cannot parse the given string to object",o,"sap.ushell.services.CrossApplicationNavigation");}return null;};a.createAppStateFromData=function(d){L.warning("Deprecated API call of '_CrossApplicationNavigation.utils.createAppStateFromData'. Please use 'createAppStateFromDataAsync' instead",null,"sap.ushell.services._CrossApplicationNavigation.utils");var A=sap.ushell.Container.getService("AppState");var o=A.createEmptyAppState(null);o.setData(d);o.save();return o.getKey();};a.createAppStateFromDataAsync=function(d){return sap.ushell.Container.getServiceAsync("AppState").then(function(A){var o=A.createEmptyAppState(null);o.setData(d);o.save();return o.getKey();});};a.extractParameter=function(i,p){var I;var P=null;if(typeof i==="string"){if(i.indexOf(p+"=")===-1){return{intent:i,data:null};}var o=U.parseShellHash(i);if(!o){return{intent:i,data:null};}P=o.params[p];delete o.params[p];I=U.constructShellHash(o);return{intent:I,data:P};}if(Object.prototype.toString.apply(i)==="[object Object]"){var s=O.get("target.shellHash",i);if(typeof s==="string"){var r=a.extractParameter(s,p);i.target.shellHash=r.intent;return{intent:i,data:r.data};}var b=i.params;if(b&&b[p]){P=typeof b[p]==="string"?[b[p]]:b[p];delete b[p];}return{intent:i,data:P};}L.error("Invalid input parameter","expected string or object","sap.ushell.services.CrossApplicationNavigation");return{intent:i};};a.addXAppStateFromParameter=function(i,s){var x=a.extractParameter(i,s);var I=x.intent;var X=x.data&&x.data[0];if(!X){return;}var A=a.safeParseToObject(X);if(!A){return;}var b=a.createAppStateFromData(A);a.injectParameter(I,"sap-xapp-state",b);};a.addXAppStateFromParameterAsync=function(i,s){var x=a.extractParameter(i,s);var I=x.intent;var X=x.data&&x.data[0];if(!X){return Promise.resolve();}var A=a.safeParseToObject(X);if(!A){return Promise.resolve();}return a.createAppStateFromDataAsync(A).then(function(b){a.injectParameter(I,"sap-xapp-state",b);});};a.injectParameter=function(i,p,P){if(typeof i==="string"){var o=U.parseShellHash(i);o.params[p]=P;return U.constructShellHash(o);}if(Object.prototype.toString.apply(i)==="[object Object]"){var s=O.get("target.shellHash",i);if(typeof s==="string"){i.target.shellHash=a.injectParameter(s,p,P);return i;}if(!i.params){i.params={};}i.params[p]=P;}return i;};a._injectParameters=function(p){var P=p.inject,i=(p.injectEmptyString||{}),t=p.type,A=p.args;function s(v,I){return(v||(v===""&&I));}if(t.isPlainObject(A)){if(A.target&&A.target.shellHash){if(typeof A.target.shellHash==="string"){A.target.shellHash=a._injectParameters({inject:P,injectEmptyString:i,type:p.type,args:A.target.shellHash});}return A;}var n=Object.keys(P).reduce(function(I,b){var v=P[b],c=(i[b]===true);if(s(v,c)&&typeof I==="string"){var r=new RegExp("[&]"+b);var h=!r.test(I);if(h){var d=I?"&":"";I+=d+b+"="+v;}}else if(s(v,c)&&!I.hasOwnProperty(b)){I[b]=v;}return I;},A.params||{});if(n&&Object.keys(n).length>0){A.params=n;}return A;}var S=A;if(S){Object.keys(P).forEach(function(b){var v=P[b];var I=(i[b]===true);var r=new RegExp("[?&]"+b);var h=!r.test(S);if(s(v,I)&&h){var c=S.indexOf("?")>-1?"&":"?";S+=c+b+"="+v;}});}return S;};a.injectStickyParameters=function(p){L.warning("Deprecated API call of '_CrossApplicationNavigation.utils.injectStickyParameters'. Please use 'injectStickyParametersAsync' instead",null,"sap.ushell.services._CrossApplicationNavigation.utils");var A=sap.ushell.Container.getService("AppLifeCycle");return a._injectStickyParameters(p,A);};a.injectStickyParametersAsync=function(p){return sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function(A){return a._injectStickyParameters(p,A);});};a._injectStickyParameters=function(p,A){if(!A||Object.keys(A).length<=0){return p.args;}var c=A.getCurrentApplication();if(!c||Object.keys(c).length<=0){return p.args;}var o=p.appLifeCycle;var t=p.technicalParameters;var s=t.getParameters({sticky:true}).reduce(function(S,n){var N=n.name;var C=c.componentInstance;var d=c.applicationType;var e;if(d==="UI5"){e={};}else{e=o.getCurrentApplication().container;}var f=t.getParameterValueSync(N,C,e,d);var g=n.stickyName||N;S[g]=f;return S;},{});var b={type:p.type,inject:s,args:p.args};return a._injectParameters(b);};return a;});
