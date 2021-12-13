/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["./Element"],function(E){"use strict";var P=function(p){p=p||{};E.call(this,p);this.type="Polyline";this.points=new Float32Array(p.points||[0,0,100,100]);this.closed=p.closed||false;this.setMaterial(p.material);};P.prototype=Object.assign(Object.create(E.prototype),{constructor:P});P.prototype.tagName=function(){return this.closed?"polygon":"polyline";};P.prototype._expandBoundingBox=function(b,m){var s=isNaN(this.strokeWidth)?0:this.strokeWidth*0.5;var p=this.points;for(var i=0,l=p.length;i<l;i+=2){this._expandBoundingBoxCE(b,m,p[i],p[i+1],s,s);}};P.prototype._setSpecificAttributes=function(s){s("points",this.points.join(" "));};P.prototype._getParametricShape=function(f,l,t){var p=E.prototype._getParametricShape.call(this,f,l,t);p.type="polyline";p.points=Array.from(this.points);p.closed=this.closed;p.dim=2;return p;};P.prototype.copy=function(s,r){E.prototype.copy.call(this,s,r);this.points=s.points.slice();this.closed=s.closed;return this;};return P;});
