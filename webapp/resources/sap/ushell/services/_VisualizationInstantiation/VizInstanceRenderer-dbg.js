// Copyright (c) 2009-2020 SAP SE, All Rights Reserved

sap.ui.define([], function () {
    "use strict";

    var VizInstanceRenderer = {
        apiVersion: 2
    };

    VizInstanceRenderer.render = function (rm, vizInstance) {
        var aControls = this._prepareControlsToBeRendered(vizInstance);

        rm.openStart("div", vizInstance);
        rm.openEnd(); // div - tag
        aControls.forEach(function (oControl) {
            rm.renderControl(oControl);
        });
        rm.close("div");
    };

    /**
     * Determines if the edit mode overlay needs to be rendered and returns the corresponding controls.
     *
     * @param {sap.ushell.ui.launchpad.VizInstance} vizInstance The vizInstance which is about to be rendered
     * @returns {object[]}
     *  The controls that need to be rendered. Either only the VizInstances content or a collection of controls belonging to the edit mode plus the content
     */
    VizInstanceRenderer._prepareControlsToBeRendered = function (vizInstance) {
        var aControls = [vizInstance.getAggregation("content")];

        if (vizInstance.getEditable()) {
            var aTileActions = vizInstance.getTileActions();
            var oRemoveIconVBox = vizInstance._getRemoveIconVBox();

            aControls.unshift(oRemoveIconVBox);

            if (aTileActions.length > 0) {
                var oActionDivCenter = vizInstance._getActionDivCenter();
                var oActionModeButtonIconVBox = vizInstance._getActionModeButtonIconVBox();
                aControls.push(oActionDivCenter);
                aControls.push(oActionModeButtonIconVBox);
            }
        }

        return aControls;
    };

    return VizInstanceRenderer;
});
