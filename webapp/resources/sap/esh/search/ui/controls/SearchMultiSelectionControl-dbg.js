/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["../i18n", "sap/m/ToggleButton", "sap/ui/model/BindingMode"], function (i18n, ToggleButton, BindingMode) {
    "use strict";
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchMultiSelectionControl", {
        metadata: {
            properties: {
                resultList: "object",
            },
            aggregations: {
                actions: "object",
            },
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl); // writes the Control ID
            oRm.addClass("sapUshellSearchResultList-MultiSelectionControl");
            oRm.writeClasses();
            oRm.write(">");
            oControl._renderer(oRm);
            oRm.write("</div>");
        },
        _renderer: function (oRm) {
            var that = this;
            var editButton = new ToggleButton({
                icon: "sap-icon://multi-select",
                tooltip: i18n.getText("toggleSelectionModeBtn"),
                press: function () {
                    if (this.getPressed()) {
                        that.getResultList.enableSelectionMode();
                        that.getModel().setProperty("/multiSelectionEnabled", true);
                    }
                    else {
                        that.getResultList.disableSelectionMode();
                        that.getModel().setProperty("/multiSelectionEnabled", false);
                    }
                },
                visible: false,
                pressed: {
                    parts: [
                        {
                            path: "/multiSelectionEnabled",
                        },
                    ],
                    formatter: function (length) {
                        return length > 0;
                    },
                    mode: BindingMode.OneWay,
                },
            });
            editButton.setModel(that.getModel());
            editButton.addStyleClass("sapUshellSearchResultList-toggleMultiSelectionButton");
            oRm.renderControl(editButton);
        },
    });
});
