/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/base/Log'],function(L){"use strict";var l={};var T={};T.reset=function(){l={};};T.getMetadata=function(s){if(!s){return null;}var a=s.replace("sap-ui-theme-","").replace(/\./g,"-");if(l[a]){return l[a];}var m,M;var b=window.getComputedStyle(document.body||document.documentElement);var v=b.getPropertyValue("--sapUiTheme-"+a).trim();if(v){M=b.getPropertyValue("--sapThemeMetaData-UI5-"+a).trim();}if(!M){var o=document.createElement("span");o.classList.add("sapThemeMetaData-UI5-"+a);document.documentElement.appendChild(o);var d=window.getComputedStyle(o).getPropertyValue("background-image");document.documentElement.removeChild(o);var D=/\(["']?data:text\/plain;utf-8,(.*?)['"]?\)/i.exec(d);if(!D||D.length<2){return null;}var c=D[1];if(c.charAt(0)!=="{"&&c.charAt(c.length-1)!=="}"){try{c=decodeURI(c);}catch(e){}}c=c.replace(/\\"/g,'"');M=c.replace(/%20/g," ");}try{m=JSON.parse(M);l[a]=m;}catch(e){L.error("Could not parse theme metadata for library "+a+".");}return m;};return T;});
