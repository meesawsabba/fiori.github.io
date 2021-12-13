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
sap.ui.define(["require", "exports", "../../core/core", "./Configurator"], function (require, exports, core, Configurator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CustomFunctionConfigurator = void 0;
    var CustomFunctionConfigurator = /** @class */ (function (_super) {
        __extends(CustomFunctionConfigurator, _super);
        function CustomFunctionConfigurator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        CustomFunctionConfigurator.prototype.initAsync = function () {
            if (core.isObject(this.configuration)) {
                this.customFunction = this.configuration.func;
                this.force = this.configuration.force;
                return;
            }
            this.customFunction = this.configuration;
            this.force = false;
        };
        CustomFunctionConfigurator.prototype.isSuitable = function (options) {
            if (core.isFunction(options.configuration)) {
                return true;
            }
            if (core.isObject(options.configuration) &&
                Object.prototype.hasOwnProperty.call(options.configuration, "func")) {
                return true;
            }
        };
        CustomFunctionConfigurator.prototype.configure = function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                return this.customFunction(value, ctx);
            }
            return value;
        };
        return CustomFunctionConfigurator;
    }(Configurator_1.Configurator));
    exports.CustomFunctionConfigurator = CustomFunctionConfigurator;
});
})();