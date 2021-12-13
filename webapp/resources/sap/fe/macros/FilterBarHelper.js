/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/fe/macros/CommonHelper","sap/fe/core/CommonUtils","sap/fe/core/helpers/ModelHelper"],function(C,a,M){"use strict";var F={checkIfBasicSearchIsVisible:function(c,h,e){var i=e&&c.getInterface(1);var E=i.getPath();var s=M.getEntitySetPath(E);var b=a.getSearchRestrictions(s,i.getModel());if(h===undefined){return Boolean(b&&b.Searchable);}if(h!=="true"){return Boolean(!b||b.Searchable);}return false;}};F.checkIfBasicSearchIsVisible.requiresIContext=true;return F;},true);
