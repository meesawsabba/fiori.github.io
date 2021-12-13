/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/personalization/Personalizer","sap/esh/search/ui/SearchHelper"],function(P,S){"use strict";var m=function(){this.init.apply(this,arguments);};var F=m;m.prototype={init:function(c){this.container=c;this.saveNotDelayed=this.save;this.save=S.delayedExecution(this.save,2000);},save:function(){return this.container.save();},getItem:function(k){k=this.limitLength(k);if(!this._isStorageSupported()){throw"not supported storage";}return this.container.getItemValue(k);},setItem:function(k,d){k=this.limitLength(k);if(!this._isStorageSupported()){throw"not supported storage";}var o=this.getItem(k);if(JSON.stringify(o)===JSON.stringify(d)){return;}this.container.setItemValue(k,d);this.save();},limitLength:function(k){return k.slice(-40);},getPersonalizer:function(k){return new P(k,this);},_isStorageSupported:function(){return true;},};m.create=function(){var s=sap.ushell.Container.getServiceAsync("Personalization").then(function(a){return a.getContainer("ushellSearchPersoServiceContainer");}).then(function(c){return new F(c);});return s;};return m;});
