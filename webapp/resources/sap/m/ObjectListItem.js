/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/ui/base/ManagedObjectObserver','./ListItemBase','./library','sap/ui/core/IconPool','sap/m/ObjectNumber','sap/ui/core/library','./ObjectMarker','./Text','./ObjectListItemRenderer'],function(M,L,l,I,O,c,a,T,b){"use strict";var d=l.ObjectMarkerType;var e=l.ImageHelper;var f=c.TextAlign;var g=c.TextDirection;var V=c.ValueState;var h=L.extend("sap.m.ObjectListItem",{metadata:{library:"sap.m",properties:{title:{type:"string",group:"Misc",defaultValue:null},number:{type:"string",group:"Misc",defaultValue:null},numberUnit:{type:"string",group:"Misc",defaultValue:null},intro:{type:"string",group:"Misc",defaultValue:null},icon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},activeIcon:{type:"sap.ui.core.URI",group:"Misc",defaultValue:null},iconDensityAware:{type:"boolean",group:"Misc",defaultValue:true},markFavorite:{type:"boolean",group:"Misc",defaultValue:null,deprecated:true},markFlagged:{type:"boolean",group:"Misc",defaultValue:null,deprecated:true},showMarkers:{type:"boolean",group:"Misc",defaultValue:null,deprecated:true},numberState:{type:"sap.ui.core.ValueState",group:"Misc",defaultValue:V.None},titleTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:g.Inherit},introTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:g.Inherit},numberTextDirection:{type:"sap.ui.core.TextDirection",group:"Appearance",defaultValue:g.Inherit},markLocked:{type:"boolean",group:"Misc",defaultValue:false,deprecated:true}},defaultAggregation:"attributes",aggregations:{attributes:{type:"sap.m.ObjectAttribute",multiple:true,singularName:"attribute"},firstStatus:{type:"sap.m.ObjectStatus",multiple:false},secondStatus:{type:"sap.m.ObjectStatus",multiple:false},markers:{type:"sap.m.ObjectMarker",multiple:true,singularName:"marker"},_objectNumber:{type:"sap.m.ObjectNumber",multiple:false,visibility:"hidden"}},designtime:"sap/m/designtime/ObjectListItem.designtime",dnd:{draggable:true,droppable:true}}});h.prototype.init=function(E){this._generateObjectNumber();this._observerObjectItemChanges=this._observerObjectItemChanges.bind(this);this._oItemsObservers={};};h.prototype.exit=function(E){if(this._oImageControl){this._oImageControl.destroy();}if(this._oTitleText){this._oTitleText.destroy();this._oTitleText=undefined;}L.prototype.exit.apply(this);};h.prototype.onAfterRendering=function(){var o=this.getAggregation("_objectNumber"),p=sap.ui.getCore().getConfiguration().getRTL(),t=p?f.Left:f.Right;if(o&&o.getNumber()){o.setTextAlign(t);}};h.prototype._generateObjectNumber=function(){var n=this.getNumber(),N=this.getNumberUnit(),s=this.getNumberState(),t=this.getNumberTextDirection();this.setAggregation("_objectNumber",new O(this.getId()+"-ObjectNumber",{number:n,unit:N,state:s,textDirection:t}),true);};h.prototype._hasAttributes=function(){var j=this.getAttributes();if(j.length>0){for(var i=0;i<j.length;i++){if(!j[i]._isEmpty()){return true;}}}return false;};h.prototype._hasStatus=function(){return((this.getFirstStatus()&&!this.getFirstStatus()._isEmpty())||(this.getSecondStatus()&&!this.getSecondStatus()._isEmpty()));};h.prototype._hasBottomContent=function(){return(this._hasAttributes()||this._hasStatus()||this.getShowMarkers()||this.getMarkLocked()||this._getVisibleMarkers().length>0);};h.prototype._getVisibleAttributes=function(){var A=this.getAttributes();var v=[];for(var i=0;i<A.length;i++){if(A[i].getVisible()){v.push(A[i]);}}return v;};h.prototype.addAttribute=function(o){this._startObservingItem(o);return L.prototype.addAggregation.call(this,"attributes",o);};h.prototype.insertAttribute=function(o,i){this._startObservingItem(o);return L.prototype.insertAggregation.call(this,"attributes",o,i);};h.prototype.removeAttribute=function(o){var i=L.prototype.removeAggregation.call(this,"attributes",o);this._stopObservingItem(i);return i;};h.prototype.removeAllAttributes=function(){var j=L.prototype.removeAllAggregation.call(this,"attributes");for(var i=0;i<j.length;i++){this._stopObservingItem(j[i]);}return j;};h.prototype.destroyAttributes=function(){this.getAttributes().forEach(function(A){this._stopObservingItem(A);},this);return L.prototype.destroyAggregation.call(this,"attributes");};h.prototype._getVisibleMarkers=function(){var A=this.getMarkers();var v=[];for(var i=0;i<A.length;i++){if(A[i].getVisible()){v.push(A[i]);}}return v;};h.prototype._getImageControl=function(){var i=this.getId()+'-img';var s="2.5rem";var p;if(I.isIconURI(this.getIcon())){p={src:this.getIcon(),height:s,width:s,size:s,useIconTooltip:false,densityAware:this.getIconDensityAware()};}else{p={src:this.getIcon(),useIconTooltip:false,densityAware:this.getIconDensityAware()};}var C=['sapMObjLIcon'];this._oImageControl=e.getImageControl(i,this._oImageControl,this,p,C);return this._oImageControl;};h.prototype._activeHandlingInheritor=function(){var A=this.getActiveIcon();if(this._oImageControl&&A){this._oImageControl.setSrc(A);}};h.prototype._inactiveHandlingInheritor=function(){var s=this.getIcon();if(this._oImageControl){this._oImageControl.setSrc(s);}};h.prototype.setNumber=function(n){this.setProperty('number',n,true);this.getAggregation("_objectNumber").setNumber(n);return this;};h.prototype.setNumberUnit=function(n){this.setProperty('numberUnit',n,true);this.getAggregation('_objectNumber').setUnit(n);return this;};h.prototype.setNumberTextDirection=function(t){this.setProperty('numberTextDirection',t,true);this.getAggregation("_objectNumber").setTextDirection(t);return this;};h.prototype.setNumberState=function(v){this.setProperty('numberState',v,true);this.getAggregation("_objectNumber").setState(v);return this;};h.prototype.setMarkFavorite=function(m){return this._setOldMarkers(d.Favorite,m);};h.prototype.setMarkFlagged=function(m){return this._setOldMarkers(d.Flagged,m);};h.prototype.setMarkLocked=function(m){return this._setOldMarkers(d.Locked,m);};h.prototype.setShowMarkers=function(m){var s;var A=this.getMarkers();this.setProperty("showMarkers",m,false);for(var i=0;i<A.length;i++){s=A[i].getType();if((s===d.Flagged&&this.getMarkFlagged())||(s===d.Favorite&&this.getMarkFavorite())||(s===d.Locked&&this.getMarkLocked())){A[i].setVisible(m);}}return this;};h.prototype.addMarker=function(o){this._startObservingItem(o);return L.prototype.addAggregation.call(this,"markers",o);};h.prototype.insertMarker=function(o,i){this._startObservingItem(o);return L.prototype.insertAggregation.call(this,"markers",o,i);};h.prototype.removeMarker=function(o){var i=L.prototype.removeAggregation.call(this,"markers",o);this._stopObservingItem(i);return i;};h.prototype.removeAllMarkers=function(){var j=L.prototype.removeAllAggregation.call(this,"markers");for(var i=0;i<j.length;i++){this._stopObservingItem(j[i]);}return j;};h.prototype.destroyMarkers=function(){this.getMarkers().forEach(function(m){this._stopObservingItem(m);},this);return L.prototype.destroyAggregation.call(this,"markers");};h.prototype._observerObjectItemChanges=function(C){if(C.current!==C.old){this.invalidate();}};h.prototype._startObservingItem=function(i){var o=new M(this._observerObjectItemChanges);this._oItemsObservers[i.getId()]=o;o.observe(i,{properties:true});return this;};h.prototype._stopObservingItem=function(i){var s=i.getId();this._oItemsObservers[s].disconnect();delete this._oItemsObservers[s];return this;};h.prototype._setOldMarkers=function(m,j){var A=this.getMarkers();var H=false;var o={Flagged:"-flag",Favorite:"-favorite",Locked:"-lock"};this.setProperty("mark"+m,j,false);if(!this.getShowMarkers()){j=false;}for(var i=0;i<A.length;i++){if(A[i].getType()===m){H=true;A[i].setVisible(j);break;}}if(!H){this.insertAggregation("markers",new a({id:this.getId()+o[m],type:m,visible:j}));}return this;};h.prototype._getTitleText=function(){if(!this._oTitleText){this._oTitleText=new T(this.getId()+"-titleText",{maxLines:2});this._oTitleText.setParent(this,null,true);}return this._oTitleText;};return h;});
