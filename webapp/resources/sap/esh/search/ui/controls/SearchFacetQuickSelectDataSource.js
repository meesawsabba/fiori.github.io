/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/m/List","sap/m/StandardListItem","sap/m/ListSeparators","sap/m/ListMode","sap/m/ListType","sap/ui/core/CustomData","sap/esh/search/ui/SearchHelper",],function(L,S,a,b,c,C){"use strict";return L.extend("sap.esh.search.ui.controls.SearchFacetQuickSelectDataSource",{constructor:function(i,s){if(typeof i==="object"){s=i;i=undefined;}jQuery.extend(s,{showSeparators:a.None,mode:b.SingleSelectMaster,itemPress:function(e){var d=e.getParameter("srcControl");var f=d.getBindingContext().getObject();var m=d.getModel();if(m.config.bResetSearchTermOnQuickSelectDataSourceItemPress){m.setSearchBoxTerm("",false);}if(typeof m.config.cleanUpSpaceFilters==="function"){m.config.cleanUpSpaceFilters(m);}m.setDataSource(f.dataSource);},items:{path:"items",template:new S({type:c.Active,title:"{dataSource/label}",tooltip:"{dataSource/label}",icon:"{dataSource/icon}",customData:[new C({key:"test-id-collection",value:"{dataSource/label}",writeToDom:true,}),],selected:{parts:["/queryFilter","dataSource"],formatter:function(q,d){return q.dataSource===d;},},}),},});return L.prototype.constructor.apply(this,[i,s]);},init:function(){this.addStyleClass("sapUshellSearchFacet");},renderer:"sap.m.ListRenderer",});});
