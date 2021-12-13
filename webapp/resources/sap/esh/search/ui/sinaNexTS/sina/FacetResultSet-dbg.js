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
    exports.FacetResultSet = void 0;
    var FacetResultSet = /** @class */ (function (_super) {
        __extends(FacetResultSet, _super);
        function FacetResultSet(properties) {
            return _super.call(this, properties) || this;
        }
        FacetResultSet.prototype.toString = function () {
            var result = [];
            result.push("--Facet");
            result.push(_super.prototype.toString.call(this));
            return result.join("\n");
        };
        return FacetResultSet;
    }(ResultSet_1.ResultSet));
    exports.FacetResultSet = FacetResultSet;
});
})();