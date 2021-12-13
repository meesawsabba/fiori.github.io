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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
sap.ui.define(["require", "exports", "../../core/core"], function (require, exports, core) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Configurator = void 0;
    var Configurator = /** @class */ (function () {
        function Configurator(options) {
            this.type = options.type;
            this.typeContext = options.typeContext;
            this.configuration = options.configuration;
            this.createConfiguratorAsync = options.createConfiguratorAsync;
        }
        Configurator.prototype.createContext = function (oldCtx, obj) {
            if (!oldCtx) {
                return {
                    objectStack: [obj],
                    configuratorStack: [this],
                };
            }
            var objectStack = oldCtx.objectStack.slice();
            objectStack.push(obj);
            var configuratorStack = oldCtx.configuratorStack.slice();
            configuratorStack.push(this);
            return {
                objectStack: objectStack,
                configuratorStack: configuratorStack,
            };
        };
        Configurator.prototype.getResourceBundle = function (ctx) {
            for (var i = ctx.configuratorStack.length - 1; i >= 0; --i) {
                var configurator = ctx.configuratorStack[i];
                if (configurator.resourceBundle) {
                    return configurator.resourceBundle;
                }
            }
        };
        Configurator.prototype.getEvaluateTemplateFunction = function (ctx) {
            var createFunction = function (evaluateTemplate, obj) {
                return function (template) {
                    return evaluateTemplate(template, obj);
                };
            };
            for (var i = ctx.configuratorStack.length - 1; i >= 0; --i) {
                var configurator = ctx.configuratorStack[i];
                var obj = ctx.objectStack[i];
                if (configurator.type && configurator.type.evaluateTemplate) {
                    return createFunction(configurator.type.evaluateTemplate, obj);
                }
            }
        };
        Configurator.prototype.initResourceBundleAsync = function () {
            if (!this.configuration.resourceBundle) {
                return undefined;
            }
            return this.loadResourceBundleAsync(this.configuration.resourceBundle).then(function (resourceBundle) {
                this.resourceBundle = resourceBundle;
            }.bind(this));
        };
        Configurator.prototype.loadResourceBundleAsync = function (url) {
            // for test mode
            if (typeof window === "undefined" || !jQuery) {
                return Promise.resolve({
                    getText: function (id) {
                        return id;
                    },
                });
            }
            // load bundle + convert jquery promise to standard promise
            return new Promise(function (resolve, reject) {
                window.jQuery.sap
                    .resources({
                    url: url,
                    async: true,
                })
                    .then(function (bundle) {
                    resolve(bundle);
                }, function (error) {
                    reject(error);
                });
            });
        };
        Configurator.prototype.configureAsync = function (value, ctx) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.configure(value, ctx)];
                });
            });
        };
        Configurator.prototype.isInitialOrForced = function (value) {
            if (this.force ||
                typeof value === "undefined" ||
                (core.isObject(value) && value === null) ||
                (core.isString(value) && value.length === 0)) {
                return true;
            }
            return false;
        };
        return Configurator;
    }());
    exports.Configurator = Configurator;
});
})();