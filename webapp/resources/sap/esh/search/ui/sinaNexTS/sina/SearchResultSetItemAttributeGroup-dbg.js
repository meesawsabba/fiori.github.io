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
    exports.SearchResultSetItemAttributeGroup = void 0;
    var SearchResultSetItemAttributeGroup = /** @class */ (function (_super) {
        __extends(SearchResultSetItemAttributeGroup, _super);
        function SearchResultSetItemAttributeGroup(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.attributes = [];
            _this.label = (_a = properties.label) !== null && _a !== void 0 ? _a : _this.label;
            _this.template = (_b = properties.template) !== null && _b !== void 0 ? _b : _this.template;
            _this.attributes = (_c = properties.attributes) !== null && _c !== void 0 ? _c : _this.attributes;
            return _this;
        }
        SearchResultSetItemAttributeGroup.prototype.toString = function () {
            var valueFormatted = "", pos = 0;
            var match;
            var regex = RegExp("{[a-z]+}", "gi");
            while ((match = regex.exec(this.template)) !== null) {
                valueFormatted += this.template.substring(pos, match.index);
                var attributeName = match[0].slice(1, -1);
                valueFormatted +=
                    (this.attributes[attributeName] && this.attributes[attributeName].valueFormatted) || ""; // TODO: What if this.attributes[attributeName] is a group?
                pos = regex.lastIndex;
            }
            valueFormatted += this.template.substring(pos);
            return this.label + ":" + valueFormatted;
        };
        return SearchResultSetItemAttributeGroup;
    }(SearchResultSetItemAttributeBase_1.SearchResultSetItemAttributeBase));
    exports.SearchResultSetItemAttributeGroup = SearchResultSetItemAttributeGroup;
});
})();