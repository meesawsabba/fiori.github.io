/*
 * SAPUI5
  (c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define("sap/zen/commons/Grid",["sap/zen/commons/utils/jQuery","sap/ui/core/Control","sap/m/VBox","sap/zen/commons/utils/GridUtils","sap/zen/commons/GridRenderer"],function(q,C,V,G){"use strict";var a=C.extend("sap.zen.commons.Grid",{renderer:"sap.zen.commons.GridRenderer",metadata:{properties:{maxRows:{type:"int",group:"Dimension",defaultValue:15},virtualRows:{type:"int",group:"Dimension"},rowHeight:{type:"int",group:"Dimension",defaultValue:25},maxColumns:{type:"int",defaultValue:20},virtualColumns:{type:"int"},columnLimit:{type:"int",defaultValue:20},rowLimit:{type:"int",defaultValue:125},input:{type:"boolean",defaultValue:false},fixedRows:{type:"int",defaultValue:0},fixedColumns:{type:"int",defaultValue:0},offsetColumn:{type:"int",defaultValue:0},offsetRow:{type:"int",defaultValue:0},format:{type:"sap.zen.commons.Format",multiple:false,defaultValue:sap.zen.commons.Format.ExcelStyle}},aggregations:{cells:{"type":"sap.zen.commons.Cell",multiple:true,bindable:"bindable"}},defaultAggregation:"cells",events:{requestMoreRows:{parameters:{currentRow:"int",defered:"object"}},requestMoreColumns:{parameters:{currentColumn:"int",defered:"object"}},rightClick:{parameters:{cell:"sap.zen.commons.Cell",link:"sap.m.Link"}},cellEnter:{parameters:{cell:"sap.zen.commons.Cell",element:"object"}},cellLeave:{parameters:{cell:"sap.zen.commons.Cell"}},drill:{parameters:{cell:"sap.zen.commons.Cell"}}},publicMethods:["invalidateColumnWidth"]},invalidateColumnWidth:function(){delete this._maxFailedCol;delete this._ColumnWidth2;},init:function(){var t=this;(function(){var b=0;var c=0;t.clearOffset=function(){};t.clearOffsetCol=function(){t.invalidate();};t.getOffsetRow=function(){return b;};t.getOffsetColumn=function(){if(c<0){throw new Error("Invalid offset Column");}return c;};t.setOffsetColumn=function(n){c=n;};t.setOffsetRow=function(n){b=n;};}());},exit:function(){G.clearCellControls(this).clearButtonControls(this);delete this._$ffParent;},onBeforeRendering:function(){var t=this;G.calcHash(t).calcCellControls(t).calcButtonControls(t);delete t._$ffParent;delete t._kdSet;},autoFit:function(){var t=this;var g=q(t.getDomRef());g.find(".sapUiZenCommonsGridInnerTable").addClass("sapUiZenCommonsSize");var n=g.width()-10;var b=g.find(".sapUiZenCommonsGridOuterCell11").width();var c=n-b;var d=1+c/n;if(d>1.05){G.handleColWidth(t,g,d);}c=g.width()-g.find(".sapUiZenCommonsGridOuterCell11").width();d=1+c/g.width();g.find(".sapUiZenCommonsGridInnerTable").removeClass("sapUiZenCommonsSize");},onAfterRendering:function(){var t=this;var g=q(t.getDomRef());t.bInResize=false;if(!t.getCells().length){return;}G.insertContentToGrid(t,g);g.find(".ui-resizable-handle").css("background-image","none");G.prepareOuterTableForResize(t,g);var A=t.getParent();while(A&&!(A instanceof V)){A=A.getParent();}var $=A?q(A.getDomRef()):q(t.getParent()&&t.getParent().getDomRef?t.getParent().getDomRef():g);if(!t._$ffParent||$===t._$ffParent){t._$ffParent=$;t._$ffParent.sizeChanged(function(p){if(!t.bInResize){delete t._maxFailedCol;return G.doResize(t,q(t.getDomRef()),p);}return null;});}G.ensureResisable(t,g);G.handleColWidth(t,g);g.find(".ui-resizable-handle").css("background-image","none");G.prepareOuterTableForResize(t,g);G.adjustHsbThumbPosition(t,g);G.adjustVsbThumbPosition(t,g);if($.length){G.doResize(t,g,{width:$.width(),height:$.viewportHeight()});}if(t._nFocusColumn&&t._nFocusRow){if(g.find("[data-grid-row="+t._nFocusRow+"][data-grid-column="+t._nFocusColumn+"]>div>a").length){g.find("[data-grid-row="+t._nFocusRow+"][data-grid-column="+t._nFocusColumn+"]>div>a").focus();}}}});return a;});
