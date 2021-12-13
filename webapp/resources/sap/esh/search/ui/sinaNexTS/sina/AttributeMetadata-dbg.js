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
sap.ui.define(["require", "exports", "./AttributeMetadataBase"], function (require, exports, AttributeMetadataBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttributeMetadata = void 0;
    var AttributeMetadata = /** @class */ (function (_super) {
        __extends(AttributeMetadata, _super);
        function AttributeMetadata(properties) {
            var _a, _b, _c, _d, _e, _f, _g;
            var _this = _super.call(this, properties) || this;
            _this.label = (_a = properties.label) !== null && _a !== void 0 ? _a : _this.label;
            _this.isSortable = (_b = properties.isSortable) !== null && _b !== void 0 ? _b : _this.isSortable;
            _this.format = (_c = properties.format) !== null && _c !== void 0 ? _c : _this.format;
            _this.isKey = (_d = properties.isKey) !== null && _d !== void 0 ? _d : _this.isKey;
            _this.semantics = (_e = properties.semantics) !== null && _e !== void 0 ? _e : _this.semantics;
            _this.matchingStrategy = (_f = properties.matchingStrategy) !== null && _f !== void 0 ? _f : _this.matchingStrategy;
            _this.isHierarchy = (_g = properties.isHierarchy) !== null && _g !== void 0 ? _g : false;
            return _this;
        }
        return AttributeMetadata;
    }(AttributeMetadataBase_1.AttributeMetadataBase));
    exports.AttributeMetadata = AttributeMetadata;
});
})();