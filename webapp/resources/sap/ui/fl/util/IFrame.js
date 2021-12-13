/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["../library","sap/ui/core/Control","sap/ui/model/json/JSONModel","./getContainerUserInfo","sap/base/util/extend","sap/base/security/URLListValidator","sap/base/Log","sap/ui/core/library","./IFrameRenderer"],function(l,C,J,g,e,U,L){"use strict";function u(v){if(v.parts&&v.formatter){return v.formatter.apply(null,v.parts.map(function(p){if(p.model){return"{"+p.model+">"+p.path+"}";}return"{"+p.path+"}";}));}return v;}var I=C.extend("sap.ui.fl.util.IFrame",{metadata:{library:"sap.ui.fl",properties:{url:{type:"sap.ui.core.URI",group:"Misc",defaultValue:""},width:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"},height:{type:"sap.ui.core.CSSSize",group:"Misc",defaultValue:"100%"},title:{type:"string",group:"Misc",defaultValue:undefined},_settings:{type:"object",group:"Data",defaultValue:null}},designtime:"sap/ui/fl/designtime/util/IFrame.designtime"},init:function(){if(C.prototype.init){C.prototype.init.apply(this,arguments);}this._oInitializePromise=g().then(function(o){this._oUserModel=new J(o);this.setModel(this._oUserModel,"$user");}.bind(this));},waitForInit:function(){return this._oInitializePromise?this._oInitializePromise:Promise.reject();},setUrl:function(s){var E=decodeURI(s)===s?encodeURI(s):s;if(I.isValidUrl(E)){this.setProperty("url",E);}else{L.error("Provided URL is not valid as an IFrame src");}return this;},applySettings:function(s){C.prototype.applySettings.apply(this,arguments);if(s){var m=this.getProperty("_settings")||{};if(s._settings){e(m,s._settings);}else{Object.keys(s).filter(function(p){return!!s[p];}).forEach(function(p){m[p]=u(s[p]);});}this.setProperty("_settings",m);}},exit:function(){if(this._oUserModel){this._oUserModel.destroy();delete this._oUserModel;}}});I.isValidUrl=function(s){return(!U.entries().some(function(v){return/javascript/i.test(v.protocol);})&&U.validate(s));};return I;});
