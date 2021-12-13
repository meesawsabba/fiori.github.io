/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Element"],function(E){"use strict";var L=function(p){p=p||{};E.call(this,p);this.type="Line";this.x1=p.x1||0;this.y1=p.y1||0;this.x2=p.x2||0;this.y2=p.y2||0;this.setMaterial(p.material);};L.prototype=Object.assign(Object.create(E.prototype),{constructor:L});L.prototype.tagName=function(){return"line";};L.prototype.setFillStyle=function(f,i){};L.prototype._expandBoundingBox=function(b,m){var s=isNaN(this.strokeWidth)?0:this.strokeWidth*0.5;this._expandBoundingBoxCE(b,m,this.x1,this.y1,s,s);this._expandBoundingBoxCE(b,m,this.x2,this.y2,s,s);};L.prototype._setSpecificAttributes=function(s){s("x1",this.x1);s("y1",this.y1);s("x2",this.x2);s("y2",this.y2);};L.prototype._getParametricShape=function(f,l,t){var p=E.prototype._getParametricShape.call(this,f,l,t);p.type="line";p.x1=this.x1;p.y1=this.y1;p.x2=this.x2;p.y2=this.y2;return p;};L.prototype.copy=function(s,r){E.prototype.copy.call(this,s,r);this.x1=s.x1;this.y1=s.y1;this.x2=s.x2;this.y2=s.y2;return this;};return L;});
