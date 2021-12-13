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
sap.ui.define(["require", "exports", "../../sina/DataSourceType"], function (require, exports, DataSourceType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = void 0;
    function serialize(dataSource) {
        // handle all ds
        if (dataSource === dataSource.sina.getAllDataSource()) {
            return {
                Id: "<All>",
                Type: "Category",
            };
        }
        // convert sina type to abap_odata type
        var type;
        switch (dataSource.type) {
            case DataSourceType_1.DataSourceType.Category:
                type = "Category";
                break;
            case DataSourceType_1.DataSourceType.BusinessObject:
                type = "View";
                break;
        }
        return {
            Id: dataSource.id,
            Type: type,
        };
    }
    exports.serialize = serialize;
});
})();