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
sap.ui.define(["require", "exports", "./FacetResultSet", "./FacetType"], function (require, exports, FacetResultSet_1, FacetType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DataSourceResultSet = void 0;
    var DataSourceResultSet = /** @class */ (function (_super) {
        __extends(DataSourceResultSet, _super);
        function DataSourceResultSet() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.type = FacetType_1.FacetType.DataSource;
            return _this;
        }
        return DataSourceResultSet;
    }(FacetResultSet_1.FacetResultSet));
    exports.DataSourceResultSet = DataSourceResultSet;
});
})();