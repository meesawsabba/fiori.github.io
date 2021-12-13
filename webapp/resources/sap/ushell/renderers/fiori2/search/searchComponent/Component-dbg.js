// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/core/mvc/View",
    "sap/esh/search/ui/i18n"

], function (UIComponent, View, i18n) {
    "use strict";

    return UIComponent.extend("sap/ushell/renderers/fiori2/search/searchComponent", {
        metadata: {
            manifest: "json",
            library: "sap.ushell",
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            config: {
                title: i18n.getText("searchAppTitle"),
                compactContentDensity: true,
                cozyContentDensity: true
            }
        },
        init: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },
        createContent: function () {
            return View.create({
                id: "searchContainerApp",
                viewName: "module:sap/ushell/renderers/fiori2/search/searchComponent/view/SearchApp.view"
            });
        }
    });
});
