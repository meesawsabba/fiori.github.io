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
    exports.TemplateConfigurator = void 0;
    var TemplateConfigurator = /** @class */ (function (_super) {
        __extends(TemplateConfigurator, _super);
        function TemplateConfigurator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TemplateConfigurator.prototype.initAsync = function () {
            this.template = this.configuration.template;
            this.force = this.configuration.force;
        };
        TemplateConfigurator.prototype.isSuitable = function (options) {
            if (core.isString(options.type) &&
                ["string"].indexOf(options.type) >= 0 &&
                core.isObject(options.configuration) &&
                Object.prototype.hasOwnProperty.call(options.configuration, "template")) {
                return true;
            }
            return false;
        };
        TemplateConfigurator.prototype.configure = function (value, ctx) {
            if (this.isInitialOrForced(value)) {
                var evaluateTemplate = this.getEvaluateTemplateFunction(ctx);
                return evaluateTemplate(this.configuration.template);
            }
            return value;
        };
        return TemplateConfigurator;
    }(Configurator_1.Configurator));
    exports.TemplateConfigurator = TemplateConfigurator;
});
})();