/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.HierarchyNodePathParser=void 0;var H=(function(){function H(s){this.sina=s;}H.prototype.parse=function(a){var _=this;var s=a;var h=[];if(!s.data["@com.sap.vocabularies.Search.v1.ParentHierarchies"]){return h;}for(var b=0,c=s.data["@com.sap.vocabularies.Search.v1.ParentHierarchies"];b<c.length;b++){var p=c[b];h.push(this.sina.createHierarchyNodePath({name:p.scope,path:p.hierarchy.map(function(n){return _.sina.createHierarchyNode({id:n.node_id,label:n.node_value});}),}));}return h;};return H;}());e.HierarchyNodePathParser=H;});})();
