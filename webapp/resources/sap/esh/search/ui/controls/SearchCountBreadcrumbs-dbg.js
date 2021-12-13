/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/ui/core/Control",
    "sap/esh/search/ui/SearchHelper",
    "sap/m/LabelDesign",
    "sap/ui/core/Icon",
    "sap/m/Label",
], function (Control, SearchHelper, LabelDesign, Icon, Label) {
    "use strict";
    return Control.extend("sap.esh.search.ui.controls.SearchCountBreadcrumbs", {
        metadata: {
            aggregations: {
                icon: {
                    type: "sap.ui.core.Icon",
                    multiple: false,
                },
                label: {
                    type: "sap.m.Label",
                    multiple: false,
                },
            },
        },
        constructor: function () {
            Control.prototype.constructor.apply(this, arguments);
            var that = this;
            that.initIcon();
            that.initLabel();
        },
        initIcon: function () {
            var that = this;
            var icon = new Icon({
                visible: {
                    parts: [
                        {
                            path: "/count",
                        },
                    ],
                    formatter: function (count) {
                        return count !== 0;
                    },
                },
                src: "{/searchInIcon}",
            });
            icon.addStyleClass("sapUshellSearchTotalCountBreadcrumbsIcon");
            that.setIcon(icon);
        },
        initLabel: function () {
            var that = this;
            var label = new Label({
                visible: {
                    parts: [
                        {
                            path: "/count",
                        },
                    ],
                    formatter: function (count) {
                        return count !== 0;
                    },
                },
                design: LabelDesign.Bold,
                text: "{/countText}",
            });
            label.addStyleClass("sapUshellSearchTotalCountSelenium");
            that.setLabel(label);
        },
        setModel: function (model) {
            this.getIcon().setModel(model);
            this.getLabel().setModel(model);
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("sapUshellSearchTotalCountBreadcrumbs");
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oControl.getAggregation("icon"));
            oRm.renderControl(oControl.getAggregation("label"));
            oRm.write("</div>");
        },
    });
});
