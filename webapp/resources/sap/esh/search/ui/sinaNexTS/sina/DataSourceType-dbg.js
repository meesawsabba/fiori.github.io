/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSourceSubType = exports.DataSourceType = void 0;
    var DataSourceType;
    (function (DataSourceType) {
        DataSourceType["BusinessObject"] = "BusinessObject";
        DataSourceType["Category"] = "Category";
        DataSourceType["UserCategory"] = "UserCategory";
    })(DataSourceType = exports.DataSourceType || (exports.DataSourceType = {}));
    var DataSourceSubType;
    (function (DataSourceSubType) {
        // datasources of type    = BusinessObject
        //                subType = Filtered
        // reference a BusinessObject datasource and adds filter condition
        DataSourceSubType["Filtered"] = "Filtered";
    })(DataSourceSubType = exports.DataSourceSubType || (exports.DataSourceSubType = {}));
});
})();