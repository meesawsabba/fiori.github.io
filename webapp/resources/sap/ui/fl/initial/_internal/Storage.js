/*
 * ! OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/fl/initial/_internal/StorageUtils","sap/ui/fl/Utils","sap/ui/fl/initial/_internal/StorageResultMerger","sap/ui/fl/initial/_internal/storageResultDisassemble"],function(S,F,a,s){"use strict";function _(C,o,p){if(!o.layers||(o.layers[0]!=="ALL"&&o.layers.indexOf("CUSTOMER")===-1)){delete C.version;return C;}if(p.version!==undefined){C.version=p.version;return C;}var v=F.getUrlParameter(sap.ui.fl.Versions.UrlParameter);if(v===null){delete C.version;}else{C.version=parseInt(v);}return C;}function b(p,C){var h=C.map(function(o){var i=Object.assign({},p,{url:o.url,path:o.path});i=_(i,o,p);return o.loadConnectorModule.loadFlexData(i).then(function(r){return r||S.getEmptyFlexDataResponse();}).catch(S.logAndResolveDefault.bind(undefined,S.getEmptyFlexDataResponse(),o,"loadFlexData"));});return Promise.all(h);}function c(r){var h=[];r.forEach(function(R){if(Array.isArray(R)){h=h.concat(R);}else{h.push(R);}});return h;}function d(r){return r.map(function(R){return s(R);});}function e(r){return Promise.resolve(r).then(c).then(d).then(c).then(a.merge);}function f(p){return S.getStaticFileConnector().then(b.bind(this,p));}var g={};g.completeFlexData=function(p){if(!p||!p.reference){return Promise.reject("No reference was provided");}return Promise.all([f(p),p.partialFlexData]).then(e);};g.loadFlexData=function(p){if(!p||!p.reference){return Promise.reject("No reference was provided");}return S.getLoadConnectors().then(b.bind(this,p)).then(e);};return g;});
