/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2021 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/helpers/BindingExpression"],function(B){"use strict";var _={};var r=B.resolveBindingString;var c=B.constant;var e=B.equal;var a=B.and;var n=B.not;var b=B.compileBinding;var d=function(p){var h=r(p===null||p===void 0?void 0:p.header);var t=r(p===null||p===void 0?void 0:p.tabTitle);var f=c(p.headerVisible);return b(a(f,n(e(h,t))));};_.buildExpressionForHeaderVisible=d;return _;},false);
