/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.serialize=void 0;function s(d){if(d.id==="All"&&d.type===d.sina.DataSourceType.Category){return{ObjectName:"$$ALL$$",PackageName:"ABAP",SchemaName:"",Type:"Category",};}var t;switch(d.type){case d.sina.DataSourceType.Category:t="Category";break;case d.sina.DataSourceType.BusinessObject:t="Connector";break;}return{ObjectName:d.id,PackageName:"ABAP",SchemaName:"",Type:t,};}e.serialize=s;});})();
