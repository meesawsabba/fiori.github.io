// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

// Reuse function for the New Design Switch.

sap.ui.define([
    "sap/m/MessageToast",
    "sap/ushell/resources"
], function (
    MessageToast,
    resources
) {
    "use strict";

    function toggleNewDesign (bActive) {
        sap.ushell.Container.getServiceAsync("UserInfo").then(function (oUserInfoService) {
            if (bActive) {
                oUserInfoService.activateNewDesign().then(function () {
                    MessageToast.show(resources.i18n.getText("NewDesignSwitch.activated"));
                });
            } else {
                oUserInfoService.deactivateNewDesign().then(function () {
                    MessageToast.show(resources.i18n.getText("NewDesignSwitch.deactivated"));
                });
            }
        });
    }

    return {
        toggleNewDesign: toggleNewDesign
    };
}, true /* bExport */);
