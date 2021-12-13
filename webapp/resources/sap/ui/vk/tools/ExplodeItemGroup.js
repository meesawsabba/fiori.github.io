/*
 * ! SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element"],function(E){"use strict";var a=E.extend("sap.ui.vk.tools.ExplodeItemGroup",{metadata:{properties:{name:{type:"string"},magnitudeAdjustmentMultiplier:{type:"float",defaultValue:0.0}},aggregations:{items:{type:"sap.ui.vk.NodeProxy",multiple:true}}}});a.prototype.init=function(){this._magnitude=0;this._offset=0;this._deltaOffset=0;this._center=new THREE.Vector3();};a.prototype.getBoundingBox=function(){var b=new THREE.Box3();this.getItems().forEach(function(n){n.getNodeRef()._expandBoundingBox(b,false,true,true);});return b;};a.prototype.getMagnitude=function(){return this._magnitude*(this._offset+this._deltaOffset*this.getMagnitudeAdjustmentMultiplier());};return a;});
