/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){sap.ui.define(["require","exports"],function(r,e){"use strict";Object.defineProperty(e,"__esModule",{value:true});e.serialize=void 0;function s(d){if(d===d.sina.getAllDataSource()){return[{Id:"<All>",Type:"Category",},];}var t;var R=[];var u;switch(d.type){case d.sina.DataSourceType.Category:t="Category";R.push({Id:d.id,Type:t,});break;case d.sina.DataSourceType.BusinessObject:t="View";R.push({Id:d.id,Type:t,});break;case d.sina.DataSourceType.UserCategory:u=d;if(!u.subDataSources||Array.isArray(u.subDataSources)===false){break;}for(var _=0,a=u.subDataSources;_<a.length;_++){var b=a[_];switch(b.type){case b.sina.DataSourceType.Category:t="Category";R.push({Id:b.id,Type:t,});break;case b.sina.DataSourceType.BusinessObject:t="View";R.push({Id:b.id,Type:t,});break;}}}return R;}e.serialize=s;});})();
