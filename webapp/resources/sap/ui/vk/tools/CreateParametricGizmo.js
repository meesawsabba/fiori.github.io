/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Gizmo","../svg/HotspotHelper"],function(G,H){"use strict";var C=G.extend("sap.ui.vk.tools.CreateParametricGizmo",{metadata:{library:"sap.ui.vk"}});C.prototype.init=function(){if(G.prototype.init){G.prototype.init.apply(this);}this._viewport=null;this._tool=null;this._activeElement=null;};C.prototype.updateParentNode=function(){if(!this._tool||!this._viewport){return;}var r=this._tool.getParentNode();if(!r){r=this._viewport._scene.getRootElement();while(r.userData.skipIt&&r.children.length>0){r=r.children[0];}}this._root=r;};C.prototype._createRequest=function(e){return new H().createRequest(e,this._viewport);};return C;});
