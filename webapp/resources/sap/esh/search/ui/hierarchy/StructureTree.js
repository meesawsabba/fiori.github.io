/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){var S=function(){this.init.apply(this,arguments);};S.prototype={init:function(p){this.id=p.id;this.label=p.label;this.tree=p.tree;this.childNodes=[];this.childNodeMap={};this.parentNode=null;},addChildNode:function(n){this.childNodes.push(n);this.childNodeMap[n.id]=n;n.parentNode=this;},update:function(s){for(var i=0;i<s.childNodes.length;++i){var b=s.childNodes[i];var c=this.childNodeMap[b.id];if(!c){c=this.tree.createNode({id:b.id,label:b.label});this.addChildNode(c);}c.update(b);}},};var a=function(){this.init.apply(this,arguments);};a.prototype={init:function(p){this.nodeMap={};this.node=this.createNode(p.rootNode);},createNode:function(p){p.tree=this;var n=new S(p);this.nodeMap[p.id]=n;return n;},getNode:function(i){return this.nodeMap[i];},update:function(s){var n=this.nodeMap[s.id];if(!n){throw new Error("structure tree update failed, node does not exist "+s.id);}n.update(s);},};return a;});
