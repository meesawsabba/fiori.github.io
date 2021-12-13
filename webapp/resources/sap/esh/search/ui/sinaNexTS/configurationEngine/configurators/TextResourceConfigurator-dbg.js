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
    exports.TextResourceConfigurator = void 0;
    var TextResourceConfigurator = /** @class */ (function (_super) {
        __extends(TextResourceConfigurator, _super);
        function TextResourceConfigurator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextResourceConfigurator.prototype.initAsync = function () {
            this.resourceKey = this.configuration.resourceKey;
            this.force = this.configuration.force;
        };
        TextResourceConfigurator.prototype.isSuitable = function (options) {
            if (core.isString(options.type) &&
                ["string"].indexOf(options.type) >= 0 &&
                core.isObject(options.configuration) &&
                options.configuration.resourceKey) {
                return true;
            }
            return false;
        };
        TextResourceConfigurator.prototype.configure = function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                var resourceBundle = this.resourceBundle || this.getResourceBundle(ctx);
                return resourceBundle.getText(this.resourceKey);
            }
            return value;
        };
        return TextResourceConfigurator;
    }(Configurator_1.Configurator));
    exports.TextResourceConfigurator = TextResourceConfigurator;
});
})();