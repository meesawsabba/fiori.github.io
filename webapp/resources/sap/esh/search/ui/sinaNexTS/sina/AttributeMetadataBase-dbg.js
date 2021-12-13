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
sap.ui.define(["require", "exports", "./SinaObject"], function (require, exports, SinaObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AttributeMetadataBase = void 0;
    var AttributeMetadataBase = /** @class */ (function (_super) {
        __extends(AttributeMetadataBase, _super);
        function AttributeMetadataBase(properties) {
            var _a, _b, _c, _d;
            var _this = _super.call(this, properties) || this;
            _this.groups = [];
            _this.id = (_a = properties.id) !== null && _a !== void 0 ? _a : _this.id;
            _this.usage = (_b = properties.usage) !== null && _b !== void 0 ? _b : _this.usage;
            _this.displayOrder = (_c = properties.displayOrder) !== null && _c !== void 0 ? _c : _this.displayOrder;
            _this.groups = (_d = properties.groups) !== null && _d !== void 0 ? _d : _this.groups;
            _this.type = properties.type;
            return _this;
        }
        return AttributeMetadataBase;
    }(SinaObject_1.SinaObject));
    exports.AttributeMetadataBase = AttributeMetadataBase;
});
})();