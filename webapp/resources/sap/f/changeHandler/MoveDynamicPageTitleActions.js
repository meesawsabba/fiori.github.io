/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var M={};var A="actions";M.applyChange=function(c,C,p){var m=p.modifier;var v=p.view;var a=p.appComponent;var o=c.getDefinition().content.movedElements[0];var t=o.targetIndex;var b;var O;return Promise.resolve().then(m.bySelector.bind(m,o.selector,a,v)).then(function(e){b=e;return m.getAggregation(C,A);}).then(function(B){var P;B.some(function(d,i){if(m.getId(d)===m.getId(b)){O=i;P=Promise.resolve().then(m.removeAggregation.bind(m,C,A,d)).then(m.insertAggregation.bind(m,C,"dependents",d,undefined,v));return true;}return false;});return P.then(function(){c.setRevertData({index:O,sourceParent:m.getSelector(C,a),aggregation:A});return m.insertAggregation(C,A,b,t,v);});});};M.revertChange=function(c,C,p){var m=p.modifier;var v=p.view;var a=p.appComponent;var o=c.getDefinition().content.movedElements[0];var r=c.getRevertData();var b;var t;var s;b=m.bySelector(o.selector,a,v);t=r?r.index:o.targetIndex;s=o.sourceIndex;return Promise.resolve().then(m.removeAggregation.bind(m,C,A,b,t,v)).then(m.insertAggregation.bind(m,C,A,b,s,v));};M.completeChangeContent=function(c,s,p){var m=p.modifier,a=p.appComponent,C=c.getDefinition();C.content={movedElements:[],targetAggregation:s.target.aggregation,targetContainer:s.selector};s.movedElements.forEach(function(e){var E=e.element||m.bySelector(e.id,a);C.content.movedElements.push({selector:m.getSelector(E,a),sourceIndex:e.sourceIndex,targetIndex:e.targetIndex});});};M.getCondenserInfo=function(c){var C=c.getContent();var r=c.getRevertData();return{affectedControl:C.movedElements[0].selector,classification:sap.ui.fl.condenser.Classification.Move,sourceContainer:r.sourceParent,targetContainer:C.targetContainer,sourceIndex:r.index,sourceAggregation:r.aggregation,targetAggregation:C.targetAggregation,setTargetIndex:function(c,n){c.getContent().movedElements[0].targetIndex=n;},getTargetIndex:function(c){return c.getContent().movedElements[0].targetIndex;}};};return M;},true);
