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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
sap.ui.define(["require", "exports", "./DataSource"], function (require, exports, DataSource_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FilteredDataSource = void 0;
    var FilteredDataSource = /** @class */ (function (_super) {
        __extends(FilteredDataSource, _super);
        function FilteredDataSource(properties) {
            var _a, _b, _c, _d, _e, _f;
            var _this = this;
            properties.annotations = (_a = properties.annotations) !== null && _a !== void 0 ? _a : properties.dataSource.annotations;
            properties.hidden = (_b = properties.hidden) !== null && _b !== void 0 ? _b : properties.dataSource.hidden;
            properties.attributesMetadata =
                (_c = properties.attributesMetadata) !== null && _c !== void 0 ? _c : properties.dataSource.attributesMetadata;
            properties.attributeMetadataMap =
                (_d = properties.attributeMetadataMap) !== null && _d !== void 0 ? _d : properties.dataSource.attributeMetadataMap;
            properties.attributeGroupsMetadata =
                (_e = properties.attributeGroupsMetadata) !== null && _e !== void 0 ? _e : properties.dataSource.attributeGroupsMetadata;
            properties.attributeGroupMetadataMap =
                (_f = properties.attributeGroupMetadataMap) !== null && _f !== void 0 ? _f : properties.dataSource.attributeGroupMetadataMap;
            _this = _super.call(this, properties) || this;
            _this.dataSource = properties.dataSource;
            _this.filterCondition = properties.filterCondition;
            return _this;
        }
        return FilteredDataSource;
    }(DataSource_1.DataSource));
    exports.FilteredDataSource = FilteredDataSource;
});
})();