/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/layout/cssgrid/GridLayoutBase","sap/ui/Device","sap/ui/layout/library"],function(G,D){"use strict";var R="RCLRangeSet";D.media.initRangeSet(R,[600,1024,1280,1440,1680,1920],"px",["S","M","ML","L","XL","XXL","XXXL"],true);var a=G.extend("sap.ui.layout.cssgrid.ResponsiveColumnLayout",{metadata:{library:"sap.ui.layout",properties:{},events:{layoutChange:{parameters:{layout:{type:"string"}}}}}});a.prototype._sCurrentLayoutClassName="";a.prototype.isResponsive=function(){return true;};a.prototype.onGridAfterRendering=function(g){this._applyLayout(g);};a.prototype.getActiveGridSettings=function(){return null;};a.prototype.onGridResize=function(e){if(!e||e.size.width===0){return;}this._applyLayout(e.control);};a.prototype.addGridStyles=function(r){G.prototype.addGridStyles.apply(this,arguments);r.class("sapUiLayoutCSSGridRCL");};a.prototype._applyLayout=function(g){var p=g.getParent(),w=p?p.getDomRef().offsetWidth:g.getDomRef().parentElement.offsetWidth,r=D.media.getCurrentRange(R,w),c="sapUiLayoutCSSGridRCL-Layout"+r.name;if(this._sCurrentLayoutClassName===c){return;}g.removeStyleClass(this._sCurrentLayoutClassName);g.addStyleClass(c);this._sCurrentLayoutClassName=c;this.fireLayoutChange({layout:r.name});};return a;});
