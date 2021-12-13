/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */
sap.ui.define(["sap/ui/base/ManagedObject","sap/ui/model/json/JSONModel","./findIndexInArray","./AnimationPlayback","./Core"],function(M,J,f,A,v){"use strict";var V=M.extend("sap.ui.vk.View",{metadata:{library:"sap.ui.vk",interfaces:["sap.ui.vk.IPlaybackCollection"],properties:{viewId:{type:"string"},name:{type:"string"},description:{type:"string"},aspectRatio:{type:"float"}}}});V.prototype.init=function(){this._playbacks=[];this._playbacksJSONData=[];this._model=new J({playbacks:this._playbacksJSONData});this._model.setSizeLimit(1000*1000);this._highlightIdNodesMap=new Map();};V.prototype.exit=function(){this._playbacks=undefined;this._playbacksJSONData=undefined;this._highlightIdNodesMap=undefined;};V.prototype.getCamera=function(){return this._camera;};V.prototype.setCamera=function(c){this._camera=c;return this;};V.prototype.hasHighlight=function(){return this._highlightIdNodesMap&&this._highlightIdNodesMap.size;};V.prototype.getHighlightIdNodesMap=function(){return this._highlightIdNodesMap;};V.prototype.addHighlightedNodes=function(h,n){var a=this._highlightIdNodesMap.get(h);if(!Array.isArray(n)){n=[n];}if(!a){this._highlightIdNodesMap.set(h,n);}else{a=a.concat(n.filter(function(i){return a.indexOf(i)<0;}));this._highlightIdNodesMap.set(h,a);}};V.prototype.hasAnimation=function(){return this._playbacks&&this._playbacks.length;};V.prototype.getPlaybacks=function(){return this._playbacks;};V.prototype.getPlayback=function(i){if(i<0||i>=this._playbacks.length){return undefined;}return this._playbacks[i];};V.prototype.indexOfPlayback=function(p){return f(this._playbacks,function(i){return i===p;});};V.prototype.addPlayback=function(p,b){this._playbacks.push(p);this._playbacksJSONData.push(p.getJSONData());if(this._model){this._model.updateBindings();}p.setJSONModel(this._model);if(!b){this._firePlaybacksChanged("playbackAdded",p);}return this;};V.prototype.insertPlayback=function(p,i,b){if(i<0){i=0;}else if(i!==0&&i>=this._playbacks.length){i=this._playbacks.length;}this._playbacks.splice(i,0,p);this._playbacksJSONData.splice(i,0,p.getJSONData());if(this._model){this._model.updateBindings();}if(!b){this._firePlaybacksChanged("playbackInserted",p);}return this;};V.prototype.sortPlaybacks=function(p,a,b){this._playbacks.sort(function(e,g){return e.getStartTime()-g.getStartTime();});this._playbacksJSONData=[];this._playbacks.forEach(function(p){this._playbacksJSONData.push(p.getJSONData());}.bind(this));var c=true;for(var i=0;i<this._playbacks.length-1;i++){var s=this._playbacks[i].getStartTime();var d=this._playbacks[i+1].getStartTime();if(d-s<0.00001){c=false;break;}}if(!b){this._firePlaybacksChanged("playbacksOrderChanged");}return c;};V.prototype.removePlayback=function(o,b){var i;if(typeof o==="number"){i=o;}else if(typeof o==="string"){i=f(this._playbacks,function(a){return a.getId()===o;});}else{i=f(this._playbacks,function(a){return a===o;});}var r;if(i!=null&&i>=0&&i<this._playbacks.length){r=this._playbacks[i];this._playbacks.splice(i,1);this._playbacksJSONData.splice(i,1);if(this._model){this._model.updateBindings();}}if(!b){this._firePlaybacksChanged("playbackRemoved",r);}return this;};V.prototype.removePlaybacks=function(b){this._playbacks.splice(0);this._playbacksJSONData.splice(0);if(this._model){this._model.updateBindings();}if(!b){this._firePlaybacksChanged("playbacksRemoved");}return this;};V.prototype.switchPlaybacks=function(p,a,b){var c,d;for(var i=0;i<this._playbacks.length;i++){if(this._playbacks[i]===p){c=i;}else if(this._playbacks[i]===a){d=i;}}if(c!==undefined&&d!==undefined){var t=this._playbacks[c];var e=this._playbacksJSONData[c];this._playbacks[c]=this._playbacks[d];this._playbacksJSONData[c]=this._playbacksJSONData[d];this._playbacks[d]=t;this._playbacksJSONData[d]=e;}this.resetPlaybacksStartTimes(true);if(!b){this._firePlaybacksChanged("playbacksOrderChanged");}return this;};V.prototype.resetPlaybacksStartTimes=function(b){if(this._playbacks.length===0){return this;}var s=0;for(var i=0;i<this._playbacks.length;i++){this._playbacks[i].setStartTime(s);s+=this._playbacks[i].getDuration();}if(!b){this._firePlaybacksChanged("playbacksStartTimeChanged");}return this;};V.prototype._firePlaybacksChanged=function(o,p){v.getEventBus().publish("sap.ui.vk","playbacksChanged",{viewId:this.getViewId(),operation:o,playback:p});};V.prototype.setPlaybacksReversed=function(r,b){for(var i=0;i<this._playbacks.length;i++){this._playbacks[i].setReversed(r);}if(!b){this._firePlaybacksChanged();}return this;};V.prototype.getNodeInfos=function(){return this._nodeInfos?this._nodeInfos:[];};V.prototype.setNodeInfos=function(i){this._nodeInfos=i;return this;};V.prototype.updateNodeInfos=function(u){var c=this.getNodeInfos();if(!c){return this.setNodeInfos(u);}var i=new Map();c.forEach(function(d,a){i.set(d.target,a);});var m=function(d,s){for(var p in s){d[p]=s[p];}};u.forEach(function(d){var a=i.get(d.target);if(a==null){c.push(d);}else{m(c[a],d);}});this.setNodeInfos(c);return this;};V.prototype.getModel=function(){return this._model;};return V;});
