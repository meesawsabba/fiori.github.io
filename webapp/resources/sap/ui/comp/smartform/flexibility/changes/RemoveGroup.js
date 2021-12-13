/*
 * ! SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define([],function(){"use strict";var R={};R.applyChange=function(c,g,p){var m=p.modifier;var v=p.view;var f=m.getParent(g);var a;var G;return Promise.resolve().then(m.findIndexInParentAggregation(g)).then(function(i){G=i;if(m.getControlType(f)==="sap.ui.layout.form.Form"){a="formContainers";return m.removeAggregation(f,"formContainers",g,v);}a="groups";return m.removeAggregation(f,"groups",g,v);}).then(m.insertAggregation.bind(m,f,"dependents",g,0,v)).then(function(){c.setRevertData({groupIndex:G,aggregation:a});});};R.completeChangeContent=function(c,s){var C=c.getDefinition();if(!C.content){C.content={};}};R.revertChange=function(c,g,p){var v=p.view;var m=p.modifier;var r=c.getRevertData();var f=m.getParent(g);return Promise.resolve().then(m.removeAggregation.bind(m,f,"dependents",g)).then(m.insertAggregation.bind(m,f,r.aggregation,g,r.groupIndex,v)).then(c.resetRevertData.bind(c));};return R;},true);
