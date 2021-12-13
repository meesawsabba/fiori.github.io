/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/formatters/TableFormatterTypes"],function(T){"use strict";var M=T.MessageType;var c=function(b){var d;if(typeof b==="string"){return b;}switch(b){case 1:d=M.Error;break;case 2:d=M.Warning;break;case 3:d=M.Success;break;case 5:d=M.Information;break;default:d=M.None;}return d;};c.__functionName="sap.fe.core.formatters.CriticalityFormatter#criticalityFormat";var a=function(n){if(a.hasOwnProperty(n)){for(var _=arguments.length,A=new Array(_>1?_-1:0),b=1;b<_;b++){A[b-1]=arguments[b];}return a[n].apply(this,A);}else{return"";}};a.criticalityFormat=c;return a;},true);
