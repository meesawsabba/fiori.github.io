// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/base/util/UriParameters",
    "sap/ui/thirdparty/URI",
    "sap/ui/thirdparty/jquery",
    "sap/ui/Device",
    "sap/ui/core/BusyIndicator",
    "sap/ushell/appRuntime/ui5/performance/FesrEnhancer"
], function (AppRuntimePostMessageAPI, AppRuntimeService, UriParameters, URI, jQuery, Device, BusyIndicator, FesrEnhancer) {
    "use strict";

    function AppLifeCycleAgent () {
        var that = this,
            sAppResolutionModule,
            oAppResolution,
            bEnableAppResolutionCache = true,
            oAppResolutionCache = {},
            fnCreateApplication,
            oCachedApplications = {},
            oRunningApp,
            fnRenderApp;

        this.init = function (sModule, ofnCreateApplication, ofnRenderApp, bEnableCache, sAppId, oAppInfo) {
            sAppResolutionModule = sModule;
            fnCreateApplication = ofnCreateApplication;
            fnRenderApp = ofnRenderApp;
            if (bEnableCache !== undefined) {
                bEnableAppResolutionCache = bEnableCache;
            }
            this.addAppInfoToCache(sAppId, oAppInfo);

            // register this create & destroy as a appLifeCycleCommunication handler
            AppRuntimePostMessageAPI.registerCommHandlers({
                "sap.ushell.services.appLifeCycle": {
                    oServiceCalls: {
                        create: {
                            executeServiceCallFn: function (oMessageData) {
                                FesrEnhancer.startInteraction();

                                var oMsg = JSON.parse(oMessageData.oMessage.data),
                                    sAppId = new UriParameters(oMsg.body.sUrl).get("sap-ui-app-id");

                                that.create(sAppId, oMsg.body.sUrl);
                                window.hasher.disableCFLPUpdate = true;
                                window.hasher.replaceHash(oMsg.body.sHash);
                                window.hasher.disableCFLPUpdate = false;
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        destroy: {
                            executeServiceCallFn: function (oMessageData) {
                                var oMsg = JSON.parse(oMessageData.oMessage.data);
                                that.destroy(oMsg.body.sCacheId);
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        store: {
                            executeServiceCallFn: function (oMessageData) {
                                var oMsg = JSON.parse(oMessageData.oMessage.data);
                                that.store(oMsg.body.sCacheId);
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        restore: {
                            executeServiceCallFn: function (oMessageData) {
                                var oMsg = JSON.parse(oMessageData.oMessage.data);

                                that.restore(oMsg.body.sCacheId);
                                window.hasher.disableCFLPUpdate = true;
                                window.hasher.replaceHash(oMsg.body.sHash);
                                window.hasher.disableCFLPUpdate = false;
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });
            this.initialSetup();
        };

        this.initialSetup = function () {
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.appLifeCycle.setup", {
                isStateful: true,
                isKeepAlive: true,
                lifecycle: {
                    bActive: true,
                    bSwitch: true,
                    bStorageIdentifier: true
                },
                settings: {
                    bTheme: true,
                    bLocal: true
                },
                session: {
                    bSignOffSupport: true,
                    bExtendSessionSupport: true
                }
            });
        };

        this.restore = function (sStorageKey) {
            var oCachedEntry = oCachedApplications[sStorageKey],
                oApp = oCachedEntry.getComponentInstance();

            oCachedEntry.setVisible(true);

            if (oApp) {
                if (oApp.isKeepAliveSupported && oApp.isKeepAliveSupported() === true) {
                    oApp.activate();
                } else {
                    if (oApp.restore) {
                        oApp.restore();
                    }
                    if (oApp.getRouter && oApp.getRouter() && oApp.getRouter().initialize) {
                        oApp.getRouter().initialize();
                    }
                }

                oRunningApp = oCachedEntry;
            }
        };

        this.store = function (sStorageKey) {
            var oCachedEntry = oRunningApp,
                oApp;

            oCachedApplications[sStorageKey] = oCachedEntry;

            oApp = oCachedEntry.getComponentInstance();
            oCachedEntry.setVisible(false);

            if (oApp) {
                if (oApp.isKeepAliveSupported && oApp.isKeepAliveSupported() === true) {
                    oApp.deactivate();
                } else {
                    if (oApp.suspend) {
                        oApp.suspend();
                    }
                    if (oApp.getRouter && oApp.getRouter()) {
                        oApp.getRouter().stop();
                    }
                }
            }
        };

        this.getURLParameters = function (oUrlParameters) {
            return new Promise(function (fnResolve, fnReject) {
                if (oUrlParameters.hasOwnProperty("sap-intent-param")) {
                    var sAppStateKey = oUrlParameters["sap-intent-param"];
                    AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData", { sAppStateKey: sAppStateKey })
                        .then(function (sParameters) {
                            delete oUrlParameters["sap-intent-param"];
                            var oUrlParametersExpanded = jQuery.extend({}, oUrlParameters, (new URI("?" + sParameters)).query(true), true);
                            fnResolve(oUrlParametersExpanded);
                        }, function (sError) {
                            fnResolve(oUrlParameters);
                        });
                } else {
                    fnResolve(oUrlParameters);
                }
            });
        };

        this.getAppInfo = function (appId, sUrl) {
            return new Promise(function (fnResolve) {
                function fnGetAppInfo () {
                    oAppResolution.getAppInfo(appId, sUrl).then(function (oAppInfo) {
                        that.addAppInfoToCache(appId, oAppInfo);
                        fnResolve(oAppInfo);
                    });
                }

                if (bEnableAppResolutionCache === true && oAppResolutionCache[appId]) {
                    fnResolve(JSON.parse(JSON.stringify(oAppResolutionCache[appId])));
                } else if (oAppResolution) {
                    fnGetAppInfo();
                } else {
                    sap.ui.require([sAppResolutionModule.replace(/\./g, "/")], function (oObj) {
                        oAppResolution = oObj;
                        fnGetAppInfo();
                    });
                }
            });
        };

        this.addAppInfoToCache = function (sAppId, oAppInfo) {
            if (sAppId && oAppInfo &&
                bEnableAppResolutionCache === true &&
                oAppResolutionCache[sAppId] === undefined) {
                oAppResolutionCache[sAppId] = JSON.parse(JSON.stringify(oAppInfo));
            }
        };

        this.create = function (appId, sUrl) {
            //BusyIndicator work in hidden iframe only in chrome
            if (Device.browser.chrome) {
                BusyIndicator.show(0);
            }
            var applicationInfoPromis = new Promise(function (fnResolve) {
                that.getAppInfo(appId, sUrl).then(function (oAppInfo) {
                    fnResolve(oAppInfo);
                });
            }).then(function (oAppInfo) {
                that.getURLParameters(new URI(sUrl).query(true)).then(function (oURLParameters) {
                    fnCreateApplication(appId, oURLParameters, oAppInfo)
                        .then(function (oResolutionResult) {
                            fnRenderApp(oResolutionResult);
                        });
                });
            });

            return applicationInfoPromis;
        };

        this.setComponent = function (oApp) {
            oRunningApp = oApp;
        };

        this.destroy = function (sStorageKey) {
            if (sStorageKey) {
                if (oCachedApplications[sStorageKey] === oRunningApp) {
                    oRunningApp = undefined;
                }
                oCachedApplications[sStorageKey].destroy();
                delete oCachedApplications[sStorageKey];
            } else if (oRunningApp) {
                oRunningApp.destroy();
                oRunningApp = undefined;
            }
            FesrEnhancer.setAppShortId();
        };
    }

    return new AppLifeCycleAgent();
}, true);
