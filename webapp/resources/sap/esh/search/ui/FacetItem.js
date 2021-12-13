/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){var F=function(){this.init.apply(this,arguments);};F.prototype={init:function(p){p=p||{};this.selected=p.selected||false;this.level=p.level||0;this.filterCondition=p.filterCondition;this.value=p.value||"";this.label=typeof p.label==="undefined"?"":p.label+"";this.facetTitle=p.facetTitle||"";this.facetAttribute=p.facetAttribute||"";this.valueLabel=this.value;this.advanced=p.advanced||false;this.listed=p.listed||false;this.icon=p.icon;this.visible=p.visible||true;},equals:function(o){return(this.facetTitle===o.facetTitle&&this.label===o.label&&this.value===o.value&&this.filterCondition.equals(o.filterCondition));},clone:function(){var n=new F();n.facetTitle=this.facetTitle;n.selected=this.selected;n.label=this.label;n.icon=this.icon;n.level=this.level;n.value=this.value;n.valueLabel=this.valueLabel;n.filterCondition=this.filterCondition.clone();return n;},};return F;});
