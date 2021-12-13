/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","../../core/core"],function(r,e,c){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.SuggestionParser=void 0;var S=(function(){function S(p){this.provider=p;this.sina=p.sina;}S.prototype.parse=function(q,d){var s=[];var a;var b;for(var i=0;i<d.length;i++){a=null;b=d[i];a=this.parseSearchTermSuggestion(q,b);s.push(a);}return s;};S.prototype.parseDataSourceSuggestion=function(q,a){var b=this.sina.SuggestionCalculationMode.Data;var d=this.sina.getDataSource(a.FromDataSource);if(!d){return null;}var f=q.filter.clone();f.setDataSource(d);return this.sina._createDataSourceSuggestion({calculationMode:b,dataSource:d,label:a.SearchTermsHighlighted,});};S.prototype.parseSearchTermSuggestion=function(q,a){var f=q.filter.clone();f.setSearchTerm(a.term);return this.sina._createSearchTermSuggestion({searchTerm:a.term,calculationMode:this.sina.SuggestionCalculationMode.Data,filter:f,label:a.highlighted||a.term,});};S.prototype.parseSearchTermAndDataSourceSuggestion=function(q,a){var b=this.parseCalculationMode(a.Type);var f=q.filter.clone();f.setSearchTerm(a.SearchTerms);var d=this.sina.getDataSource(a.FromDataSource);if(!d){return null;}f.setDataSource(d);return this.sina._createSearchTermAndDataSourceSuggestion({searchTerm:a.SearchTerms,dataSource:d,calculationMode:b,filter:f,label:a.SearchTermsHighlighted,});};S.prototype.parseObjectSuggestions=function(q,s){var f=q.filter.clone();var a=[];for(var i=0;i<s.length;++i){var o=s[i];this.fillValueHighlighted(o);var t=c.map(o.titleAttributes,function(b){return b.valueFormatted;},this).join(" ");var O=this.sina._createObjectSuggestion({calculationMode:this.sina.SuggestionCalculationMode.Data,label:t,searchTerm:f.searchTerm,filter:f,object:o,});a.push(O);}return Promise.all(a);};S.prototype.fillValueHighlighted=function(o){var d=function(a){if(!a){return;}for(var i=0;i<a.length;++i){var b=a[i];if(!b.valueHighlighted){if(typeof b.valueFormatted==="string"&&b.valueFormatted.startsWith("sap-icon://")===true){b.valueHighlighted="";}else{b.valueHighlighted=b.valueFormatted;}}}};d(o.detailAttributes);d(o.titleAttributes);};S.prototype.parseCalculationMode=function(s){switch(s){case"H":return this.sina.SuggestionCalculationMode.History;case"A":case"M":return this.sina.SuggestionCalculationMode.Data;}};S.prototype._getParentCell=function(a){var p={};p=a;p.FromDataSource="<All>";p.FromDataSourceAttribute="";p.Type="A";return p;};return S;}());e.SuggestionParser=S;});})();
