/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/SearchHelper","sap/f/GridContainer","sap/m/ImageContent","sap/m/GenericTile","sap/m/TileContent",],function(S,G,I,a,T){"use strict";return G.extend("sap.esh.search.ui.controls.SearchResultGrid",{constructor:function(i,s){G.prototype.constructor.apply(this,[i,s]);this.bindAggregation("items","/results",function(b,c){var d=c.getObject();var e=new I({src:d.imageUrl||d.titleIconUrl,});if(d.imageFormat==="round"){e.addStyleClass("sapUshellResultListGrid-ImageContainerRound");}return new a({header:d.title,subheader:d.titleDescription,tileContent:new T({content:e,}),press:function(E){var f=this.getModel().getProperty(E.getSource().getBindingContext().sPath);if(f.titleNavigation._target==="_blank"){window.open(f.titleNavigation._href,"_blank","noopener,noreferrer");}else{window.location.hash=f.titleNavigation._href;}},});});this.addStyleClass("sapUshellResultListGrid");},renderer:"sap.f.GridContainerRenderer",onAfterRendering:function(){S.boldTagUnescaper(this.getDomRef());},});});
