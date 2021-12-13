// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

// NewDesignSwitchItem for the overflow popup in the shell header.

sap.ui.define([
    "sap/ushell/resources",
    "sap/ushell/ui/shell/ShellHeadItem",
    "sap/ushell/Config",
    "sap/ushell/ui/horizon/utils",
    "sap/ui/core/InvisibleText"
], function (
    resources,
    ShellHeadItem,
    Config,
    utils,
    InvisibleText
) {
    "use strict";

    var oNewDesignSwitchItem;
    var bIsActive = false;
    var sConfigPath = "/core/shellHeader/newDesignSwitchActive";

    function _setActiveFlag(bActive) {
        bIsActive = !!bActive;
        if (oNewDesignSwitchItem) {
            oNewDesignSwitchItem.setIcon(_getIcon());
            oNewDesignSwitchItem.setAriaLabel(_getLabel());
            oNewDesignSwitchItem._oAriaLabel.setText(_getLabel());
        }
    }

    function _onPress () {
        bIsActive = !bIsActive;
        Config.emit(sConfigPath, bIsActive);
        utils.toggleNewDesign(bIsActive);
    }

    function _getIcon () {
        return bIsActive ? "sap-icon://accept" : "sap-icon://decline";
    }

    function _getLabel () {
        var sTextId = bIsActive ? "NewDesignSwitch.activated" : "NewDesignSwitch.deactivated";
        return resources.i18n.getText(sTextId);
    }

    function getNewDesignSwithItem() {
        if (!oNewDesignSwitchItem) { // set initial value, create control, start the listener
            oNewDesignSwitchItem = new ShellHeadItem({
                id: "newDesignSwitchItem", // see also HeadEndItemsStrategy and ShellHeaderRenderer
                text: resources.i18n.getText("NewDesignSwitch.Label"),
                press: _onPress
            });
            oNewDesignSwitchItem._oAriaLabel = new InvisibleText("newDesignSwitchItem-ariaLabel").toStatic();
            _setActiveFlag(Config.last(sConfigPath));
            Config.on(sConfigPath).do(_setActiveFlag);
        }
        return oNewDesignSwitchItem;
    }

    return {
        getSwitchItem: getNewDesignSwithItem
    };
}, true /* bExport */);
