/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/base/ManagedObject","sap/ui/core/Control","./Avatar","./AvatarGroupItemRenderer"],function(l,M,C,A,a){"use strict";var b=C.extend("sap.f.AvatarGroupItem",{metadata:{library:"sap.f",properties:{src:{type:"sap.ui.core.URI",group:"Data",defaultValue:null},initials:{type:"string",group:"Data",defaultValue:null},fallbackIcon:{type:"string",group:"Data",defaultValue:null}}}});b.prototype.onBeforeRendering=function(){this._getAvatar();};b.prototype.destroy=function(){if(this._oAvatar){this._oAvatar.destroy();this._oAvatar=null;}if(this._oPopover){this._oPopover.destroy();this._oPopover=null;}M.prototype.destroy.apply(this);};b.prototype.setSrc=function(v){if(this.getSrc()===v){return this;}this._getAvatar().setSrc(v);return this.setProperty("src",v);};b.prototype.setInitials=function(v){if(this.getInitials()===v){return this;}this._getAvatar().setInitials(v);return this.setProperty("initials",v);};b.prototype.setFallbackIcon=function(v){if(this.getFallbackIcon()===v){return this;}this._getAvatar().setFallbackIcon(v);return this.setProperty("fallbackIcon",v);};b.prototype.getAvatarColor=function(){return this._sAvatarColor;};b.prototype._setGroupType=function(v){this._sGroupType=v;this.invalidate();};b.prototype._getGroupType=function(){return this._sGroupType;};b.prototype._setAvatarColor=function(v){this._sAvatarColor=v;this._getAvatar().setBackgroundColor(v);};b.prototype._setDisplaySize=function(v){this._sAvatarDisplaySize=v;this._getAvatar().setDisplaySize(v);};b.prototype._getDisplaySize=function(){return this._sAvatarDisplaySize;};b.prototype._getAvatar=function(){if(!this._oAvatar){this._oAvatar=new A({src:this.getSrc(),initials:this.getInitials(),fallbackIcon:this.getFallbackIcon(),backgroundColor:this.getAvatarColor(),showBorder:true,displaySize:this._getDisplaySize()});}return this._oAvatar;};return b;});
