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
    exports.serialize = void 0;
    function serialize(dataSource) {
        // handle all ds
        if (dataSource === dataSource.sina.getAllDataSource()) {
            return [
                {
                    Id: "<All>",
                    Type: "Category",
                },
            ];
        }
        // convert sina type to abap_odata type
        var type;
        var aReturnValue = [];
        var userCategoryDataSource;
        switch (dataSource.type) {
            case dataSource.sina.DataSourceType.Category:
                type = "Category";
                aReturnValue.push({
                    Id: dataSource.id,
                    Type: type,
                });
                break;
            case dataSource.sina.DataSourceType.BusinessObject:
                type = "View";
                aReturnValue.push({
                    Id: dataSource.id,
                    Type: type,
                });
                break;
            case dataSource.sina.DataSourceType.UserCategory:
                userCategoryDataSource = dataSource;
                if (!userCategoryDataSource.subDataSources ||
                    Array.isArray(userCategoryDataSource.subDataSources) === false) {
                    break;
                }
                for (var _i = 0, _a = userCategoryDataSource.subDataSources; _i < _a.length; _i++) {
                    var subDataSource = _a[_i];
                    switch (subDataSource.type) {
                        case subDataSource.sina.DataSourceType.Category:
                            type = "Category";
                            aReturnValue.push({
                                Id: subDataSource.id,
                                Type: type,
                            });
                            break;
                        case subDataSource.sina.DataSourceType.BusinessObject:
                            type = "View";
                            aReturnValue.push({
                                Id: subDataSource.id,
                                Type: type,
                            });
                            break;
                    }
                }
        }
        return aReturnValue;
    }
    exports.serialize = serialize;
});
})();