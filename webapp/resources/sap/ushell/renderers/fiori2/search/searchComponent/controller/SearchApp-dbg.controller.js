// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/esh/search/ui/SearchShellHelper", "sap/esh/search/ui/SearchShellHelperAndModuleLoader"
], function (
    Controller, SearchShellHelper
) {
    "use strict";

    return Controller.extend("sap/ushell/renderers/fiori2/search/searchComponent/SearchApp", {

        onInit: function () {
            // this.oShellNavigation = sap.ushell.Container.getService("ShellNavigation");
            sap.ushell.Container.getServiceAsync("ShellNavigation").then(function (service) {
                this.oShellNavigation = service;
                this.oShellNavigation.hashChanger.attachEvent("hashChanged", this.hashChanged);
            }.bind(this));

            if (SearchShellHelper.oSearchFieldGroup === undefined) {
                SearchShellHelper.init();
            }
            SearchShellHelper.setSearchState("EXP_S");
        },

        hashChanged: function () {
            var model = sap.esh.search.ui.getModelSingleton({}, "flp");
            model.parseURL();
        },

        onExit: function () {
            this.oShellNavigation.hashChanger.detachEvent("hashChanged", this.hashChanged);

            // destroy TablePersoDialog when exit search app to avoid to create same-id-TablePersoDialog triggered by oTablePersoController.active() in SearchCompositeControl.js
            var tablePersoController = this.oView.getContent()[0].oTablePersoController;
            if (tablePersoController && tablePersoController.getTablePersoDialog && tablePersoController.getTablePersoDialog()) {
                tablePersoController.getTablePersoDialog().destroy();
            }

            if (SearchShellHelper.getDefaultOpen() !== true) {
                SearchShellHelper.setSearchStateSync("COL");
            } else {
                SearchShellHelper.setSearchState("EXP");
            }

            if (this.oView.getContent()[0].oSearchPage.oFacetDialog) {
                this.oView.getContent()[0].oSearchPage.oFacetDialog.destroy();
            }
        }
    });

});

