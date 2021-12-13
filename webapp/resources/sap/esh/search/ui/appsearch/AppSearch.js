/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/esh/search/ui/appsearch/CatalogSearch","sap/esh/search/ui/appsearch/TransactionSearch"],function(C,T){"use strict";var A=function(){this.init.apply(this,arguments);};A.prototype={init:function(p){this.catalogSearch=new C(p);this.transactionSearch=new T(p);this.searchProviders=[this.catalogSearch,this.transactionSearch];},prefetch:function(){for(var i=0;i<this.searchProviders.length;i++){var s=this.searchProviders[i];s.prefetch();}},search:function(q){var a=[];for(var i=0;i<this.searchProviders.length;i++){var s=this.searchProviders[i];a.push(s.search(q));}return Promise.all(a).then(function(b){var r={totalCount:0,tiles:[],};for(var i=0;i<b.length;i++){var c=b[i];r.totalCount+=c.totalCount;r.tiles.push.apply(r.tiles,c.tiles);}return r;});},};return A;});
