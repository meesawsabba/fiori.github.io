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
sap.ui.define(["require", "exports", "./ResultSet"], function (require, exports, ResultSet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchResultSet = void 0;
    var SearchResultSet = /** @class */ (function (_super) {
        __extends(SearchResultSet, _super);
        function SearchResultSet(properties) {
            var _a, _b, _c, _d;
            var _this = _super.call(this, properties) || this;
            // _meta: {
            //     properties: {
            //         facets: {
            //             required: false,
            //             default: function () {
            //                 return [];
            //             }
            //         },
            //         totalCount: {
            //             required: true
            //         },
            //         nlqSuccess: {
            //             required: false,
            //             default: false
            //         }
            //     }
            // },
            _this.facets = [];
            _this.nlqSuccess = false;
            _this.hierarchyNodePaths = [];
            _this.facets = (_a = properties.facets) !== null && _a !== void 0 ? _a : _this.facets;
            _this.totalCount = (_b = properties.totalCount) !== null && _b !== void 0 ? _b : _this.totalCount;
            _this.nlqSuccess = (_c = properties.nlqSuccess) !== null && _c !== void 0 ? _c : _this.nlqSuccess;
            _this.hierarchyNodePaths = (_d = properties.hierarchyNodePaths) !== null && _d !== void 0 ? _d : _this.hierarchyNodePaths;
            return _this;
        }
        SearchResultSet.prototype.toString = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var result = [];
            result.push(ResultSet_1.ResultSet.prototype.toString.apply(this, args));
            for (var i = 0; i < this.facets.length; ++i) {
                var facet = this.facets[i];
                result.push(facet.toString());
            }
            return result.join("\n");
        };
        return SearchResultSet;
    }(ResultSet_1.ResultSet));
    exports.SearchResultSet = SearchResultSet;
});
})();