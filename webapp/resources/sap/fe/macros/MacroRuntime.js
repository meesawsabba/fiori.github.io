/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define([],function(){"use strict";var _={};var p=new DOMParser();var x=function(s){var o="";var i;for(var a=arguments.length,v=new Array(a>1?a-1:0),b=1;b<a;b++){v[b-1]=arguments[b];}for(i=0;i<v.length;i++){o+=s[i];o+=v[i];}o+=s[i];var c=p.parseFromString(o,"text/xml");return c;};_.xml=x;return _;},false);
