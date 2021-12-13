/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","../../sina/HierarchyQuery"],function(r,e,H){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.HierarchyParser=void 0;var a=(function(){function a(){}a.prototype.parseHierarchyFacet=function(q,b,f){var n=q instanceof H.HierarchyQuery?q.nodeId:"$$ROOT$$";var h=q.sina.createHierarchyQuery({filter:q.filter.clone(),attributeId:b.id,nodeId:n,});var c=q.sina._createHierarchyResultSet({query:h,node:null,items:[],title:f["@com.sap.vocabularies.Common.v1.Label"],});var d={};var g=[];for(var _=0,i=f.Items;_<i.length;_++){var j=i[_];var k=j[b.id];var l=d[k];if(!l){l=q.sina.createHierarchyNode({id:k,label:j[b.id+"@com.sap.vocabularies.Common.v1.Text"],count:j._Count,hasChildren:j._HasChildren,});g.push(l);d[k]=l;}else{l.label=j[b.id+"@com.sap.vocabularies.Common.v1.Text"];l.count=j._Count;}var p=JSON.parse(j._Parent)[b.id];var m=d[p];if(!m){m=q.sina.createHierarchyNode({id:p,});g.push(m);d[p]=m;}m.addChildNode(l);}var o=g.find(function(o){return o.id===n;});c.node=o;return c;};return a;}());e.HierarchyParser=a;});})();
