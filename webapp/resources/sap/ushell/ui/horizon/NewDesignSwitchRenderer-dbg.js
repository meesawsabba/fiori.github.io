// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/ushell/resources",
    "sap/ui/Device"
], function (resources, Device) {
    "use strict";

    /**
     * @name NewDesignSwitch renderer.
     * @static
     * @private
     */
    var NewDesignSwitchRenderer = {
        apiVersion: 2
    };

    /**
     * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
     *
     * @param {sap.ui.core.RenderManager} rm the RenderManager that can be used for writing to the render output buffer
     * @param {sap.ui.core.Control} oControl ShellHeader to be rendered
     */
     NewDesignSwitchRenderer.render = function (rm, oControl) {
        rm.openStart("div", oControl);

        if (!oControl.getVisible()) {
            rm.style("display", "none");
        }
        rm.class("sapUshellNDS");
        rm.class("sapUiSizeCompact"); // 30px high, Shell header controls are 36px high

        rm.openEnd(); // div - tag

        rm.renderControl(oControl.getLabelControl());
        rm.renderControl(oControl.getSwitchControl());

        rm.close("div");
    };


    return NewDesignSwitchRenderer;
}, /* bExport= */ true);
