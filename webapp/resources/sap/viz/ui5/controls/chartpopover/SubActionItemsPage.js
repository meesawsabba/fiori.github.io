/*!
 * SAPUI5
 * (c) Copyright 2009-2021 SAP SE. All rights reserved.
 */
sap.ui.define(['sap/ui/core/Control','sap/m/List','sap/m/ActionListItem'],function(C,L,A){"use strict";var S=C.extend('sap.viz.ui5.controls.chartpopover.SubActionItemsPage',{metadata:{properties:{items:{type:'sap.m.ListBase[]'}}},renderer:{render:function(r,c){r.openStart('div').class("viz-controls-chartPopover-subActionItemsPage").openEnd().renderControl(c._oList).close('div');}}});S.prototype.init=function(){this._oList=new L({});};S.prototype.onAfterRendering=function(){setTimeout(function(){this._oList.focus();}.bind(this),10);};S.prototype.exit=function(){if(this._oList){this._oList.destroy();this._oList=null;}};S.prototype.setItems=function(a){this._oList.removeAllItems();var b;for(var i=0;i<a.length;i++){b=new A({text:a[i].text,press:a[i].press?a[i].press:function(){},tooltip:a[i].text});this._oList.addItem(b);}};S.prototype._createId=function(i){return this.getId()+"-"+i;};return S;});
