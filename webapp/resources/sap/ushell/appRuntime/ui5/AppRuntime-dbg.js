// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
prepareModules();
sap.ui.define([
    "sap/ui/Device",
    "sap/ushell/resources",
    "sap/base/util/LoaderExtensions",
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
    "sap/ushell/appRuntime/ui5/AppCommunicationMgr",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ui/thirdparty/URI",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent",
    "sap/ushell/appRuntime/ui5/services/AppLifeCycleAgent",
    "sap/ushell/appRuntime/ui5/services/ShellUIService",
    "sap/ushell/ui5service/UserStatus",
    "sap/ushell/appRuntime/ui5/services/AppConfiguration", //must be included, do not remove
    "sap/ui/core/Popup",
    "sap/ui/thirdparty/jquery",
    "sap/base/util/isEmptyObject",
    "sap/base/Log",
    "sap/ui/core/ComponentContainer",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/AccessKeysAgent",
    "sap/ui/core/BusyIndicator",
    "sap/ushell/library",
    "sap/ushell/iconfonts",
    "sap/ushell/utils/WindowUtils",
    "sap/ushell/utils/UrlParsing",
    "sap/ushell/appRuntime/ui5/performance/FesrEnhancer",
    "sap/ui/core/routing/History"
], function (
    Device,
    resources,
    LoaderExtensions,
    AppRuntimePostMessageAPI,
    AppCommunicationMgr,
    AppRuntimeService,
    URI,
    SessionHandlerAgent,
    AppLifeCycleAgent,
    ShellUIService,
    UserStatus,
    AppConfiguration,
    Popup,
    jQuery,
    isEmptyObject,
    Log,
    ComponentContainer,
    AccessKeysAgent,
    BusyIndicator,
    ushellLibrary,
    Iconfonts,
    WindowUtils,
    oUrlParsing,
    FesrEnhancer,
    History
) {
    "use strict";
    /* global apprtBIdiv */

    // track performance marks and enhance UI5's Frontend Sub Records with FLP specific information
    FesrEnhancer.init();

    var _that,
        oPageUriParams = new URI().search(true),
        oComponentContainer,
        bURLHelperReplaced = false,
        fnOrigURLHelperRedirect,
        bPluginsLoaded = false,
        bHashChangeRegistered = false,
        bPopupCallbackRegistered = false,
        UI5ComponentType = ushellLibrary.UI5ComponentType,
        bSpacesMode = false,
        vGetFullWidthParamFromManifest = false,
        oShellNavigationService;

    /**
     * Application runtime for UI5 applications running in iframe
     *
     * @private
     */
    function AppRuntime () {

        /**
         * @private
         */
        this.main = function () {
            AppCommunicationMgr.init();
            this.getPageConfig();
            AppLifeCycleAgent.getURLParameters(_that._getURI()).then(function (oURLParameters) {
                var sAppId = oURLParameters["sap-ui-app-id"];

                _that.setModulePaths();
                _that.init();
                // must be included, do not remove
                // included separately due to synchronization issues with initializing page configuration
                var oPromise = new Promise(function (fnResolve) {
                    sap.ui.require(["sap/ushell/appRuntime/ui5/services/UserInfo"], fnResolve);
                });
                Promise.all([
                    _that.initServicesContainer(),
                    _that.getAppInfo(sAppId),
                    oPromise
                ]).then(function (values) {
                    var oAppInfo = values[1];
                    SessionHandlerAgent.init();
                    AccessKeysAgent.init();
                    _that._setInitialAppRoute();
                    _that.createApplication(sAppId, oURLParameters, oAppInfo)
                        .then(function (oResolutionResult) {
                            _that.renderApplication(oResolutionResult);
                        });
                });
            });
        };

        this._setInitialAppRoute = function () {
            var oHash = oUrlParsing.parseShellHash(window.hasher.getHash());
            if (oHash && oHash.appSpecificRoute && oHash.appSpecificRoute.length > 0) {
                AppRuntimeService.sendMessageToOuterShell(
                    "sap.ushell.services.CrossApplicationNavigation.setInnerAppRoute", {
                        appSpecificRoute: decodeURIComponent(oHash.appSpecificRoute)
                    });
            }
        };

        /**
         * @private
         */
        this._getURI = function () {
            return new URI().query(true);
        };

        /**
         * @private
         */
        this.init = function () {
            Iconfonts.registerFiori2IconFont();
            vGetFullWidthParamFromManifest = this._getURIParams()["sap-manifest-width"];
            AppRuntimePostMessageAPI.registerCommHandlers({
                "sap.ushell.appRuntime": {
                    oServiceCalls: {
                        "hashChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var sHash = oServiceParams.oMessageData.body.sHash;
                                if (sHash && sHash.length > 0) {
                                    window.hasher.replaceHash(sHash);
                                }
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "setDirtyFlag": {
                            executeServiceCallFn: function (oServiceParams) {
                                var bIsDirty = oServiceParams.oMessageData.body.bIsDirty;
                                if (bIsDirty !== sap.ushell.Container.getDirtyFlag()) {
                                    sap.ushell.Container.setDirtyFlag(bIsDirty);
                                }
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "getDirtyFlag": {
                            executeServiceCallFn: function (oServiceParams) {
                                return new jQuery.Deferred().resolve(sap.ushell.Container.getDirtyFlag()).promise();
                            }
                        },
                        "themeChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var currentThemeId = oServiceParams.oMessageData.body.currentThemeId;
                                sap.ushell.Container.getUser().setTheme(currentThemeId);
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "buttonClick": {
                            executeServiceCallFn: function (oServiceParams) {
                                sap.ushell.renderers.fiori2.Renderer.handleHeaderButtonClick(
                                    oServiceParams.oMessageData.body.buttonId
                                );
                                return new jQuery.Deferred().resolve().promise();
                            }
                        },
                        "uiDensityChange": {
                            executeServiceCallFn: function (oServiceParams) {
                                var isTouch = oServiceParams.oMessageData.body.isTouch;
                                jQuery("body")
                                    .toggleClass("sapUiSizeCompact", (isTouch === "0"))
                                    .toggleClass("sapUiSizeCozy", (isTouch === "1"));
                                return new jQuery.Deferred().resolve().promise();
                            }
                        }
                    }
                }
            });
        };

        /**
         * @private
         */
        this.handleLinkElementOpen = function (event, sFLPURL) {
            if (event.target &&
                event.target.tagName === "A" &&
                event.target.target === "_blank" &&
                event.target.href && event.target.href.indexOf('#') > 0) {
                var sNewURL = _that.rebuildNewAppUrl(event.target.href, sFLPURL);
                if (sNewURL !== event.target.href) {
                    WindowUtils.openURL(sNewURL);
                    //We're returning false to determine that the default browser behaviour should NOT take place
                    // and we will be the one to handle the opening of the link (with 'window.open').
                    return false;
                }
            }
        };

        /**
         * @private
         */
        this.rebuildNewAppUrl = function (sTargetUrl, sFLPUrl) {
            var sTargetUrlSplit = sTargetUrl.split('#');
            //Check if the destination URL equals to the IFrame URL
            if (sTargetUrlSplit[0].length === 0 || sTargetUrlSplit[0] === document.URL.split('#')[0]) {
                //Replace the Iframe URL with the FLP URL or Add it before the #
                return sFLPUrl + "#" + sTargetUrlSplit[1];
            }
            return sTargetUrl;
        };

        /**
         * @private
         */
        this.getPageConfig = function () {
            var metaData,
                shellConfig = {};

            // Adds an entry to the config obj, if spaces mode is enables
            bSpacesMode = (oPageUriParams["sap-spaces"] === "true");

            metaData = jQuery("meta[name='sap.ushellConfig.ui5appruntime']")[0];
            if (metaData !== undefined) {
                shellConfig = JSON.parse(metaData.content);
                if (bSpacesMode === true) {
                    shellConfig.ushell = shellConfig.ushell || {};
                    shellConfig.ushell.spaces = {
                        "enabled": true
                    };
                }
            }
            window["sap-ushell-config"] = jQuery.extend(true, {}, getDefaultShellConfig(), shellConfig);
        };

        /**
         * @private
         */
        this.setModulePaths = function () {
            if (window["sap-ushell-config"].modulePaths) {
                var keys = Object.keys(window["sap-ushell-config"].modulePaths);
                for (var key in keys) {
                    (function () {
                        var paths = {};
                        paths[keys[key].replace(/\./g, "/")] = window["sap-ushell-config"].modulePaths[keys[key]];
                        sap.ui.loader.config({ paths: paths });
                    }());
                }
            }
        };

        /**
         * @private
         */
        this.initServicesContainer = function () {
            return new Promise(function (fnResolve) {
                sap.ui.require(["sap/ushell/appRuntime/ui5/services/Container"], function (oContainer) {
                    oContainer.bootstrap("apprt", { apprt: "sap.ushell.appRuntime.ui5.services.adapters" }).then(function () {
                        //handle dirty state confirmation dialog within the iframe and not
                        //in the outer shell
                        window.onbeforeunload = function () {
                            if (sap.ushell.Container && sap.ushell.Container.getDirtyFlag()) {
                                if (!resources.browserI18n) {
                                    resources.browserI18n = resources.getTranslationModel(window.navigator.language).getResourceBundle();
                                }
                                return resources.browserI18n.getText("dataLossExternalMessage");
                            }
                            return undefined;
                        };

                        //This section refers for the usecase where clicking on an Iframe link in order to open another Iframe
                        //application in a new tab. If the destination URL equals to the IFrame URL, it means that the destination
                        // Iframe URL is wrong and should be replaced with the FLP URL.
                        sap.ushell.Container.getFLPUrlAsync().then(function (sFLPURL) {
                            window.onclick = function (event) {
                                return _that.handleLinkElementOpen(event, sFLPURL);
                            };
                            window.onkeydown = function (e) {
                                if (e.code === 'Enter') {
                                    return _that.handleLinkElementOpen(event, sFLPURL);
                                }
                            };
                        });

                        sap.ushell.Container.getServiceAsync("ShellNavigation").then(function (oService) {
                            oShellNavigationService = oService;
                            oShellNavigationService.init(function () { });
                            fnResolve();
                        });
                    });
                });
            });
        };

        /**
         * @private
         */
        this._getURIParams = function () {
            return oPageUriParams;
        };

        /**
         * @private
         */
        this.getAppInfo = function (sAppId) {
            var oData = window["sap-ushell-config"].ui5appruntime.config.appIndex.data,
                sModule = window["sap-ushell-config"].ui5appruntime.config.appIndex.module,
                bEnableCache = window["sap-ushell-config"].ui5appruntime.config.appIndex.enableCache;

            return new Promise(function (fnResolve) {
                if (oData && !isEmptyObject(oData)) {
                    AppLifeCycleAgent.init(sModule, _that.createApplication.bind(_that), _that.renderApplication.bind(_that), bEnableCache, sAppId, oData);
                    fnResolve(oData);
                } else {
                    AppLifeCycleAgent.init(sModule, _that.createApplication.bind(_that), _that.renderApplication.bind(_that), bEnableCache);
                    AppLifeCycleAgent.getAppInfo(sAppId, document.URL).then(function (oAppInfo) {
                        fnResolve(oAppInfo);
                    });
                }
            });
        };

        /**
         * @private
         */
        this.setApplicationParameters = function (oAppInfo, oURLParameters) {
            var oStartupParameters,
                sSapIntentParam,
                sStartupParametersWithoutSapIntentParam,
                oDeferred = new jQuery.Deferred();

            function buildFinalParamsString(sSimpleParams, sIntentParams) {
                var sParams = "";
                if (sSimpleParams && sSimpleParams.length > 0) {
                    sParams = (sSimpleParams.startsWith("?") ? "" : "?") + sSimpleParams;
                }
                if (sIntentParams && sIntentParams.length > 0) {
                    sParams += (sParams.length > 0 ? "&" : "?") + sIntentParams;
                }
                return sParams;
            }

            if (oURLParameters.hasOwnProperty("sap-startup-params")) {
                oStartupParameters = (new URI("?" + oURLParameters["sap-startup-params"])).query(true);
                if (oStartupParameters.hasOwnProperty("sap-intent-param")) {
                    sSapIntentParam = oStartupParameters["sap-intent-param"];
                    delete oStartupParameters["sap-intent-param"];
                }
                sStartupParametersWithoutSapIntentParam = (new URI("?")).query(oStartupParameters).toString();

                //Handle the case when the parameters that were sent to the application were more than 1000 characters and in
                //the URL we see a shorten value of the parameters
                if (sSapIntentParam) {
                    AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.CrossApplicationNavigation.getAppStateData", { "sAppStateKey": sSapIntentParam })
                        .then(function (sMoreParams) {
                            oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam, sMoreParams);
                            oDeferred.resolve();
                        }, function (sError) {
                            oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam);
                            oDeferred.resolve();
                        });
                } else {
                    oAppInfo.url += buildFinalParamsString(sStartupParametersWithoutSapIntentParam);
                    oDeferred.resolve();
                }
            } else {
                oDeferred.resolve();
            }

            return oDeferred.promise();
        };

        /**
         * @private
         */
        this.setHashChangedCallback = function () {
            if (bHashChangeRegistered === true) {
                return;
            }
            function treatHashChanged (newHash/*, oldHash*/) {
                if (window.hasher.disableCFLPUpdate === true) {
                    return;
                }

                if (newHash && typeof newHash === "string" && newHash.length > 0) {
                    AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.appRuntime.hashChange",
                        {
                            "newHash": newHash,
                            "direction": History.getInstance().getDirection()
                        }
                    );
                }
            }
            window.hasher.changed.add(treatHashChanged.bind(this), this);
            bHashChangeRegistered = true;
        };

        this.createApplication = function (sAppId, oURLParameters, oAppInfo) {
            var sHash = oUrlParsing.getHash(window.location.href),
                oParsedHash = oUrlParsing.parseShellHash(sHash);

            return new Promise(function (fnResolve) {
                //Getting the history direction, taken from the history object of UI5 (sent by the FLP).
                //The direction value is used to update the direction property of the UI5 history object
                // that is running in the FLP.
                var sDirection = "";
                if (oURLParameters.hasOwnProperty("sap-history-dir")) {
                    sDirection = oURLParameters["sap-history-dir"];

                    oShellNavigationService.hashChanger.fireEvent("hashReplaced", {
                        hash: oShellNavigationService.hashChanger.getHash(),
                        direction: sDirection
                    });

                    Log.debug("AppRuntime.createApplication :: Informed by the FLP, to change the History direction " +
                        "property in the Iframe to: " + sDirection);
                }

                oComponentContainer = new ComponentContainer({
                    id: sAppId + "-content",
                    width: "100%",
                    height: "100%"
                });

                var isTouch = "0";
                if (oPageUriParams.hasOwnProperty("sap-touch")) {
                    isTouch = oPageUriParams["sap-touch"];
                    if (isTouch !== "0" && isTouch !== "1") {
                        isTouch = "0";
                    }
                }
                jQuery("body")
                    .toggleClass("sapUiSizeCompact", (isTouch === "0"))
                    .toggleClass("sapUiSizeCozy", (isTouch === "1"));

                AppLifeCycleAgent.setComponent(oComponentContainer);

                new ShellUIService({ scopeObject: oComponentContainer, scopeType: "component" });
                new UserStatus({ scopeObject: oComponentContainer, scopeType: "component" });

                if (bPopupCallbackRegistered === false) {
                    sap.ushell.renderers.fiori2.utils.init();
                    if (Popup.attachBlockLayerStateChange) {
                        Popup.attachBlockLayerStateChange(function (oEvent) {
                            AppRuntimeService.sendMessageToOuterShell(
                                "sap.ushell.services.ShellUIService.showShellUIBlocker",
                                { "bShow": oEvent.getParameters().visible }
                            );
                        });
                    }
                    bPopupCallbackRegistered = true;
                }

                _that.setApplicationParameters(oAppInfo, oURLParameters).done(function () {
                    _that.setHashChangedCallback();
                    sap.ushell.Container.getServiceAsync("Ui5ComponentLoader").then(function (oUi5ComponentLoader) {
                        //remove the "sap.ushell" from libs to be loaded as it is not needed (its already
                        //loaded as part of the appruntime bundle)
                        if (oAppInfo.asyncHints && Array.isArray(oAppInfo.asyncHints.libs)) {
                            oAppInfo.asyncHints.libs = oAppInfo.asyncHints.libs.filter(function (hint) {
                                return hint.name !== "sap.ushell";
                            });
                        }
                        oUi5ComponentLoader.createComponent(
                            {
                                ui5ComponentName: sAppId,
                                applicationDependencies: oAppInfo,
                                url: oAppInfo.url
                            },
                            oParsedHash,
                            [],
                            UI5ComponentType.Application
                        ).then(function (oResolutionResultWithComponentHandle) {
                            FesrEnhancer.setAppShortId(oResolutionResultWithComponentHandle.componentHandle);
                            sap.ushell.Container.getServiceAsync("AppLifeCycle").then(function (oAppLifeCycleService) {
                                oAppLifeCycleService.prepareCurrentAppObject(
                                    "UI5",
                                    oResolutionResultWithComponentHandle.componentHandle.getInstance(),
                                    false,
                                    undefined
                                );
                            });
                            _that.considerChangingTheDefaultFullWidthVal(oResolutionResultWithComponentHandle);
                            _that.overrideUrlHelperFuncs();
                            _that.loadPlugins();
                            fnResolve(oResolutionResultWithComponentHandle);
                        });
                    });
                });
            });
        };

        /**
         * @private
         */
        this.considerChangingTheDefaultFullWidthVal = function (oResolutionResultWithComponentHandle) {
            if (vGetFullWidthParamFromManifest === true || vGetFullWidthParamFromManifest === "true") {
                //Making sure that if the previous app was opened in letter box, it will not affect the default behavior
                // of the next app to be opened in full width state
                jQuery("body")
                    .toggleClass("sapUiSizeCompact", false)
                    .toggleClass("sapUShellApplicationContainerLimitedWidth", true)
                    .toggleClass("sapUShellApplicationContainer", true);
                var oComp = oResolutionResultWithComponentHandle.componentHandle.getInstance();
                var metadata = oComp.getMetadata();
                if (metadata) {
                    var vFullwidth = oComp.getMetadata().getManifestEntry("/sap.ui/fullWidth");
                    if (vFullwidth === true || vFullwidth === "true") {
                        jQuery("body")
                            .toggleClass("sapUiSizeCompact", true)
                            .toggleClass("sapUShellApplicationContainerLimitedWidth", false)
                            .toggleClass("sapUShellApplicationContainer", false);
                    }
                }
            }

        };

        /**
         * @private
         */
        this.overrideUrlHelperFuncs = function () {
            if (bURLHelperReplaced === true) {
                return;
            }
            bURLHelperReplaced = true;

            if (sap.m && sap.m.URLHelper) {
                sap.m.URLHelper.triggerEmail = function (sTo, sSubject, sBody, sCc, sBcc) {
                    AppRuntimeService.sendMessageToOuterShell("sap.ushell.services.ShellUIService.sendEmail", {
                        sTo: sTo,
                        sSubject: sSubject,
                        sBody: sBody,
                        sCc: sCc,
                        sBcc: sBcc,
                        sIFrameURL: document.URL,
                        bSetAppStateToPublic: true
                    });
                };

                fnOrigURLHelperRedirect = sap.m.URLHelper.redirect;
                sap.m.URLHelper.redirect = function (sURL, bNewWindow) {
                    if (sURL && bNewWindow === true && sURL.indexOf('#') >= 0) {
                        sap.ushell.Container.getFLPUrlAsync().then(function (sFLPURL) {
                            var sNewURL = _that.rebuildNewAppUrl(sURL, sFLPURL);
                            fnOrigURLHelperRedirect.call(sap.m.URLHelper, sNewURL, bNewWindow);
                        });
                    } else {
                        fnOrigURLHelperRedirect.call(sap.m.URLHelper, sURL, bNewWindow);
                    }
                };
            }
        };

        /**
         * @private
         */
        this.loadPlugins = function() {
            if (bPluginsLoaded === true) {
                return;
            }
            bPluginsLoaded = true;

            sap.ushell.Container.getServiceAsync("PluginManager").then(function (PluginManagerService) {
                registerRTAPluginAgent(PluginManagerService);
                registerWAPluginAgent(PluginManagerService);
                PluginManagerService.loadPlugins("RendererExtensions");
            });
        };

        /**
         * This method registers the RTA agent plugin in the AppRuntime.
         * This agent plugin will be loaded only if the FLP will loads the RTA plugin
         * @private
         */
        function registerRTAPluginAgent(PluginManagerService) {
            PluginManagerService.registerPlugins({
                RTAPluginAgent: {
                    component: "sap.ushell.appRuntime.ui5.plugins.rtaAgent",
                    url: sap.ui.require.toUrl("sap/ushell/appRuntime/ui5/plugins/rtaAgent"),
                    config: {
                        "sap-plugin-agent": true
                    }
                }
            });
        }

        /**
         * This method registers the WA agent plugin in the AppRuntime.
         * This agent plugin will be loaded only if the FLP loads the WA plugin
         * @private
         */
        function registerWAPluginAgent(PluginManagerService) {
            var scriptURL;
            if (oPageUriParams.hasOwnProperty("sap-wa-debug") && oPageUriParams["sap-wa-debug"] == "dev") {
                scriptURL = "https://education3.hana.ondemand.com/education3/web_assistant/framework/FioriAgent.js";
            } else if (oPageUriParams.hasOwnProperty("sap-wa-debug") && oPageUriParams["sap-wa-debug"] == "prev") {
                scriptURL = "https://webassistant-outlook.enable-now.cloud.sap/web_assistant/framework/FioriAgent.js";
            } else { //production script
                scriptURL = "https://webassistant.enable-now.cloud.sap/web_assistant/framework/FioriAgent.js";
            }

            PluginManagerService.registerPlugins({
                WAPluginAgent: {
                    component: "sap.ushell.appRuntime.ui5.plugins.scriptAgent",
                    url: sap.ui.require.toUrl("sap/ushell/appRuntime/ui5/plugins/scriptAgent"),
                    config: {
                        "sap-plugin-agent": true,
                        "url": scriptURL
                    }
                }
            });
        }

        /**
         * @private
         */
        this.renderApplication = function (oResolutionResult) {
            oComponentContainer
                .setComponent(oResolutionResult.componentHandle.getInstance())
                .placeAt("content");
            BusyIndicator.hide();
        };
    }

    /**
     * @private
     */
    function getDefaultShellConfig () {
        return {
            services: {
                CrossApplicationNavigation: {
                    module: "sap.ushell.appRuntime.ui5.services.CrossApplicationNavigation",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                NavTargetResolution: {
                    module: "sap.ushell.appRuntime.ui5.services.NavTargetResolution",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                ShellNavigation: {
                    module: "sap.ushell.appRuntime.ui5.services.ShellNavigation",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                AppConfiguration: {
                    module: "sap.ushell.appRuntime.ui5.services.AppConfiguration"
                },
                Bookmark: {
                    module: "sap.ushell.appRuntime.ui5.services.Bookmark",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                LaunchPage: {
                    module: "sap.ushell.appRuntime.ui5.services.LaunchPage",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                UserInfo: {
                    module: "sap.ushell.appRuntime.ui5.services.UserInfo",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                AppState: {
                    module: "sap.ushell.appRuntime.ui5.services.AppState",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                PluginManager: {
                    config: {
                        isBlueBox: true
                    }
                },
                Menu: {
                    module: "sap.ushell.appRuntime.ui5.services.Menu",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                CommonDataModel: {
                    module: "sap.ushell.appRuntime.ui5.services.CommonDataModel",
                    adapter: {
                        module: "sap.ushell.appRuntime.ui5.services.adapters.EmptyAdapter"
                    }
                },
                Ui5ComponentLoader: {
                    config: {
                        amendedLoading: false
                    }
                }
            }
        };
    }

    var appRuntime = new AppRuntime();
    _that = appRuntime;
    appRuntime.main();
    return appRuntime;
});

function prepareModules () {
    "use strict";

    sap.ui.require(["sap/ui/core/BusyIndicator"], function (BusyIndicator) {
        try {
            if (apprtBIdiv) {
                apprtBIdiv.parentNode.removeChild(apprtBIdiv);
            }
            BusyIndicator.show(0);
        } catch (e) {
            BusyIndicator.show(0);
        }
    });

    //when appruntime is loaded, we will avoid loading specific
    //dependencies as they are not in use
    if (document.URL.indexOf("ui5appruntime") > 0) {
        sap.ui.define("sap/ushell/ApplicationType", [], function () {
            return {
                URL: {
                    type: "URL"
                },
                WDA: {
                    type: "WDA"
                },
                TR: {
                    type: "TR"
                },
                NWBC: {
                    type: "NWBC"
                },
                WCF: {
                    type: "WCF"
                },
                SAPUI5: {
                    type: "SAPUI5"
                }
            };
        });
        sap.ui.define("sap/ushell/components/applicationIntegration/AppLifeCycle", [], function () {return {};});
        sap.ui.define("sap/ushell/services/_AppState/WindowAdapter", [], function () {return function() {};});
        sap.ui.define("sap/ushell/services/_AppState/SequentializingAdapter", [], function () {return function() {};});
        sap.ui.define("sap/ushell/services/_AppState/Sequentializer", [], function () {return function() {};});
        sap.ui.define("sap/ushell/services/Configuration", [], function () {
            function Configuration() {
                this.attachSizeBehaviorUpdate = function() {};
                this.hasNoAdapter = true;
            }
            Configuration.hasNoAdapter = true;
            return Configuration;
        });
        sap.ui.define("sap/ushell/services/_PluginManager/Extensions", [], function () {return function() {};});
        sap.ui.define("sap/ushell/TechnicalParameters", [], function () {
            return {
                getParameterValue: function () {return Promise.resolve([]);},
                getParameterValueSync: function () {return [];},
                getParameters: function () {return [];},
                getParameterNames: function () {return [];},
                isTechnicalParameter: function () {return false;}
            };
        });
        sap.ui.define("sap/ushell/AppInfoParameters", [], function () {
            return {
                getInfo: function () {
                    return Promise.resolve({});
                }
            };
        });
    }
}
