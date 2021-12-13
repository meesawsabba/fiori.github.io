/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","../../core/ajax","./ajaxTemplates"],function(r,e,a,b){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.createAjaxClient=void 0;var _=function(n){if(n.SubFilters!==undefined){delete n.ActAsQueryPart;for(var i=0;i<n.SubFilters.length;i++){this._removeActAsQueryPart(n.SubFilters[i]);}}};function c(p){var d={csrf:true,requestNormalization:function(g){if(g===null){return"";}if(b.isNavigationEvent(g)){return{NotToRecord:true,};}if(b.isSearchRequest(g)||b.isNlqSearchRequest(g)||b.isChartRequest(g)||b.isValueHelperRequest(g)||b.isSuggestionRequest(g)||b.isObjectSuggestionRequest(g)){delete g.d.QueryOptions.ClientSessionID;delete g.d.QueryOptions.ClientCallTimestamp;delete g.d.QueryOptions.ClientServiceName;delete g.d.QueryOptions.ClientLastExecutionID;var h=JSON.stringify(g);var i='"DataSources":[';var j="]";var k=h.indexOf(i);var l=k+h.substring(k).indexOf(j)+j.length;var m=',"ExcludedDataSources":[]';h=[h.slice(0,l),m,h.slice(l),].join("");g=JSON.parse(h);if(g.d.Filter&&(b.isSearchRequest(g)||b.isNlqSearchRequest(g)||b.isChartRequest(g)||b.isValueHelperRequest(g)||b.isSuggestionRequest(g)||b.isObjectSuggestionRequest(g))){_(g.d.Filter);}}return g;},};p=Object.assign({},d,p);var f=new a.Client(p);return f;}e.createAjaxClient=c;});})();
