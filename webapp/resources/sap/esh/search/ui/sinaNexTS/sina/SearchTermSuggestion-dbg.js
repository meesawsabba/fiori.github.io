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
sap.ui.define(["require", "exports", "./Suggestion", "./SuggestionType"], function (require, exports, Suggestion_1, SuggestionType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchTermSuggestion = void 0;
    var SearchTermSuggestion = /** @class */ (function (_super) {
        __extends(SearchTermSuggestion, _super);
        function SearchTermSuggestion(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.type = SuggestionType_1.SuggestionType.SearchTerm;
            _this.childSuggestions = [];
            _this.searchTerm = (_a = properties.searchTerm) !== null && _a !== void 0 ? _a : _this.searchTerm;
            _this.filter = (_b = properties.filter) !== null && _b !== void 0 ? _b : _this.filter;
            _this.childSuggestions = (_c = properties.childSuggestions) !== null && _c !== void 0 ? _c : _this.childSuggestions;
            return _this;
        }
        return SearchTermSuggestion;
    }(Suggestion_1.Suggestion));
    exports.SearchTermSuggestion = SearchTermSuggestion;
});
})();