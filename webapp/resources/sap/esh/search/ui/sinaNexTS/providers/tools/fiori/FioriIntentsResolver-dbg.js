/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable @typescript-eslint/no-this-alias */
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
sap.ui.define(["require", "exports", "../../../sina/SinaObject", "../../../sina/AttributeType"], function (require, exports, SinaObject_1, AttributeType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FioriIntentsResolver = void 0;
    var _launchpadNavigation;
    if (typeof window !== "undefined" &&
        typeof window.sap !== "undefined" &&
        window.sap.ushell &&
        window.sap.ushell.Container &&
        window.sap.ushell.Container.getServiceAsync) {
        var oContainer_1 = window.sap.ushell.Container;
        oContainer_1
            .getServiceAsync("SmartNavigation")
            .then(function (service) {
            _launchpadNavigation = service;
        })
            .catch(function () {
            oContainer_1.getServiceAsync("CrossApplicationNavigation").then(function (service) {
                _launchpadNavigation = service;
            });
        });
    }
    var FioriIntentsResolver = /** @class */ (function (_super) {
        __extends(FioriIntentsResolver, _super);
        function FioriIntentsResolver(properties) {
            var _this = _super.call(this, properties) || this;
            if (typeof window !== "undefined" && window.sap && window.sap.ushell && window.sap.ushell.Container) {
                _this._fioriFrontendSystemInfo = {
                    systemId: window.sap.ushell.Container.getLogonSystem().getName(),
                    client: window.sap.ushell.Container.getLogonSystem().getClient(),
                };
                _this._primaryIntentAction = "-displayFactSheet";
                _this._suppressInSearchTag = "suppressInEnterpriseSearch".toLowerCase();
            }
            else {
                _this._fioriFrontendSystemInfo = {
                    systemId: _this.getLogonSystem().getName(),
                    client: _this.getLogonSystem().getClient(),
                };
            }
            return _this;
        }
        /**
         * Resolves the given semantic object and semantic attributes to a list of
         * sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.fiori.NavigationTargetForIntent
         * objects.
         *
         * @param {object|object[]} [vArgs]
         *   An object containing nominal arguments for the method, having the
         *   following structure:
         *   <pre>
         *   {
         *      semanticObjectType: "String",    // semantic object name
         *
         *      semanticObjectTypeAttributes: {  // semantic attributes
         *         A: "B",
         *         C: ["e", "j"]
         *      },
         *
         *      systemId: "String",              // optional: SID of system where the object data is hosted
         *      client: "String",                // optional: client of system where the object data is hosted
         *
         *      fallbackDefaultNavigationTarget: "sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget",
         *                                       // optional: fallback navigation target
         *   </pre>
         *
         *   This method supports a mass invocation interface to obtain multiple results
         *   with a single call. In this case the method expects an array of objects which
         *   have the same structure as described above.
         *   </pre>
         *
         * @returns {jQuery.Deferred.promise}
         *   A promise that resolves with an object that has the following structure:
         *   <pre>
         *   {
         *      defaultNavigationTarget: sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget    //optional
         *      navigationTargets: [ sap.ushell.renderers.fiori2.search.sinaNext.sina.sina.NavigationTarget ]   //optional
         *   }
         *   </pre>
         *
         *   <p>
         *   NOTE: in case the mass invocation interface is used the promise will resolve
         *   to an array of objects which have the same structure as described above. The
         *   objects in the returned array will be in the same order as the corresponding
         *   objects were in the input array.
         *   </p>
         *
         * @public
         */
        FioriIntentsResolver.prototype.resolveIntents = function (vArgs) {
            var that = this;
            if (!_launchpadNavigation || !vArgs) {
                return Promise.resolve({
                    defaultNavigationTarget: vArgs.fallbackDefaultNavigationTarget,
                });
            }
            if (Array.isArray(vArgs)) {
                var proms = [];
                for (var k = 0; k < vArgs.length; k++) {
                    var prom = that._doResolveIntents(vArgs[k]);
                    proms.push(prom);
                }
                return Promise.all(proms);
            }
            return that._doResolveIntents(vArgs);
        };
        FioriIntentsResolver.prototype._doResolveIntents = function (vArgs) {
            var that = this;
            var semanticObjectType = vArgs.semanticObjectType;
            var semanticObjectTypeAttrs = vArgs.semanticObjectTypeAttributes;
            var systemId = vArgs.systemId;
            var client = vArgs.client;
            var fallbackDefaultNavigationTarget = vArgs.fallbackDefaultNavigationTarget;
            if (!semanticObjectType || semanticObjectType.length === 0) {
                return Promise.resolve({
                    defaultNavigationTarget: fallbackDefaultNavigationTarget,
                });
            }
            if (!semanticObjectTypeAttrs || semanticObjectTypeAttrs.length === 0) {
                return Promise.resolve();
            }
            var semanticObjectTypeAttrsAsParams = {};
            var value;
            for (var i = 0; i < semanticObjectTypeAttrs.length; i++) {
                value = this.convertAttributeValueToUI5DataTypeFormats(semanticObjectTypeAttrs[i].value, semanticObjectTypeAttrs[i].type);
                semanticObjectTypeAttrsAsParams[semanticObjectTypeAttrs[i].name] = value;
            }
            var sapSystem = {
                systemId: systemId || (that._fioriFrontendSystemInfo && that._fioriFrontendSystemInfo.systemId),
                client: client || (that._fioriFrontendSystemInfo.client && that._fioriFrontendSystemInfo.client),
            };
            // Set sap-system parameter if:
            // 1) systemId or client from search response are not undefined or empty
            // 2) fioriFrontendSystemInfo is *NOT* set
            // 3) fioriFrontendSystemInfo is set, but it contains different systemId and client info than the search response
            if (systemId &&
                systemId.trim().length > 0 &&
                client &&
                client.trim().length > 0 && // 1)
                (!that._fioriFrontendSystemInfo || // 2)
                    !(that._fioriFrontendSystemInfo.systemId === systemId &&
                        that._fioriFrontendSystemInfo.client === client))) {
                // 3)
                sapSystem.urlParameter = "sap-system=sid(" + systemId + "." + client + ")";
            }
            var primaryIntentProm = new Promise(function (resolve) {
                if (_launchpadNavigation && _launchpadNavigation.getPrimaryIntent) {
                    that.convertJQueryDeferredToPromise(_launchpadNavigation.getPrimaryIntent(semanticObjectType, semanticObjectTypeAttrsAsParams))
                        .then(function (primaryIntent) {
                        resolve(primaryIntent);
                    })
                        .catch(function () {
                        resolve();
                    });
                }
                else {
                    resolve();
                }
            });
            var intentsOuterProm = new Promise(function (resolve) {
                var intentsProm;
                if (_launchpadNavigation && _launchpadNavigation.getLinks) {
                    intentsProm = _launchpadNavigation.getLinks({
                        semanticObject: semanticObjectType,
                        params: semanticObjectTypeAttrsAsParams,
                        withAtLeastOneUsedParam: true,
                        sortResultOnTexts: true,
                    });
                }
                else {
                    intentsProm = _launchpadNavigation.getSemanticObjectLinks(semanticObjectType, semanticObjectTypeAttrsAsParams);
                }
                that.convertJQueryDeferredToPromise(intentsProm)
                    .then(function (intents) {
                    resolve(intents);
                })
                    .catch(function () {
                    resolve();
                });
            });
            return Promise.all([primaryIntentProm, intentsOuterProm]).then(function (values) {
                var i;
                var primaryIntent = values[0];
                var intent;
                var intents = values[1];
                var navigationTarget;
                var result = {
                    navigationTargets: [],
                };
                var defaultNavigationTarget;
                if (primaryIntent && !that._shallIntentBeSuppressed(primaryIntent)) {
                    defaultNavigationTarget = that._getNavigationTargetForIntent(primaryIntent, sapSystem);
                    result.defaultNavigationTarget = defaultNavigationTarget;
                }
                var foundPrimaryIntent = result.defaultNavigationTarget !== undefined;
                result.navigationTargets = [];
                if (intents) {
                    for (i = 0; i < intents.length; i++) {
                        intent = intents[i];
                        if (that._shallIntentBeSuppressed(intent)) {
                            continue;
                        }
                        navigationTarget = that._getNavigationTargetForIntent(intent, sapSystem);
                        if (!foundPrimaryIntent &&
                            intent.intent.substring(intent.intent.indexOf("-"), intent.intent.indexOf("?")) ===
                                that._primaryIntentAction) {
                            result.defaultNavigationTarget = navigationTarget;
                            foundPrimaryIntent = true;
                        }
                        else if (!defaultNavigationTarget ||
                            !navigationTarget.isEqualTo(defaultNavigationTarget)) {
                            result.navigationTargets.push(navigationTarget);
                        }
                    }
                }
                return result;
            });
        };
        FioriIntentsResolver.prototype._shallIntentBeSuppressed = function (intent) {
            if (intent.tags) {
                for (var i = 0; i < intent.tags.length; i++) {
                    if (intent.tags[i].toLowerCase() === this._suppressInSearchTag) {
                        return true;
                    }
                }
            }
            return false;
        };
        FioriIntentsResolver.prototype._getNavigationTargetForIntent = function (intent, sapSystem) {
            var that = this;
            var shellHash = intent.intent;
            if (sapSystem.urlParameter) {
                if (shellHash.indexOf("?") === -1) {
                    shellHash += "?";
                }
                else {
                    shellHash += "&";
                }
                shellHash += sapSystem.urlParameter;
            }
            var externalTarget = {
                target: {
                    shellHash: shellHash,
                },
            };
            var externalHash = _launchpadNavigation.hrefForExternal(externalTarget);
            var navigationObject = that.sina._createNavigationTargetForIntent({
                label: intent.text,
                targetUrl: externalHash,
                externalTarget: externalTarget,
                systemId: sapSystem.systemId,
                client: sapSystem.client,
            });
            return navigationObject;
        };
        FioriIntentsResolver.prototype.convertAttributeValueToUI5DataTypeFormats = function (value, sinaAttributeType) {
            var year, month, day, hour, minute, seconds, microseconds;
            switch (sinaAttributeType) {
                case AttributeType_1.AttributeType.Timestamp:
                    // sina: JavaScript Date object
                    // UI5: "YYYY-MM-DDTHH:MM:SS.mmm"
                    year = value.getUTCFullYear();
                    month = value.getUTCMonth() + 1;
                    day = value.getUTCDate();
                    hour = value.getUTCHours();
                    minute = value.getUTCMinutes();
                    seconds = value.getUTCSeconds();
                    microseconds = value.getUTCMilliseconds() * 1000;
                    value =
                        this.addLeadingZeros(year.toString(), 4) +
                            "-" +
                            this.addLeadingZeros(month.toString(), 2) +
                            "-" +
                            this.addLeadingZeros(day.toString(), 2) +
                            "T" +
                            this.addLeadingZeros(hour.toString(), 2) +
                            ":" +
                            this.addLeadingZeros(minute.toString(), 2) +
                            ":" +
                            this.addLeadingZeros(seconds.toString(), 2) +
                            "." +
                            this.addLeadingZeros(microseconds.toString(), 3);
                    break;
                case AttributeType_1.AttributeType.Date:
                    // sina: JavaScript Date object
                    // UI5: "YYYY-MM-DD"
                    value = value.slice(0, 4) + "-" + value.slice(5, 7) + "-" + value.slice(8, 10);
                    break;
            }
            return value;
        };
        FioriIntentsResolver.prototype.addLeadingZeros = function (value, length) {
            return "00000000000000".slice(0, length - value.length) + value;
        };
        FioriIntentsResolver.prototype.getLogonSystem = function () {
            return {
                getName: function () {
                    return;
                },
                getClient: function () {
                    return;
                },
                getPlatform: function () {
                    return;
                },
            };
        };
        // =======================================================================
        // convert jquery to promise
        // =======================================================================
        FioriIntentsResolver.prototype.convertJQueryDeferredToPromise = function (deferred) {
            if (deferred.always) {
                // is deferred, convert needed
                return new Promise(function (resolve, reject) {
                    deferred.then(resolve, reject);
                });
            }
            else {
                // is promise, convert not needed
                return deferred;
            }
        };
        return FioriIntentsResolver;
    }(SinaObject_1.SinaObject));
    exports.FioriIntentsResolver = FioriIntentsResolver;
});
})();