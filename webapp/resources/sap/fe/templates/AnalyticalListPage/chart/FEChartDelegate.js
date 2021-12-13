/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/ChartDelegate"],function(B){"use strict";var C=Object.assign({},B);C.rebindChart=function(m,b){var i=m.getBindingContext("pageInternal");var t=i.getProperty(i.getPath()+"/alpContentView");if(!t||t!=="Table"){B.rebindChart(m,b);}};return C;},false);
