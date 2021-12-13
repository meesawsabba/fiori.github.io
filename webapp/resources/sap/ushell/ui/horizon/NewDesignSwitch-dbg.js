// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

// Note: the NewDesignSwitch control intentionally contains application logic.
// It is done to isolate as much as possible of the "New Design" functionality for future deletion.

sap.ui.define([
    "sap/ui/core/Control",
    "sap/ushell/Config",
    "sap/m/Label",
    "sap/m/Switch",
    "sap/ushell/resources",
    "sap/ushell/ui/horizon/utils"
], function (
    Control,
    Config,
    Label,
    Switch,
    resources,
    utils
) {
    "use strict";

    var sConfigPath = "/core/shellHeader/newDesignSwitchActive";

    var NewDesignSwitch = Control.extend("sap.ushell.ui.horizon.NewDesignSwitch", {
        /** @lends sap.ushell.ui.horizon.NewdesignSwitch.prototype */
        metadata: {
            library: "sap.ushell",
            properties: {
                state: { type: "boolean", defaultValue: false }
            }
        }
    });

    NewDesignSwitch.prototype.getLabelControl = function () {
        if (!this._oLabel) {
            this._oLabel = new Label(this.getId() + "-lbl", {
                text: resources.i18n.getText("NewDesignSwitch.Label")
            });
            this._oLabel.addStyleClass("sapUshellNDSLabel");
            this._oLabel.setLabelFor(this.getSwitchControl().getId());
            this._oLabel.setParent(this);
        }
        return this._oLabel;
    };

    NewDesignSwitch.prototype.getSwitchControl = function () {
        var sId = this.getId() + "-switch";
        if (!this._oSwitch) {
            if (sap.ui.getCore().byId(sId)) {
                sap.ui.getCore().byId(sId).destroy();
            }
            this._oSwitch = new Switch(sId, {
                state: false,
                customTextOn: " ",
                customTextOff: " ",
                tooltip: resources.i18n.getText("NewDesignSwitch.Label"),
                change: this.onChange.bind(this)
            });
            this._oSwitch.addStyleClass("sapUshellNDSSwitch");
            this._oSwitch.setParent(this);
        }
        return this._oSwitch;
    };

    NewDesignSwitch.prototype.setState = function (state) {
        this.getSwitchControl().setState(!!state);
        this.setProperty("state", !!state, true);
    };

    NewDesignSwitch.prototype.init = function () {
        this.getSwitchControl();
        this.getLabelControl();

        var bActive = Config.last(sConfigPath);
        this.setState(!!bActive);
        Config.on(sConfigPath).do(this.setState.bind(this));
    };

    NewDesignSwitch.prototype.exit = function () {
        if (this._oLabel) {
            this._oLabel.destroy();
            this._oLabel = null;
        }
        if (this._oSwitch) {
            this._oSwitch.destroy();
            this._oSwitch = null;
        }
    };

    NewDesignSwitch.prototype.onChange = function (oEvent) {
        var bState = !!oEvent.getParameter("state");
        this.setProperty("state", bState);
        Config.emit(sConfigPath, bState);
        utils.toggleNewDesign(bState);
    };

    return NewDesignSwitch;
}, true /* bExport */);
