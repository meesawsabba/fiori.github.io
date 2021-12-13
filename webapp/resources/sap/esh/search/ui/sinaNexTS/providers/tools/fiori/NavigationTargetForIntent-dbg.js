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
sap.ui.define(["require", "exports", "../../../sina/NavigationTarget"], function (require, exports, NavigationTarget_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavigationTargetForIntent = void 0;
    var _oCrossAppNav;
    if (typeof window !== "undefined" &&
        typeof window.sap !== "undefined" &&
        window.sap.ushell &&
        window.sap.ushell.Container &&
        window.sap.ushell.Container.getServiceAsync) {
        var oContainer_1 = window.sap.ushell.Container;
        oContainer_1
            .getServiceAsync("SmartNavigation")
            .then(function (service) {
            _oCrossAppNav = service;
        })
            .catch(function () {
            oContainer_1.getServiceAsync("CrossApplicationNavigation").then(function (service) {
                _oCrossAppNav = service;
            });
        });
    }
    var NavigationTargetForIntent = /** @class */ (function (_super) {
        __extends(NavigationTargetForIntent, _super);
        function NavigationTargetForIntent(properties) {
            var _a, _b, _c;
            var _this = _super.call(this, properties) || this;
            _this.externalTarget = (_a = properties.externalTarget) !== null && _a !== void 0 ? _a : _this.externalTarget;
            _this.systemId = (_b = properties.systemId) !== null && _b !== void 0 ? _b : _this.systemId;
            _this.client = (_c = properties.client) !== null && _c !== void 0 ? _c : _this.client;
            return _this;
        }
        NavigationTargetForIntent.prototype.performNavigation = function (params) {
            params = params || {};
            var suppressTracking = params.suppressTracking || false;
            var trackingOnly = params.trackingOnly || false;
            if (_oCrossAppNav) {
                if (!suppressTracking) {
                    this._trackNavigation();
                }
                if (!trackingOnly) {
                    _oCrossAppNav.toExternal(this.externalTarget);
                }
            }
            else {
                // eslint-disable-next-line prefer-rest-params
                NavigationTarget_1.NavigationTarget.prototype.performNavigation.apply(this, arguments);
            }
        };
        NavigationTargetForIntent.prototype._trackNavigation = function () {
            if (_oCrossAppNav && _oCrossAppNav.trackNavigation) {
                _oCrossAppNav.trackNavigation({
                    target: this.externalTarget.target,
                });
            }
        };
        return NavigationTargetForIntent;
    }(NavigationTarget_1.NavigationTarget));
    exports.NavigationTargetForIntent = NavigationTargetForIntent;
});
})();