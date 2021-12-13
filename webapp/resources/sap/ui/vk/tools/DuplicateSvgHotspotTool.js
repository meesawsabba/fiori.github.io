/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/base/Log","../library","./Tool","./DuplicateSvgHotspotToolHandler","./DuplicateSvgHotspotToolGizmo"],function(L,v,T,D,a){"use strict";var b=T.extend("sap.ui.vk.tools.DuplicateSvgHotspotTool",{metadata:{properties:{parentNode:{type:"any",defaultValue:null},nodeList:{type:"any[]",defaultValue:[]}},events:{nodesCreated:{parameters:{x:"float",y:"float",nodes:"any[]",request:"object"}}}},constructor:function(i,s){if(b._instance){return b._instance;}T.apply(this,arguments);this._viewport=null;this._handler=new D(this);b._instance=this;}});b.prototype.init=function(){if(T.prototype.init){T.prototype.init.call(this);}this.setFootprint(["sap.ui.vk.svg.Viewport"]);this.setAggregation("gizmo",new a());};b.prototype.setActive=function(c,d,g){T.prototype.setActive.call(this,c,d,g);var e=this._viewport;if(e){if(c){this._gizmo=this.getGizmo();if(this._gizmo){this._gizmo.show(e,this);}this._addLocoHandler();}else{this._removeLocoHandler();if(this._gizmo){this._gizmo.hide();this._gizmo=null;}}}return this;};b.prototype.queueCommand=function(c){if(this._addLocoHandler()){if(this.isViewportType("sap.ui.vk.svg.Viewport")){c();}}return this;};return b;});
