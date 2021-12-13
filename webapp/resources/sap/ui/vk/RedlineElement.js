/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/core/Element","sap/ui/vk/uuidv4"],function(E,u){"use strict";var R=E.extend("sap.ui.vk.RedlineElement",{metadata:{library:"sap.ui.vk",properties:{originX:{type:"float",defaultValue:0},originY:{type:"float",defaultValue:0},opacity:{type:"float",defaultValue:1},strokeWidth:{type:"float",defaultValue:2},strokeColor:{type:"sap.ui.core.CSSColor",defaultValue:"#e6600d"},strokeDashArray:{type:"float[]",defaultValue:[]},halo:{type:"boolean",defaultValue:false},haloColor:{type:"string",defaultValue:"rgba(255, 0, 0, 1)"},createdByUser:{type:"any",defaultValue:""},createTimestamp:{type:"int",defaultValue:null},deletedByUser:{type:"any",defaultValue:""},deleteTimestamp:{type:"int",defaultValue:null},suppress:{type:"boolean",defaultValue:false},elementId:{type:"string",defaultValue:null}}},constructor:function(i,p){E.apply(this,arguments);if(typeof i==="object"){p=i;i=undefined;}this.setElementId(p&&p.elementId?p.elementId:u());}});R.prototype.applyZoom=function(){};R.prototype.render=function(r){this.renderElement(r,this.getHalo());};R.prototype.renderElement=function(r,h){};R.prototype._colorToArray=function(c){var r=c.replace(/[^\d,.]/g,"").split(",");if(!r[3]){r.push(1);}return r;};R.prototype.exportJSON=function(){var j={originX:this.getOriginX(),originY:this.getOriginY(),opacity:this.getOpacity(),strokeColor:this.getStrokeColor(),strokeWidth:this.getStrokeWidth(),elementId:this.getElementId(),halo:this.getHalo(),haloColor:this.getHaloColor(),createdByUser:this.getCreatedByUser(),createTimestamp:this.getCreateTimestamp(),deletedByUser:this.getDeletedByUser(),deleteTimestamp:this.getDeleteTimestamp(),suppress:this.getSuppress()};if(this.getStrokeDashArray().length>0){j["strokeDashArray"]=this.getStrokeDashArray();}return j;};R.prototype.importJSON=function(j){if(j.hasOwnProperty("originX")){this.setOriginX(j.originX);}if(j.hasOwnProperty("originY")){this.setOriginY(j.originY);}if(j.hasOwnProperty("opacity")){this.setOpacity(j.opacity);}if(j.hasOwnProperty("strokeColor")){this.setStrokeColor(j.strokeColor);}if(j.hasOwnProperty("strokeWidth")){this.setStrokeWidth(j.strokeWidth);}if(j.hasOwnProperty("strokeDashArray")){this.setStrokeDashArray(j.strokeDashArray);}if(j.hasOwnProperty("elementId")){this.setElementId(j.elementId);}if(j.hasOwnProperty("halo")){this.setHalo(j.halo);}if(j.hasOwnProperty("haloColor")){this.setHaloColor(j.haloColor);}if(j.hasOwnProperty("createdByUser")){this.setCreatedByUser(j.createdByUser);}if(j.hasOwnProperty("createTimestamp")){this.setCreateTimestamp(j.createTimestamp);}if(j.hasOwnProperty("deletedByUser")){this.setDeletedByUser(j.deletedByUser);}if(j.hasOwnProperty("deleteTimestamp")){this.setDeleteTimestamp(j.deleteTimestamp);}if(j.hasOwnProperty("suppress")){this.setSuppress(j.suppress);}return this;};R.prototype.exportSVG=function(){return null;};R.prototype.importSVG=function(s){if(s.getAttribute("x")){this.setOriginX(parseFloat(s.getAttribute("x")));}if(s.getAttribute("y")){this.setOriginY(parseFloat(s.getAttribute("y")));}if(s.getAttribute("opacity")){this.setOpacity(parseFloat(s.getAttribute("opacity")));}if(s.getAttribute("stroke")){this.setStrokeColor(s.getAttribute("stroke"));}if(s.getAttribute("stroke-width")){this.setStrokeWidth(parseFloat(s.getAttribute("stroke-width")));}if(s.getAttribute("stroke-dasharray")){this.setStrokeDashArray(s.getAttribute("stroke-dasharray").split(",").map(parseFloat));}if(s.getAttribute("data-sap-element-id")){this.setElementId(s.getAttribute("data-sap-element-id"));}this.setHalo(s.getAttribute("data-sap-halo")==="true");return this;};return R;});
