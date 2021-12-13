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
    exports.NavigationTarget = void 0;
    var NavigationTarget = /** @class */ (function (_super) {
        __extends(NavigationTarget, _super);
        function NavigationTarget(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.targetUrl = (_a = properties.targetUrl) !== null && _a !== void 0 ? _a : _this.targetUrl;
            _this.label = (_b = properties.label) !== null && _b !== void 0 ? _b : _this.label;
            _this.target = (_c = properties.target) !== null && _c !== void 0 ? _c : _this.target;
            return _this;
        }
        NavigationTarget.prototype.performNavigation = function (params) {
            params = params || {};
            var trackingOnly = params.trackingOnly || false;
            if (!trackingOnly) {
                if (this.target) {
                    window.open(this.targetUrl, this.target, "noopener,noreferrer");
                }
                else {
                    window.open(this.targetUrl, "_blank", "noopener,noreferrer");
                }
            }
        };
        NavigationTarget.prototype.isEqualTo = function (otherNavigationObject) {
            if (!otherNavigationObject) {
                return false;
            }
            return this.targetUrl == otherNavigationObject.targetUrl;
        };
        return NavigationTarget;
    }(SinaObject_1.SinaObject));
    exports.NavigationTarget = NavigationTarget;
});
})();