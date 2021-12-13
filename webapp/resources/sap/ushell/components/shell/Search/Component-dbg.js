// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ui/core/UIComponent",
    "sap/ui/core/IconPool",
    "sap/ui/core/routing/HashChanger",
    "sap/ui/thirdparty/jquery"
], function (resources, UIComponent, IconPool, HashChanger, jQuery) {
    "use strict";

    return UIComponent.extend("sap.ushell.components.shell.Search.Component", {
        metadata: {
            manifest: "json",
            library: "sap.ushell"
        },

        createContent: function () {
            var oShellCtrl = sap.ushell.Container.getRenderer("fiori2").getShellController(),
                oShellView = oShellCtrl.getView(),
                oShellConfig = (oShellView.getViewData() ? oShellView.getViewData().config : {}) || {};

            var that = this;
            var bSearchEnable = (oShellConfig.enableSearch !== false);
            if (bSearchEnable) {
                var _loadSearchShellHelper = function (init) {
                    if (!that._searchShellHelperDeferred) {
                        that._searchShellHelperDeferred = new jQuery.Deferred();
                        sap.ui.getCore().loadLibrary("sap.esh.search.ui", { async: true }).then(function () {
                            sap.ui.require([
                                "sap/esh/search/ui/SearchShellHelperAndModuleLoader",
                                "sap/esh/search/ui/SearchShellHelper"
                            ], function (SearchShellHelperAndModuleLoader, searchShellHelper) {
                                if (init) {
                                    searchShellHelper.init();
                                }
                                that._searchShellHelperDeferred.resolve(searchShellHelper);
                            });
                        });
                    }
                    return that._searchShellHelperDeferred;
                };

                //Search Icon
                var oSearchConfig = {
                    id: "sf",
                    tooltip: "{i18n>searchbox_tooltip}",
                    text: "{i18n>searchBtn}",
                    ariaLabel: "{i18n>searchbox_tooltip}",
                    icon: IconPool.getIconURI("search"),
                    visible: true,
                    showSeparator: false,
                    press: function (event) {
                        _loadSearchShellHelper(false).done(function (searchShellHelper) {
                            searchShellHelper.onShellSearchButtonPressed(event);
                        });
                    }
                };

                var oShellSearchBtn = sap.ushell.Container.getRenderer("fiori2")
                    .addHeaderEndItem("sap.ushell.ui.shell.ShellHeadItem", oSearchConfig, true, false);
                oShellSearchBtn.setModel(resources.i18nModel, "i18n");

                if (oShellConfig.openSearchAsDefault) {
                    _loadSearchShellHelper(true).done(function (searchShellHelper) {
                        searchShellHelper.setDefaultOpen(true);
                    });
                }

                // track navigation
                that.oHashChanger = HashChanger.getInstance();
                that.oHashChanger.attachEvent("shellHashChanged", function (sShellHash) {
                    var hashChangeInfo = sShellHash.mParameters;
                    setTimeout(function () {
                        sap.ui.getCore().loadLibrary("sap.esh.search.ui", { async: true }).then(function () {
                            sap.ui.require([
                                "sap/esh/search/ui/HashChangeHandler"
                            ], function (HashChangeHandler) {
                                HashChangeHandler.handle(hashChangeInfo);
                            });
                        });
                    }, 6000);
                });

                oShellSearchBtn.addEventDelegate({
                    onsapskipforward: function (oEvent) {
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onsapskipback: function (oEvent) {
                        oEvent.preventDefault();
                        jQuery("#sapUshellHeaderAccessibilityHelper").focus();
                    },
                    onAfterRendering: function () {
                        jQuery("#sf").attr("aria-pressed", false);
                    }
                });
            }

            sap.ui.getCore().getEventBus().publish("shell", "searchCompLoaded", { delay: 0 });
        },

        exit: function () {
            sap.ushell.Container.getRenderer("fiori2").hideHeaderEndItem("sf");
            var oSearchButton = sap.ui.getCore().byId("sf");
            if (oSearchButton) {
                oSearchButton.destroy();
            }
        }
    });
});
