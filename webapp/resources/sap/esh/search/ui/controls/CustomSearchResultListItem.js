/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/controls/SearchResultListItem","sap/esh/search/ui/controls/CustomSearchResultListItemContent",],function(){"use strict";return sap.esh.search.ui.controls.SearchResultListItem.extend("sap.esh.search.ui.controls.CustomSearchResultListItem",{metadata:{properties:{content:{type:"sap.esh.search.ui.controls.CustomSearchResultListItemContent",},},},init:function(){sap.esh.search.ui.controls.SearchResultListItem.prototype.init.apply(this,arguments);},setupCustomContentControl:function(){var c=this.getContent();c.setTitle(this.getTitle());c.setTitleUrl(this.getTitleUrl());c.setType(this.getType());c.setImageUrl(this.getImageUrl());c.setAttributes(this.getAttributes());},renderer:function(r,c){c.setupCustomContentControl();sap.esh.search.ui.controls.SearchResultListItemRenderer.render.apply(this,arguments);},onAfterRendering:function(){sap.esh.search.ui.controls.SearchResultListItem.prototype.onAfterRendering.apply(this,arguments);this.getContent().getTitleVisibility();},});});
