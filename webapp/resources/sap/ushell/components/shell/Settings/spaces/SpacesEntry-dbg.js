// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/mvc/XMLView",
    "sap/ushell/resources",
    "sap/ushell/Config"
], function (
    Log,
    XMLView,
    resources,
    Config
) {
    "use strict";

    function _getShowMyHome () {
        return sap.ushell.Container.getServiceAsync("UserInfo").then(function (oUserInfo) {
            var bShow = oUserInfo.getUser().getShowMyHome();
            return resources.i18n.getText(bShow ? "settingsMyHomeShown" : "settingsMyHomeHidden");
        });
    }

    // Show "My Home shown/hidden" subtitle only when both Spaces and MyHome are enabled
    function _getSubtitleCallback () {
        var bShowSubtitle = Config.last("/core/spaces/enabled") && Config.last("/core/spaces/myHome/enabled");
        return bShowSubtitle ? _getShowMyHome : null;
    }

    return {
        getEntry: function () {
            var oViewInstance;
            return {
                id: "spacesEntry",
                entryHelpID: "spaces",
                title: resources.i18n.getText("spaces"),
                valueResult: null,
                contentResult: null,
                icon: "sap-icon://home",
                valueArgument: _getSubtitleCallback(),
                contentFunc: function () {
                    return XMLView.create({
                        id: "UserSettingsSpacesSettingsView",
                        viewName: "sap.ushell.components.shell.Settings.spaces.SpacesSetting"
                    }).then(function (oView) {
                        oViewInstance = oView;
                        return oViewInstance;
                    });
                },
                onSave: function () {
                    if (oViewInstance) {
                        return oViewInstance.getController().onSave();
                    }
                    Log.warning("Save operation for user account settings was not executed, because the spaces view was not initialized");
                    return Promise.resolve();

                },
                onCancel: function () {
                    if (oViewInstance) {
                        oViewInstance.getController().onCancel();
                        return;
                    }
                    Log.warning("Cancel operation for user account settings was not executed, because the spaces view was not initialized");
                },
                provideEmptyWrapper: false
            };
        }
    };

});
