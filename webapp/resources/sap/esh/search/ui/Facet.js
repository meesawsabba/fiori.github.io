/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var F=function(){this.init.apply(this,arguments);};F.prototype={init:function(p){this.title=p.title;this.facetType=p.facetType;this.dimension=p.dimension;this.dataType=p.dataType;this.matchingStrategy=p.matchingStrategy;this.items=p.items||[];this.totalCount=p.totalCount;this.visible=p.visible||true;},hasFilterCondition:function(f){for(var i=0,l=this.items.length;i<l;i++){var a=this.items[i].filterCondition||this.items[i];if(a.equals&&a.equals(f)){return true;}}return false;},hasFilterConditions:function(){for(var i=0,l=this.items.length;i<l;i++){if(this.items[i].filterCondition){return true;}}return false;},removeItem:function(f){for(var i=0,l=this.items.length;i<l;i++){var a=this.items[i].filterCondition||this.items[i];if(a.equals&&f.filterCondition&&a.equals(f.filterCondition)){return this.items.splice(i,1);}}},};return F;});
