/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.NavigationTargetTemplate=void 0;var N=(function(){function N(p){this.sina=p.sina;this.navigationTargetGenerator=p.navigationTargetGenerator;this.label=p.label;this.sourceObjectType=p.sourceObjectType;this.targetObjectType=p.targetObjectType;this.conditions=p.conditions;}N.prototype.generate=function(d){var a=this.sina.getDataSource(this.targetObjectType);var f=this.sina.createFilter({dataSource:a,searchTerm:"*",});for(var i=0;i<this.conditions.length;++i){var c=this.conditions[i];var b=this.sina.createSimpleCondition({attribute:c.targetPropertyName,attributeLabel:a.getAttributeMetadata(c.targetPropertyName).label,operator:this.sina.ComparisonOperator.Eq,value:d[c.sourcePropertyName].value,valueLabel:d[c.sourcePropertyName].valueFormatted,});f.autoInsertCondition(b);}return this.sina._createNavigationTarget({label:this.label,targetUrl:this.navigationTargetGenerator.urlPrefix+encodeURIComponent(JSON.stringify(f.toJson())),});};return N;}());e.NavigationTargetTemplate=N;});})();
