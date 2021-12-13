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
sap.ui.define(["require", "exports", "./Query"], function (require, exports, Query_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FacetQuery = void 0;
    var FacetQuery = /** @class */ (function (_super) {
        __extends(FacetQuery, _super);
        function FacetQuery(properties) {
            var _this = _super.call(this, properties) || this;
            _this.properties = properties;
            return _this;
        }
        FacetQuery.prototype.clone = function () {
            return new FacetQuery(this.properties);
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        FacetQuery.prototype._execute = function (query) {
            return Promise.resolve(null);
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        FacetQuery.prototype._formatResultSetAsync = function (resultSet) {
            return Promise.resolve();
        };
        return FacetQuery;
    }(Query_1.Query));
    exports.FacetQuery = FacetQuery;
});
})();