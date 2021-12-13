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
sap.ui.define(["require", "exports", "./Formatter", "../../configurationEngine/configuratorFactory"], function (require, exports, Formatter_1, configuratorFactory) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ConfigFormatter = void 0;
    /**
     * A ConfigFormatter allows to format visible result data based on a configuration object
     * instead of code.
     */
    var ConfigFormatter = /** @class */ (function (_super) {
        __extends(ConfigFormatter, _super);
        function ConfigFormatter(type, configuration) {
            var _this = _super.call(this) || this;
            _this.type = type;
            _this.configuration = configuration;
            return _this;
        }
        ConfigFormatter.prototype.initAsync = function () {
            return configuratorFactory
                .createConfiguratorAsync({
                type: this.type,
                configuration: this.configuration,
            })
                .then(function (configurator) {
                this.configurator = configurator;
            }.bind(this));
        };
        ConfigFormatter.prototype.formatAsync = function (obj) {
            return this.configurator.configureAsync(obj);
        };
        ConfigFormatter.prototype.format = function (obj) {
            return this.configurator.configure(obj);
        };
        return ConfigFormatter;
    }(Formatter_1.Formatter));
    exports.ConfigFormatter = ConfigFormatter;
});
})();