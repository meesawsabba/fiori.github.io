/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['./Tile','./library','sap/ui/core/IconPool','sap/ui/core/library','sap/ui/Device','./StandardTileRenderer'],function(T,l,I,c,D,S){"use strict";var a=l.ImageHelper;var b=l.StandardTileType;var V=c.ValueState;var d=T.extend("sap.m.StandardTile",{metadata:{library:"sap.m",deprecated:true,properties:{title:{type:"string",group:"Misc",defaultValue:null},info:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},number:{type:"string",group:"Misc",defaultValue:null},numberUnit:{type:"string",group:"Misc",defaultValue:null},infoState:{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:V.None},type:{type:"sap.m.StandardTileType",group:"Misc",defaultValue:b.None},iconDensityAware:{type:"boolean",group:"Appearance",defaultValue:true}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"}}}});d.prototype.exit=function(){if(this._oImageControl){this._oImageControl.destroy();this._oImageControl=null;}};d.prototype.ontap=function(){T.prototype.ontap.apply(this,arguments);};d.prototype.getIcon=function(){if(!this.getProperty("icon")&&this.getType()==="Create"){return I.getIconURI("add");}else{return this.getProperty("icon");}};d.prototype._getImage=function(){var i=this.getId()+"-img";var s=D.system.phone?"1.3rem":"2rem";var p={src:this.getIcon(),height:s,width:s,size:s,densityAware:this.getIconDensityAware(),useIconTooltip:false};this._oImageControl=a.getImageControl(i,this._oImageControl,this,p);return this._oImageControl;};return d;});
