/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/core/format/NumberFormat","sap/ui/core/Core"],function(N,C){"use strict";var T={};T._oCurrencyFormatter=null;T.formatCurrency=function(v,c,m){return T._getCurrencyFormatter(m).format(v,c)||"";};T._getCurrencyFormatter=function(m){T._oCurrencyFormatter=N.getCurrencyInstance({showMeasure:false,maxFractionDigits:m},C.getConfiguration().getLocale());return T._oCurrencyFormatter;};return T;},true);
