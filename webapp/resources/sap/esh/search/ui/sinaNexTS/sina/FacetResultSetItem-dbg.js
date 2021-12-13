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
sap.ui.define(["require", "exports", "./ResultSetItem"], function (require, exports, ResultSetItem_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FacetResultSetItem = void 0;
    var FacetResultSetItem = /** @class */ (function (_super) {
        __extends(FacetResultSetItem, _super);
        function FacetResultSetItem(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.dimensionValueFormatted = (_a = properties.dimensionValueFormatted) !== null && _a !== void 0 ? _a : _this.dimensionValueFormatted;
            _this.measureValue = (_b = properties.measureValue) !== null && _b !== void 0 ? _b : _this.measureValue;
            _this.measureValueFormatted = (_c = properties.measureValueFormatted) !== null && _c !== void 0 ? _c : _this.measureValueFormatted;
            return _this;
        }
        FacetResultSetItem.prototype.toString = function () {
            return this.dimensionValueFormatted + ":" + this.measureValueFormatted;
        };
        return FacetResultSetItem;
    }(ResultSetItem_1.ResultSetItem));
    exports.FacetResultSetItem = FacetResultSetItem;
});
})();