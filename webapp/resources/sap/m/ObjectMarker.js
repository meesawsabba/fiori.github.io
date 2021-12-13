/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/core/Control","sap/ui/core/Renderer","sap/ui/Device","sap/m/library","sap/ui/core/library","sap/ui/core/Icon","sap/m/TextRenderer","sap/m/Text","sap/m/LinkRenderer","sap/m/Link","./ObjectMarkerRenderer"],function(C,R,D,l,c,I,T,a,L,b,O){"use strict";var d=c.TextAlign;var e=l.ObjectMarkerVisibility;var f=C.extend("sap.m.ObjectMarker",{metadata:{library:"sap.m",designtime:"sap/m/designtime/ObjectMarker.designtime",properties:{type:{type:"sap.m.ObjectMarkerType",group:"Misc"},visibility:{type:"sap.m.ObjectMarkerVisibility",group:"Misc"},additionalInfo:{type:"string",group:"Misc",defaultValue:""}},aggregations:{_innerControl:{type:"sap.ui.core.Control",multiple:false,visibility:"hidden"}},associations:{ariaDescribedBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaDescribedBy"},ariaLabelledBy:{type:"sap.ui.core.Control",multiple:true,singularName:"ariaLabelledBy"}},events:{press:{type:{type:"sap.m.ObjectMarkerType"}}},dnd:{draggable:true,droppable:false}}});f.M_PREDEFINED_TYPES={Flagged:{icon:{src:"sap-icon://flag",visibility:{small:true,large:true}},text:{value:"OM_FLAG",visibility:{small:false,large:false}}},Favorite:{icon:{src:"sap-icon://favorite",visibility:{small:true,large:true}},text:{value:"OM_FAVORITE",visibility:{small:false,large:false}}},Draft:{icon:{src:"sap-icon://request",visibility:{small:false,large:false}},text:{value:"OM_DRAFT",visibility:{small:true,large:true}}},Locked:{icon:{src:"sap-icon://private",visibility:{small:true,large:true}},text:{value:"OM_LOCKED",visibility:{small:false,large:true}}},Unsaved:{icon:{src:"sap-icon://user-edit",visibility:{small:true,large:true}},text:{value:"OM_UNSAVED",visibility:{small:false,large:true}}},LockedBy:{icon:{src:"sap-icon://private",visibility:{small:true,large:true}},text:{value:"OM_LOCKED_BY",visibility:{small:false,large:true}}},UnsavedBy:{icon:{src:"sap-icon://user-edit",visibility:{small:true,large:true}},text:{value:"OM_UNSAVED_BY",visibility:{small:false,large:true}}}};f.prototype.init=function(){D.media.initRangeSet("DeviceSet",[600],"px",["small","large"]);};f.prototype.onAfterRendering=function(){this._attachMediaContainerWidthChange(this._handleMediaChange,this,"DeviceSet");};f.prototype.onBeforeRendering=function(){this._cleanup();this._adjustControl(true);};f.prototype.exit=function(){this._cleanup();};f.prototype.attachPress=function(){var o=this._getInnerControl();Array.prototype.unshift.apply(arguments,["press"]);C.prototype.attachEvent.apply(this,arguments);if(this.hasListeners("press")&&o&&o instanceof h){o.destroy();this.setAggregation("_innerControl",this._createCustomLink(),true);this._adjustControl();}return this;};f.prototype.detachPress=function(){var o=this._getInnerControl();Array.prototype.unshift.apply(arguments,["press"]);C.prototype.detachEvent.apply(this,arguments);if(!this.hasListeners("press")&&o&&o instanceof j){o.destroy();this.setAggregation("_innerControl",this._createCustomText(),true);this._adjustControl();}return this;};f.prototype._cleanup=function(){this._detachMediaContainerWidthChange(this._handleMediaChange,this,"DeviceSet");};f.prototype._handleMediaChange=function(){this._adjustControl();};f.prototype._adjustControl=function(s){var t=f.M_PREDEFINED_TYPES[this.getType()],o=this._getInnerControl(),k=o&&o._getIconAggregation(),A=this.getAdditionalInfo(),m=this._isIconVisible(),n=this._isTextVisible(),p=m&&!n,q=this.getType(),r;if(!o){return false;}if(t){r=this._getMarkerText(t,q,A);}if(m){o.setIcon(t.icon.src,s);k.setDecorative(!p);k.setAlt(r);k.setUseIconTooltip(false);this.addStyleClass("sapMObjectMarkerIcon");}else{o.setIcon(null,s);this.removeStyleClass("sapMObjectMarkerIcon");}if(n){o.setAggregation("tooltip",null,s);o.setText(r,s);this.addStyleClass("sapMObjectMarkerText");}else{if(k){o.setAggregation("tooltip",r,s);}o.setText(null,s);this.removeStyleClass("sapMObjectMarkerText");}o.removeAllAssociation("ariaLabelledBy",s);o.removeAllAssociation("ariaDescribedBy",s);this.getAriaLabelledBy().forEach(function(u){o.addAssociation("ariaLabelledBy",u,s);});this.getAriaDescribedBy().forEach(function(u){o.addAssociation("ariaDescribedBy",u,s);});return true;};f.prototype._getMarkerText=function(t,s,A){var r=sap.ui.getCore().getLibraryResourceBundle("sap.m");switch(s){case"LockedBy":return(A==="")?r.getText('OM_LOCKED_BY_ANOTHER_USER'):r.getText('OM_LOCKED_BY',[A]);case"UnsavedBy":return(A==="")?r.getText('OM_UNSAVED_BY_ANOTHER_USER'):r.getText('OM_UNSAVED_BY',[A]);default:return(A==="")?r.getText(t.text.value):r.getText(t.text.value)+" "+A;}};f.prototype._isIconVisible=function(){var t=f.M_PREDEFINED_TYPES[this.getType()],v=this.getVisibility(),s=this._getDeviceType(),k=t&&t.icon.visibility[s]||false;return v===e.IconOnly||v===e.IconAndText||(v!==e.TextOnly&&k);};f.prototype._isTextVisible=function(){var t=f.M_PREDEFINED_TYPES[this.getType()],v=this.getVisibility(),s=this._getDeviceType(),k=t&&t.text.visibility[s]||false;return v===e.TextOnly||v===e.IconAndText||(v!==e.IconOnly&&k);};f.prototype._getDeviceType=function(){return this._getCurrentMediaContainerRange("DeviceSet").name.toLowerCase();};f.prototype._getInnerControl=function(){var o=this.getAggregation("_innerControl");if(!o&&this.getType()){o=this._createInnerControl();this.setAggregation("_innerControl",o,true);this._adjustControl(true);}return o;};f.prototype._createInnerControl=function(){if(this.hasListeners("press")){return this._createCustomLink();}else{return this._createCustomText();}};f.prototype._createCustomLink=function(){var o=new j(this.getId()+"-link",{wrapping:true});o.attachPress(function(E){this.firePress({type:this.getType()});},this);return o;};f.prototype._createCustomText=function(){return new h(this.getId()+"-text",{textAlign:d.Initial});};["getAccessibilityInfo"].map(function(F){var k=/^add/.test(F);f.prototype[F]=function(){var o=this._getInnerControl(),r;if(o&&o[F]){r=o[F].apply(o,arguments);}return k?this:r;};});var g=R.extend(T);g.apiVersion=2;g.renderText=function(r,o){r.renderControl(o._getIconAggregation());T.renderText(r,o);};var h=a.extend("sap.m.internal.ObjectMarkerCustomText",{metadata:{library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null}},aggregations:{_iconControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}}},renderer:g});h.prototype.setIcon=function(s,S){var o=this._getIconAggregation();this.setProperty("icon",s,S);o.setSrc(s);return this;};h.prototype._getIconAggregation=function(){var o=this.getAggregation("_iconControl");if(!o){o=new I();this.setAggregation("_iconControl",o,true);}return o;};var i=R.extend(L);i.apiVersion=2;i.renderText=function(r,o){r.renderControl(o._getIconAggregation());L.renderText(r,o);};var j=b.extend("sap.m.internal.ObjectMarkerCustomLink",{metadata:{library:"sap.m",properties:{icon:{type:"sap.ui.core.URI",group:"Data",defaultValue:null}},aggregations:{_iconControl:{type:"sap.ui.core.Icon",multiple:false,visibility:"hidden"}}},renderer:i});j.prototype.setIcon=function(s,S){var o=this._getIconAggregation();this.setProperty("icon",s,S);o.setSrc(s);return this;};j.prototype._getTabindex=function(){return"0";};j.prototype._getIconAggregation=function(){var o=this.getAggregation("_iconControl");if(!o){o=new I();this.setAggregation("_iconControl",o,true);}return o;};return f;});
