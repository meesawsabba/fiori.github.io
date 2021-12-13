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
sap.ui.define(["require", "exports", "./FacetResultSetItem"], function (require, exports, FacetResultSetItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSourceResultSetItem = void 0;
    var DataSourceResultSetItem = /** @class */ (function (_super) {
        __extends(DataSourceResultSetItem, _super);
        function DataSourceResultSetItem(properties) {
            var _a;
            var _this = _super.call(this, properties) || this;
            _this.dataSource = (_a = properties.dataSource) !== null && _a !== void 0 ? _a : _this.dataSource;
            return _this;
        }
        return DataSourceResultSetItem;
    }(FacetResultSetItem_1.FacetResultSetItem));
    exports.DataSourceResultSetItem = DataSourceResultSetItem;
});
})();