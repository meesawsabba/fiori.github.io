/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define([],function(){"use strict";var T={};T.render=function(r,c){r.write("<div");r.writeControlData(c);r.writeClasses();r.addStyle("position","absolute");r.addStyle("pointer-events","none");r.writeStyles();r.write("/>");};return T;},true);
