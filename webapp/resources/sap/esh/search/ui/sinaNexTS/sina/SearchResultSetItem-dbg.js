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
    exports.SearchResultSetItem = void 0;
    var SearchResultSetItem = /** @class */ (function (_super) {
        __extends(SearchResultSetItem, _super);
        function SearchResultSetItem(properties) {
            var _a, _b, _c, _d, _e, _f, _g;
            var _this = _super.call(this, properties) || this;
            _this.score = 0;
            _this.dataSource = (_a = properties.dataSource) !== null && _a !== void 0 ? _a : _this.dataSource;
            _this.attributes = properties.attributes;
            _this.titleAttributes = (_b = properties.titleAttributes) !== null && _b !== void 0 ? _b : _this.titleAttributes;
            _this.titleDescriptionAttributes =
                (_c = properties.titleDescriptionAttributes) !== null && _c !== void 0 ? _c : _this.titleDescriptionAttributes;
            _this.detailAttributes = (_d = properties.detailAttributes) !== null && _d !== void 0 ? _d : _this.detailAttributes;
            _this.defaultNavigationTarget = (_e = properties.defaultNavigationTarget) !== null && _e !== void 0 ? _e : _this.defaultNavigationTarget;
            _this.navigationTargets = (_f = properties.navigationTargets) !== null && _f !== void 0 ? _f : _this.navigationTargets;
            _this.score = (_g = properties.score) !== null && _g !== void 0 ? _g : _this.score;
            return _this;
        }
        SearchResultSetItem.prototype.toString = function () {
            var i;
            var result = [];
            var title = [];
            for (i = 0; i < this.titleAttributes.length; ++i) {
                var titleAttribute = this.titleAttributes[i];
                title.push(titleAttribute.toString());
            }
            result.push("--" + title.join(" "));
            for (i = 0; i < this.detailAttributes.length; ++i) {
                var detailAttribute = this.detailAttributes[i];
                result.push(detailAttribute.toString());
            }
            return result.join("\n");
        };
        return SearchResultSetItem;
    }(ResultSetItem_1.ResultSetItem));
    exports.SearchResultSetItem = SearchResultSetItem;
});
})();