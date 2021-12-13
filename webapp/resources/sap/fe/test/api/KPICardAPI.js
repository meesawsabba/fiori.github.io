/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
    
 */
sap.ui.define(["./BaseAPI","sap/fe/test/Utils","sap/fe/test/builder/KPIBuilder"],function(B,U,K){"use strict";var a=function(k){if(!U.isOfType(k,K)){throw new Error("oKPIBuilder parameter must be an KPIBuilder instance");}return B.call(this,k);};a.prototype=Object.create(B.prototype);a.prototype.constructor=a;return a;});
