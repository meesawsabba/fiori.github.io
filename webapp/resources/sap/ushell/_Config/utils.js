// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([],function(){"use strict";function i(p,C){var e=[];var n=[];var o=C;var f=false;var P=p.split("/");P.shift();P.forEach(function(g){if(!f&&o.hasOwnProperty(g)){o=o[g];e.push(g);return;}f=true;n.push(g);});return{contractPart:"/"+e.join("/"),nonContractPart:n};}function a(v){return v&&v.isA&&v.isA("sap.ui.model.Context");}function w(C,p,o,v){var D=o;p.forEach(function(P,I){if(I===p.length-1){D[P]=v;return;}if(!D.hasOwnProperty(P)){throw new Error("Cannot find "+P+" inside "+C);}D=D[P];});}function c(p){var P=function(e){return p+e;};if(typeof p==="object"){var S="/";P=function(e){var f=e.split(S);f.shift();var F=f.shift();return p[F]+(f.length>0?S+f.join(S):"");};}return P;}function b(p,m,P){var f=c(P);var F=f(p);if(a(m)&&p.charAt(0)!=="/"){var r=m.getPath()+"/"+p;F=f(r);}return F;}function s(f,C,m,p){m.setData=function(P,D){throw new Error("not yet implemented");};m.setProperty=function(P,D,M){var F=b(P,M,p);var I=i(F,C);if(I.nonContractPart.length===0){f.emit(I.contractPart,D);return;}var B=f.last(I.contractPart);w(I.contractPart,I.nonContractPart,B,D);f.emit(I.contractPart,B);};return m;}function d(f,C,p,e){var m,S,g,P;if(typeof p==="string"){var h=p;P=h;var I=f.last(h);if(Object.prototype.toString.apply(I)!=="[object Object]"){throw new Error("Cannot bind on leaf property of Configuration: '"+h+"'");}m=new e(I);g=m.setData.bind(m);f.on(h).do(function(v){g(v);});return s(f,C,m,P);}if(Object.prototype.toString.apply(p)==="[object Object]"){var D=p;var M=Object.keys(D).reduce(function(M,k){var j=D[k];M[k]=f.last(j);f.on(j).do(function(k,v){S("/"+k,v);}.bind(null,k));return M;},{});m=new e(M);S=m.setProperty.bind(m);return s(f,C,m,D);}throw new Error("Invalid parameter provided to createModel. Must be an object or a string.");}return{createModel:d};},false);
