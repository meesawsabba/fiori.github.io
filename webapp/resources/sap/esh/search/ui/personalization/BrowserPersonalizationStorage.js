/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/personalization/Personalizer","sap/ui/util/Storage"],function(P,S){"use strict";var m=function(){this.init.apply(this,arguments);};var B=m;m.prototype={init:function(){},saveNotDelayed:function(){return Promise.resolve();},save:function(){},getItem:function(k){if(!this._isStorageSupported()){throw"not supported storage";}return this._getStorage(k);},setItem:function(k,d){if(!this._isStorageSupported()){throw"not supported storage";}this._putStorage(k,d);},getPersonalizer:function(k){return new P(k,this);},_isStorageSupported:function(){if(S.isSupported()){return true;}return false;},_getStorage:function(k){return jQuery.sap.storage.get("Search.Personalization."+k);},_putStorage:function(k,s){if(typeof jQuery.sap.storage.setType==="function"){jQuery.sap.storage.setType(jQuery.sap.storage.Type.local);}jQuery.sap.storage.put("Search.Personalization."+k,s);},};m.create=function(){return Promise.resolve(new B());};return m;});
