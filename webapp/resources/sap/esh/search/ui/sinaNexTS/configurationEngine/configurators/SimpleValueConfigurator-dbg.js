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
    exports.SimpleValueConfigurator = void 0;
    var SimpleValueConfigurator = /** @class */ (function (_super) {
        __extends(SimpleValueConfigurator, _super);
        function SimpleValueConfigurator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        SimpleValueConfigurator.prototype.initAsync = function () {
            if (core.isObject(this.configuration)) {
                this.value = this.configuration.value;
                this.force = this.configuration.force;
                return;
            }
            this.value = this.configuration;
            this.force = false;
        };
        SimpleValueConfigurator.prototype.isSuitable = function (options) {
            if (core.isString(options.type) && ["string", "integer", "object"].indexOf(options.type) >= 0) {
                return true;
            }
            return false;
        };
        SimpleValueConfigurator.prototype.configure = function (value) {
            if (this.isInitialOrForced(value)) {
                return this.value;
            }
            return value;
        };
        return SimpleValueConfigurator;
    }(Configurator_1.Configurator));
    exports.SimpleValueConfigurator = SimpleValueConfigurator;
});
})();