/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports","../../sina/DataSourceType"],function(r,e,D){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.serialize=void 0;function s(d){if(d===d.sina.getAllDataSource()){return{Id:"<All>",Type:"Category",};}var t;switch(d.type){case D.DataSourceType.Category:t="Category";break;case D.DataSourceType.BusinessObject:t="View";break;}return{Id:d.id,Type:t,};}e.serialize=s;});})();
