/*!
 * OpenUI5
 * (c) Copyright 2009-2021 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./library","sap/ui/core/Item","sap/ui/core/library","sap/base/Log","sap/base/security/sanitizeHTML"],function(l,I,c,L,s){"use strict";var M=c.MessageType;var a=I.extend("sap.m.MessageItem",{metadata:{library:"sap.m",properties:{type:{type:"sap.ui.core.MessageType",group:"Appearance",defaultValue:M.Error},title:{type:"string",group:"Appearance",defaultValue:""},subtitle:{type:"string",group:"Misc",defaultValue:null},description:{type:"string",group:"Appearance",defaultValue:""},markupDescription:{type:"boolean",group:"Appearance",defaultValue:false},longtextUrl:{type:"sap.ui.core.URI",group:"Behavior",defaultValue:null},counter:{type:"int",group:"Misc",defaultValue:null},groupName:{type:"string",group:"Misc",defaultValue:""},activeTitle:{type:"boolean",group:"Misc",defaultValue:false}},defaultAggregation:"link",aggregations:{link:{type:"sap.m.Link",multiple:false,singularName:"link"}}}});a.prototype.setProperty=function(p,v,S){var P=this.getParent(),t=this.getType().toLowerCase(),b=["description","type","groupName"],u=function(n,i){if(i._oMessagePopoverItem.getId()===this.getId()&&i.getMetadata().getProperty(n)){i.setProperty(n,v);}};if(b.indexOf(p)===-1&&P&&("_bItemsChanged"in P)&&!P._bItemsChanged){P._oLists&&P._oLists.all&&P._oLists.all.getItems&&P._oLists.all.getItems().forEach(u.bind(this,p));P._oLists&&P._oLists[t]&&P._oLists[t].getItems&&P._oLists[t].getItems().forEach(u.bind(this,p));}if(typeof this._updatePropertiesFn==="function"){this._updatePropertiesFn();}return I.prototype.setProperty.apply(this,arguments);};a.prototype._updateProperties=function(b){this._updatePropertiesFn=b;};a.prototype.setDescription=function(d){if(typeof d==='undefined'){d='';}if(this.getMarkupDescription()){d=s(d);}this.setProperty("description",d,true);return this;};a.prototype.setType=function(t){if(t===M.None){t=M.Information;L.warning("The provided None type is handled and rendered as Information type");}return this.setProperty("type",t,true);};return a;});
