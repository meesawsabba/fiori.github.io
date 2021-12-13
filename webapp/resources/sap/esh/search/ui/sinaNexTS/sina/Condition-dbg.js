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
    exports.Condition = void 0;
    var Condition = /** @class */ (function (_super) {
        __extends(Condition, _super);
        function Condition(properties) {
            var _this = _super.call(this, { sina: properties.sina }) || this;
            _this.attributeLabel = properties.attributeLabel;
            _this.valueLabel = properties.valueLabel;
            _this.userDefined = properties.userDefined;
            return _this;
        }
        Condition.prototype.collectAttributes = function () {
            var attributeMap = {};
            this._collectAttributes(attributeMap);
            return Object.keys(attributeMap);
        };
        return Condition;
    }(SinaObject_1.SinaObject));
    exports.Condition = Condition;
});
})();