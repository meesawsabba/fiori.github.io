// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
(function(){"use strict";var d=(!window.sap||!sap.ui||!sap.ui.define)?function(v,c){return c();}:sap.ui.define;return d([],function(){var _={pendingEvents:{},subscribers:{},dispatchOperations:{},store:c(),dispatchTimeoutIds:new Set()};function c(){return{nextKey:0,objectToKey:new WeakMap(),keyToObject:{}};}function l(M,D,C){var L=sap.ui.require("sap/base/Log");if(L){L.error(M,D,"sap.ushell.EventHub");return;}}function a(o){var M="An exception was raised while executing a registered callback on event '"+o.eventName+"'",D="Data passed to the event were: '"+o.eventData+"'";if(o.error.stack){D+=" Error details: "+o.error.stack;}l(M,D,o.fnCausedBy);}function s(o,C,D){var R;try{R=C(D);}catch(v){a({eventName:o,eventData:D,fnCausedBy:C,error:v});}return R;}function J(H){if(typeof arguments[2]==="function"){return y(H,arguments[2]);}return arguments[2];}function b(H){if(typeof arguments[2]==="string"&&arguments[2].indexOf("<function")===0){return z(H,arguments[2]);}return arguments[2];}function e(H,D,P){if(typeof D==="object"||typeof D==="function"){try{var S=[D,J.bind(null,H)];if(P){S.push(3);}return JSON.stringify.apply(JSON,S);}catch(o){l(""+o,o.stack,e);}}return D;}function f(H,D){try{return JSON.parse(D,b.bind(null,H));}catch(o){return D;}}function g(H,o,S){if(!H.subscribers[o]){H.subscribers[o]=[];}H.subscribers[o].push(S);}function u(H,o,v){H.subscribers[o]=(H.subscribers[o]||[]).map(function(S){return S.filter(function(L){return L.fn!==v;});}).filter(function(G){return G.length>0;});}function h(){var D,o=new Promise(function(R){D=R;}),v={dispatching:o,cancelled:false,cancel:function(){v.cancelled=true;},complete:function(){D();}};return v;}function i(H,o){if(!H.subscribers.hasOwnProperty(o)){return null;}var D=h(),S=H.subscribers[o],G=S.map(function(v){return j(H,o,v,D,0);});Promise.all(G).then(D.complete,D.complete);return D;}function j(H,o,S,D,v){var O=S.length,C=S.slice(v);return C.reduce(function(P,F){return P.then(function(G){if(D.cancelled){if(G){u(H,o,F.fn);}return G;}return n(H,o,F,S).then(function(I){if(I){D.cancelled=true;}return I;});});},Promise.resolve(false)).then(function(F){if(!F&&O<S.length){return j(H,o,S,D,O);}return F;});}function n(H,o,S,v){return new Promise(function(R){var D=f(H,H.pendingEvents[o]);var C=setTimeout(function(){H.dispatchTimeoutIds.delete(C);if(S.called&&v.offed){R(false);return;}S.called=true;var O=v.offed;s(o,S.fn,D);var F=v.offed;if(F){u(H,o,S.fn);}R(!O&&F);},0);H.dispatchTimeoutIds.add(C);});}function k(H,o,S){return function(){S.forEach(function(L){if(L.called){u(H,o,L.fn);}});S.offed=true;return{off:k(H,o,[])};};}function m(H,o,S){return function(C){var v={fn:C,called:false};S.push(v);if(H.pendingEvents.hasOwnProperty(o)){var D=H.dispatchOperations[o];if(!D){n(H,o,v,S);}else{D.dispatching.then(function(){if(!v.called){n(H,o,v,S);}});}}return{do:m(H,o,S),off:k(H,o,S)};};}function p(H,o){var S=[];g(H,o,S);return{do:m(H,o,S),off:k(H,o,S)};}function q(H,o){var D=p(H,o);D.off();return D;}function r(H,o,D,F){var S=e(H,D);if(!F&&H.pendingEvents.hasOwnProperty(o)&&H.pendingEvents[o]===S){return this;}H.pendingEvents[o]=S;var v=H.dispatchOperations[o];if(v){v.cancel();}var N=i(H,o);H.dispatchOperations[o]=N;return this;}function t(H,o){return f(H,H.pendingEvents[o]);}function w(){var o=Array.prototype.slice.call(arguments);o.shift();var C=0,O=new Array(o.length).join(",").split(",").map(function(){return 1;}),v=[],D={do:function(F){o.forEach(function(G,I){G.do(function(I,V){v[I]=V;C+=O[I];O[I]=0;if(C===o.length){F.apply(null,v);}}.bind(null,I));});return{off:D.off};},off:function(){var F=o.reduce(function(F,G){return G.off();},function(){});return{off:F};}};return D;}function x(H,o){var D=H.dispatchOperations[o];return D?D.dispatching:Promise.resolve();}function y(H,o){if(H.store.objectToKey.has(o)){return H.store.objectToKey.get(o);}H.store.nextKey++;var K="<"+typeof o+">#"+H.store.nextKey;H.store.keyToObject[K]=o;H.store.objectToKey.set(o,K);return K;}function z(H,K){return H.store.keyToObject[K];}function A(H){var o={};o.emit=r.bind(o,H);o.on=p.bind(null,H);o.once=q.bind(null,H);o.last=t.bind(null,H);o.join=w.bind(null,H);o.wait=x.bind(null,H);o._reset=function(H){H.pendingEvents={};H.subscribers={};H.dispatchOperations={};H.store=c();H.dispatchTimeoutIds.forEach(clearTimeout);H.dispatchTimeoutIds=new Set();}.bind(null,H);return o;}function B(C){var D={pendingEvents:{},subscribers:{},dispatchOperations:{},store:c(),dispatchTimeoutIds:new Set()},F=A(D),G=f(D,e(D,C));function H(o){var v=o.charAt(0);if(v.match(/[a-zA-Z0-9]/)){throw new Error("Invalid path separator '"+v+"'. Please ensure path starts with a non alphanumeric character");}var X=o.split(v);X.shift();return X;}function I(v,o){var X=v,Y="";if(arguments.length===2){X=o;Y=v;}return Y+"/"+X.join("/");}function K(v){return Object.prototype.toString.apply(v)==="[object Array]";}function L(v){return Object(v)!==v;}function M(v){return(K(v)?v.length:Object.keys(v).length)===0;}function N(v,X,Y,Z){var $="",a1=v,b1=[];Y.reduce(function(c1,d1,e1){$=I($,[d1]);a1=a1[d1];if(e1===Y.length-1){if(!L(Z)&&!L(a1)&&Object.keys(a1).length>0){var f1,g1=Object.keys(a1).reduce(function(o,d1){o[d1]=true;return o;},{}),h1=Object.keys(Z).some(function(d1){f1=d1;var o=g1.hasOwnProperty(d1);delete g1[d1];var m1=!L(a1[d1])&&Object.keys(a1[d1]).length>0;return!o||m1;}),i1=(Object.keys(g1).length>0),j1=(h1||i1);if(j1){var k1=h1?"One or more values are not defined in the channel contract or are defined as a non-empty object/array, for example, check '"+f1+"'.":"Some keys are missing in the event data: "+Object.keys(g1).join(", ")+".";throw new Error("Cannot write value '"+e(D,Z,true)+"' to path '"+$+"'. "+k1+" All childrens in the value must appear in the channel contract and must have a simple value or should be defined as an empty complex value");}var l1=Object.keys(Z).map(function(d1){return{serializedPath:I($,[d1]),value:Z[d1]};});Array.prototype.push.apply(b1,l1);}c1[d1]=Z;}else if(!c1.hasOwnProperty(d1)){c1[d1]=K(a1)?[]:{};}b1.push({serializedPath:$,value:c1[d1]});return c1[d1];},X);return b1;}function O(o,v){var X="",Y=v.reduce(function(Z,$){X+="/"+$;if(K(Z)&&!$.match(/^[0-9]+$/)){throw new Error("Invalid array index '"+$+"' provided in path '"+X+"'");}if(!Z.hasOwnProperty($)){throw new Error("The item '"+$+"' from path "+X+" cannot be accessed in the object: "+e(D,Z));}return Z[$];},o);return Y;}function P(o,v,X){return v.reduce(function(Y,Z,$){var a1=$===(v.length-1);if(Y.hasOwnProperty(Z)){return Y[Z];}return a1?X:{};},o);}function Q(o,v){v.pop();var X=o,Y=[];return v.reduce(function(Z,$){X=X[$];Y.push($);Z.push({serializedPath:I(Y),value:X});return Z;},[]);}function R(o){return o.map(function(v){var X=v.serializedPath;if(!D.subscribers.hasOwnProperty(X)||D.subscribers[X].length===0){return null;}return{path:X,value:v.value};}).filter(function(v){return!!v;});}function S(o,v){var X=H(o);O(C,X);var Y=N(C,G,X,v);Y.forEach(function(Z){F.emit(Z.serializedPath,Z.value);});}function T(o){var v=H(o),X=O(C,v);return P(G,v,X);}function U(o){var v=H(o),X=I(v),Y=F.last(X),Z=D.pendingEvents.hasOwnProperty(X);if(Z){return F.on(X);}Y=O(C,v);if(typeof Y!=="undefined"&&(L(Y)||!M(f(F,e(F,Y))))){F.emit(X,Y);}return F.on(X);}function V(o){var v=U(o);v.off();return v;}function W(o){var v=H(o),X=Q(G,v),Y=R(X).map(function(Z){return F.wait(Z.path,Z.value);});return Promise.all(Y.concat(F.wait(o)));}return{emit:S,on:U,once:V,last:T,wait:W,join:w.bind(null,F)};}var E=A(_);E.createChannel=B.bind(null);return E;},false);})();
