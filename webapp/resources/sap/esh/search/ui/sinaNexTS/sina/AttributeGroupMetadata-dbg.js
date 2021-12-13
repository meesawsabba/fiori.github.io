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
sap.ui.define(["require", "exports", "./AttributeType", "./AttributeMetadataBase"], function (require, exports, AttributeType_1, AttributeMetadataBase_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttributeGroupMetadata = void 0;
    var AttributeGroupMetadata = /** @class */ (function (_super) {
        __extends(AttributeGroupMetadata, _super);
        function AttributeGroupMetadata(properties) {
            var _a, _b, _c, _d, _e, _f;
            var _this = _super.call(this, properties) || this;
            _this.type = AttributeType_1.AttributeType.Group;
            _this.isSortable = false;
            _this.attributes = [];
            _this.id = (_a = properties.id) !== null && _a !== void 0 ? _a : _this.id;
            _this.usage = (_b = properties.usage) !== null && _b !== void 0 ? _b : _this.usage;
            _this.label = (_c = properties.label) !== null && _c !== void 0 ? _c : _this.label;
            _this.isSortable = (_d = properties.isSortable) !== null && _d !== void 0 ? _d : _this.isSortable;
            _this.template = (_e = properties.template) !== null && _e !== void 0 ? _e : _this.template;
            _this.attributes = (_f = properties.attributes) !== null && _f !== void 0 ? _f : _this.attributes;
            return _this;
        }
        return AttributeGroupMetadata;
    }(AttributeMetadataBase_1.AttributeMetadataBase));
    exports.AttributeGroupMetadata = AttributeGroupMetadata;
});
})();