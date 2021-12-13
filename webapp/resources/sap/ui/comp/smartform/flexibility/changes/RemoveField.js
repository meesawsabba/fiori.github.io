/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var R={};R.applyChange=function(c,f,p){var m=p.modifier;var v=p.view;var g=m.getParent(f);if(g){return Promise.resolve().then(m.findIndexInParentAggregation.bind(m,f)).then(function(F){c.setRevertData({fieldIndex:F});return m.removeAggregation(g,"groupElements",f,v);});}return Promise.resolve();};R.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};R.revertChange=function(c,f,p){var v=p.view;var m=p.modifier;var F=c.getRevertData().fieldIndex;var g=m.getParent(f);return Promise.resolve().then(m.insertAggregation.bind(m,g,"groupElements",f,F,v)).then(c.resetRevertData.bind(c));};return R;},true);
