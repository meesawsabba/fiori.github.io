// Copyright (c) 2009-2020 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/Service",
    "../../../ui5service/_ShellUIService/shelluiservice.class.factory",
    "sap/ushell/appRuntime/ui5/AppRuntimePostMessageAPI",
    "sap/ushell/appRuntime/ui5/AppRuntimeService"
], function (ServiceFactoryRegistry, ServiceFactory, Service, fnDefineClass, AppRuntimePostMessageAPI, AppRuntimeService) {
    "use strict";

    var oService = fnDefineClass({
        serviceRegistry: ServiceFactoryRegistry,
        serviceFactory: ServiceFactory,
        service: Service
    });

    var sLastSetTitle,
        bRegistered = false,
        fnBackNavigationCallback;

    var ShellUIServiceProxy = oService.extend("sap.ushell.appRuntime.services.ShellUIService", {

        setTitle: function (sTitle) {
            sLastSetTitle = sTitle;
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setTitle", {
                    sTitle: sTitle
                });
        },

        getTitle: function () {
            return sLastSetTitle;
        },

        setHierarchy: function (aHierarchyLevels) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setHierarchy", {
                    aHierarchyLevels: aHierarchyLevels
                });
        },

        setRelatedApps: function (aRelatedApps) {
            return AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.services.ShellUIService.setRelatedApps", {
                    aRelatedApps: aRelatedApps
                });
        },

        setBackNavigation: function (fnCallback) {
            if (!bRegistered) {
                bRegistered = true;
                AppRuntimePostMessageAPI.registerCommHandlers({
                    "sap.ushell.appRuntime": {
                        oServiceCalls: {
                            handleBackNavigation: {
                                executeServiceCallFn: function (oServiceParams) {
                                    if (fnBackNavigationCallback) {
                                        fnBackNavigationCallback();
                                    } else {
                                        window.history.back();
                                    }
                                }
                            }
                        }
                    }
                });
            }

            fnBackNavigationCallback = fnCallback;
            AppRuntimeService.sendMessageToOuterShell(
                "sap.ushell.ui5service.ShellUIService.setBackNavigation", {
                    callbackMessage: {
                        service: "sap.ushell.appRuntime.handleBackNavigation"
                    }
                });
        }
    });

    return ShellUIServiceProxy;
}, true);
