/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/EventProvider","../svg/Element"],function(E,a){"use strict";var C=E.extend("sap.ui.vk.tools.CreatePathToolHandler",{metadata:{},constructor:function(t){this._priority=30;this._tool=t;this._rect=null;}});C.prototype._getPosition=function(e){var p=this._tool._viewport._camera._screenToWorld(e.x-this._rect.x,e.y-this._rect.y);var m=a._invertMatrix(this._tool.getGizmo()._root._matrixWorld());return a._transformPoint(p.x,p.y,m);};C.prototype.hover=function(e){var g=this._tool.getGizmo();if(g&&g._activeElement){e.handled=true;this._tool.getGizmo()._addPoint(this._getPosition(e),false);}};C.prototype.beginGesture=function(e){var g=this._tool.getGizmo();if(g&&this._inside(e)){e.handled=true;if(e.buttons===1){g._addPoint(this._getPosition(e),true,true);}else if(e.buttons===2&&g._activeElement){g._finishPath();}}};C.prototype.move=function(e){var g=this._tool.getGizmo();if(g&&this._inside(e)){e.handled=true;this._tool.getGizmo()._addPoint(this._getPosition(e),true);}};C.prototype.endGesture=function(e){var g=this._tool.getGizmo();if(g&&this._inside(e)){e.handled=true;this._tool.getGizmo()._checkClosure(this._getPosition(e));}};C.prototype.click=function(e){var g=this._tool.getGizmo();if(g&&this._inside(e)){e.handled=true;}};C.prototype.doubleClick=function(e){var g=this._tool.getGizmo();if(g&&this._inside(e)){e.handled=true;g._finishPath(false);}};C.prototype.contextMenu=function(e){};C.prototype.getViewport=function(){return this._tool._viewport;};C.prototype._getOffset=function(o){var r=o.getBoundingClientRect();var p={x:r.left+window.pageXOffset,y:r.top+window.pageYOffset};return p;};C.prototype._inside=function(e){var i=this._tool._viewport.getIdForLabel();var d=document.getElementById(i);if(d==null){return false;}var o=this._getOffset(d);this._rect={x:o.x,y:o.y,w:d.offsetWidth,h:d.offsetHeight};return(e.x>=this._rect.x&&e.x<=this._rect.x+this._rect.w&&e.y>=this._rect.y&&e.y<=this._rect.y+this._rect.h);};return C;});
