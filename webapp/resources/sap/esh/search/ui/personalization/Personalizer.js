/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var P=function(){this.init.apply(this,arguments);};P.prototype={init:function(k,p){this.key=k;this.personalizationStorageInstance=p;},getKey:function(){return this.key;},setPersData:function(d){return new jQuery.Deferred().resolve(this.personalizationStorageInstance.setItem(this.key,d));},getPersData:function(){return new jQuery.Deferred().resolve(this.personalizationStorageInstance.getItem(this.key));},};return P;});
