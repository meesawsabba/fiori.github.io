// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ushell/services/Container",
    "sap/ushell/appRuntime/ui5/AppRuntimeService",
    "sap/ushell/appRuntime/ui5/renderers/fiori2/Renderer",
    "sap/ushell/appRuntime/ui5/ui/UIProxy",
    "sap/ushell/appRuntime/ui5/SessionHandlerAgent"
], function (oContainer, AppRuntimeService, Renderer, UIProxy, SessionHandlerAgent) {
    "use strict";

    function ContainerProxy () {
        var oAdapter;

        this.bootstrap = function (sPlatform, mAdapterPackagesByPlatform) {
            return sap.ushell.bootstrap(sPlatform, mAdapterPackagesByPlatform).then(function (Container) {
                oAdapter = sap.ushell.Container._getAdapter();

                //get indication if we are in App Runtime
                sap.ushell.Container.inAppRuntime = function () {
                    return true;
                };
                //for backward computability
                sap.ushell.Container.runningInIframe = sap.ushell.Container.inAppRuntime;

                sap.ushell.Container.getFLPUrl = function (bIncludeHash) {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPUrl", {
                            "bIncludeHash": bIncludeHash
                        });
                };

                sap.ushell.Container.getFLPUrlAsync = function (bIncludeHash) {
                    return sap.ushell.Container.getFLPUrl(bIncludeHash);
                };

                sap.ushell.Container.getRenderer = function () {
                    return Renderer;
                };

                sap.ushell.Container.logout = function () {
                    return oAdapter.logout();
                };

                sap.ushell.Container.getFLPPlatform = function () {
                    return AppRuntimeService.sendMessageToOuterShell(
                        "sap.ushell.services.Container.getFLPPlatform"
                    );
                };

                sap.ushell.Container.extendSession = function () {
                    SessionHandlerAgent.userActivityHandler();
                };
            });
        };
    }

    return new ContainerProxy();
}, true);
