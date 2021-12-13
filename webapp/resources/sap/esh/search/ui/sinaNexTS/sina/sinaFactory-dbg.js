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
/* global process */
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
sap.ui.define(["require", "exports", "../core/util", "../core/core", "./Sina", "../providers/abap_odata/Provider", "../providers/hana_odata/Provider", "../providers/sample/Provider", "../providers/inav2/Provider", "../providers/dummy/Provider", "../providers/multi/Provider", "../core/Log", "../core/errors", "./SinaConfiguration"], function (require, exports, util, core, Sina_1, Provider_1, Provider_2, Provider_3, Provider_4, Provider_5, Provider_6, sinaLog, errors_1, SinaConfiguration_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.createByTrialAsync = exports.createAsync = void 0;
    if (typeof process !== "undefined" &&
        process.env &&
        process.env.NODE_ENV &&
        process.env.NODE_ENV === "debug") {
        var logTest = new sinaLog.Log();
        sinaLog.Log.level = sinaLog.Severity.DEBUG;
        logTest.debug("SINA log level set to debug!");
    }
    function createAsync(configuration) {
        return __awaiter(this, void 0, void 0, function () {
            var log, normalizedConfiguration, providerInstance, sina;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (configuration.logTarget) {
                            sinaLog.Log.persistency = configuration.logTarget;
                        }
                        if (typeof configuration.logLevel !== "undefined") {
                            sinaLog.Log.level = configuration.logLevel;
                        }
                        log = new sinaLog.Log("sinaFactory");
                        log.debug("Creating new eshclient instance using provider " + configuration.provider);
                        return [4 /*yield*/, SinaConfiguration_1._normalizeConfiguration(configuration)];
                    case 1:
                        normalizedConfiguration = _a.sent();
                        switch (normalizedConfiguration.provider) {
                            case SinaConfiguration_1.AvailableProviders.HANA_ODATA: {
                                providerInstance = new Provider_2.Provider();
                                break;
                            }
                            case SinaConfiguration_1.AvailableProviders.ABAP_ODATA: {
                                providerInstance = new Provider_1.Provider();
                                break;
                            }
                            case SinaConfiguration_1.AvailableProviders.INAV2: {
                                providerInstance = new Provider_4.Provider();
                                break;
                            }
                            case SinaConfiguration_1.AvailableProviders.MULTI: {
                                providerInstance = new Provider_6.MultiProvider();
                                break;
                            }
                            case SinaConfiguration_1.AvailableProviders.SAMPLE: {
                                providerInstance = new Provider_3.Provider();
                                break;
                            }
                            case SinaConfiguration_1.AvailableProviders.DUMMY: {
                                providerInstance = new Provider_5.Provider();
                                break;
                            }
                            default: {
                                throw new Error("Unknown Provider: '" +
                                    configuration.provider +
                                    "' - Available Providers: " +
                                    SinaConfiguration_1.AvailableProviders.HANA_ODATA +
                                    ", " +
                                    SinaConfiguration_1.AvailableProviders.ABAP_ODATA +
                                    ", " +
                                    SinaConfiguration_1.AvailableProviders.INAV2 +
                                    ", " +
                                    SinaConfiguration_1.AvailableProviders.MULTI +
                                    ", " +
                                    SinaConfiguration_1.AvailableProviders.SAMPLE +
                                    ", " +
                                    SinaConfiguration_1.AvailableProviders.DUMMY);
                            }
                        }
                        sina = new Sina_1.Sina(providerInstance);
                        return [4 /*yield*/, sina._initAsync(normalizedConfiguration)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, sina];
                }
            });
        });
    }
    exports.createAsync = createAsync;
    function createByTrialAsync(inputConfigurations, checkSuccessCallback) {
        var configurations;
        // normalize configurations
        return Promise.all(core.map(inputConfigurations, SinaConfiguration_1._normalizeConfiguration.bind(this), this))
            .then(function (normalizedConfigurations) {
            // mixin url configuration into configurations
            configurations = normalizedConfigurations;
            return _mixinUrlConfiguration(configurations);
        }.bind(this))
            .then(function () {
            // recursive creation of sina by loop at configurations
            // (first configuration which successfully creates sina wins)
            return _createSinaRecursively(configurations, checkSuccessCallback);
        }.bind(this));
    }
    exports.createByTrialAsync = createByTrialAsync;
    function _readConfigurationFromUrl() {
        return __awaiter(this, void 0, void 0, function () {
            var sinaConfiguration, sinaProvider;
            return __generator(this, function (_a) {
                sinaConfiguration = util.getUrlParameter("sinaConfiguration");
                if (sinaConfiguration) {
                    return [2 /*return*/, SinaConfiguration_1._normalizeConfiguration(sinaConfiguration)];
                }
                sinaProvider = util.getUrlParameter("sinaProvider");
                if (sinaProvider) {
                    return [2 /*return*/, SinaConfiguration_1._normalizeConfiguration(sinaProvider)];
                }
                return [2 /*return*/, Promise.resolve()];
            });
        });
    }
    function _createSinaRecursively(configurations, checkSuccessCallback) {
        return __awaiter(this, void 0, void 0, function () {
            var log, providersTried, doCreate;
            return __generator(this, function (_a) {
                log = new sinaLog.Log("sinaFactory");
                // set default for checkSuccesCallback
                checkSuccessCallback =
                    checkSuccessCallback ||
                        function () {
                            return true;
                        };
                providersTried = [];
                doCreate = function (index) {
                    if (index >= configurations.length) {
                        return Promise.reject(new errors_1.NoValidEnterpriseSearchAPIConfigurationFoundError(providersTried.join(", ")));
                    }
                    var configuration = configurations[index];
                    providersTried.push(configuration.provider);
                    return createAsync(configuration).then(function (sina) {
                        if (checkSuccessCallback(sina)) {
                            return sina;
                        }
                        return doCreate(index + 1);
                    }, function (error) {
                        log.info(error);
                        return doCreate(index + 1);
                    });
                }.bind(this);
                // start recursion
                return [2 /*return*/, doCreate(0)];
            });
        });
    }
    function _mixinUrlConfiguration(configurations) {
        return __awaiter(this, void 0, void 0, function () {
            var configurationFromUrl, found, i, configuration;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _readConfigurationFromUrl()];
                    case 1:
                        configurationFromUrl = _a.sent();
                        if (!configurationFromUrl) {
                            return [2 /*return*/];
                        }
                        found = false;
                        for (i = 0; i < configurations.length; ++i) {
                            configuration = configurations[i];
                            // remove configurations not matching url parameter, always accept dummy provider
                            if (configuration.provider.indexOf("/dummy/Provider") < 0 &&
                                configuration.provider !== configurationFromUrl.provider) {
                                configurations.splice(i, 1);
                                i--;
                                continue;
                            }
                            // mixin configuration from url
                            if (configuration.provider === configurationFromUrl.provider) {
                                found = true;
                                _mergeConfiguration(configuration, configurationFromUrl);
                            }
                        }
                        if (!found) {
                            configurations.splice(0, 0, configurationFromUrl);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    function _mergeConfiguration(configuration1, configuration2) {
        // TODO: deep merge
        for (var property in configuration2) {
            configuration1[property] = configuration2[property];
        }
    }
});
})();