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
sap.ui.define(["require", "exports", "./SearchResultSetItemAttributeBase"], function (require, exports, SearchResultSetItemAttributeBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchResultSetItemAttribute = void 0;
    var SearchResultSetItemAttribute = /** @class */ (function (_super) {
        __extends(SearchResultSetItemAttribute, _super);
        function SearchResultSetItemAttribute(properties) {
            var _this = _super.call(this, properties) || this;
            _this.label = properties.label;
            _this.value = properties.value;
            _this.valueFormatted = properties.valueFormatted;
            _this.valueHighlighted = properties.valueHighlighted;
            _this.isHighlighted = properties.isHighlighted;
            _this.unitOfMeasure = properties.unitOfMeasure;
            _this.description = properties.description;
            _this.defaultNavigationTarget = properties.defaultNavigationTarget;
            _this.navigationTargets = properties.navigationTargets;
            _this.metadata = properties.metadata;
            return _this;
        }
        SearchResultSetItemAttribute.prototype.toString = function () {
            return this.label + ":" + this.valueFormatted;
        };
        return SearchResultSetItemAttribute;
    }(SearchResultSetItemAttributeBase_1.SearchResultSetItemAttributeBase));
    exports.SearchResultSetItemAttribute = SearchResultSetItemAttribute;
});
})();