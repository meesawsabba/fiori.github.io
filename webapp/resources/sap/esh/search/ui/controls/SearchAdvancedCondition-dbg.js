/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
/* global $ */
sap.ui.define([
    "../i18n",
    "sap/ui/layout/HorizontalLayout",
    "sap/m/Button",
    "sap/m/ButtonType",
    "sap/m/Input",
    "sap/m/Select",
    "sap/m/CheckBox",
    "sap/m/DateRangeSelection",
    "sap/ui/core/InvisibleText",
    "sap/ui/core/Item",
    "sap/m/Label",
], function (i18n, HorizontalLayout, Button, ButtonType, Input, Select, CheckBox, DateRangeSelection, InvisibleText, Item, Label) {
    "use strict";
    var SearchFacetDialogHelper;
    var SearchAdvancedCondition = HorizontalLayout.extend("sap.esh.search.ui.controls.SearchAdvancedCondition", {
        metadata: {
            properties: {
                type: "",
            },
        },
        constructor: function (options) {
            var that = this;
            options = jQuery.extend({}, {
                allowWrapping: true,
                content: that.contentFactory(options),
            }, options);
            HorizontalLayout.prototype.constructor.apply(this, [options]);
            that.addStyleClass("sapUshellSearchFacetDialogDetailPageCondition");
        },
        renderer: "sap.ui.layout.HorizontalLayoutRenderer",
        contentFactory: function (options) {
            var that = this;
            var oAdvancedCheckBox = new CheckBox({
                select: function (oEvent) {
                    if (options.type === "string" || options.type === "text") {
                        SearchFacetDialogHelper.updateCountInfo(oEvent
                            .getSource()
                            .getParent()
                            .getParent()
                            .getParent()
                            .getParent()
                            .getParent()
                            .getParent());
                    }
                    else {
                        SearchFacetDialogHelper.updateCountInfo(oEvent.getSource().getParent().getParent().getParent());
                    }
                },
            }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionCheckBox");
            var oAdvancedCheckBoxLabel = sap.ui.getCore().byId("advancedCheckBoxLabel");
            if (!oAdvancedCheckBoxLabel) {
                oAdvancedCheckBoxLabel = new InvisibleText("advancedCheckBoxLabel", {
                    text: i18n.getText("checkBox"),
                });
            }
            oAdvancedCheckBox.addAriaLabelledBy("advancedCheckBoxLabel");
            var oOperatorLabel = sap.ui.getCore().byId("operatorLabel");
            if (!oOperatorLabel) {
                oOperatorLabel = new InvisibleText("operatorLabel", {
                    text: i18n.getText("operator"),
                });
            }
            var oInput, oButton, oInputBox, oSelect;
            switch (options.type) {
                case "timestamp":
                case "date":
                    oInput = new DateRangeSelection({
                        width: "86%",
                        change: function (oEvent) {
                            that.onDateRangeSelectionChange(oEvent);
                        },
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
                    oInput.onAfterRendering = function () {
                        var $this = $(this.getDomRef());
                        $("input", $this).attr("readonly", "readonly");
                    };
                    break;
                case "string":
                    oAdvancedCheckBox.setVisible(false);
                    oInputBox = new Input({
                        width: "57%",
                        placeholder: i18n.getText("filterCondition"),
                        liveChange: function (oEvent) {
                            that.onAdvancedInputChange(oEvent);
                        },
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
                    oSelect = new Select({
                        width: "40%",
                        tooltip: i18n.getText("operator"),
                        items: [
                            new Item({
                                text: i18n.getText("equals"),
                                key: "eq",
                            }),
                            new Item({
                                text: i18n.getText("beginsWith"),
                                key: "bw",
                            }),
                            new Item({
                                text: i18n.getText("endsWith"),
                                key: "ew",
                            }),
                            new Item({
                                text: i18n.getText("contains"),
                                key: "co",
                            }),
                        ],
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionSelect");
                    oSelect.addAriaLabelledBy("operatorLabel");
                    oInput = new HorizontalLayout({
                        allowWrapping: true,
                        content: [oSelect, oInputBox],
                    });
                    oButton = new Button({
                        icon: "sap-icon://sys-cancel",
                        type: ButtonType.Transparent,
                        tooltip: i18n.getText("removeButton"),
                        press: function (oEvent) {
                            that.onDeleteButtonPress(oEvent);
                        },
                    });
                    break;
                case "text":
                    oAdvancedCheckBox.setVisible(false);
                    oInputBox = new Input({
                        width: "57%",
                        placeholder: i18n.getText("filterCondition"),
                        liveChange: function (oEvent) {
                            that.onAdvancedInputChange(oEvent);
                        },
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
                    oSelect = new Select({
                        width: "40%",
                        tooltip: i18n.getText("operator"),
                        items: [
                            new Item({
                                text: i18n.getText("containsWords"),
                                key: "co",
                            }),
                        ],
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionSelect");
                    oSelect.addAriaLabelledBy("operatorLabel");
                    oInput = new HorizontalLayout({
                        allowWrapping: true,
                        content: [oSelect, oInputBox],
                    });
                    oButton = new Button({
                        icon: "sap-icon://sys-cancel",
                        type: ButtonType.Transparent,
                        tooltip: i18n.getText("removeButton"),
                        press: function (oEvent) {
                            that.onDeleteButtonPress(oEvent);
                        },
                    });
                    break;
                case "integer":
                case "number":
                    var oInputBoxLeft = new Input({
                        width: "46.5%",
                        placeholder: i18n.getText("fromPlaceholder"),
                        liveChange: function (oEvent) {
                            that.onAdvancedNumberInputChange(oEvent);
                        },
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
                    var oInputBoxRight = new Input({
                        width: "46.5%",
                        placeholder: i18n.getText("toPlaceholder"),
                        liveChange: function (oEvent) {
                            that.onAdvancedNumberInputChange(oEvent);
                        },
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionInput");
                    var oLabel = new Label({
                        text: "...",
                    }).addStyleClass("sapUshellSearchFacetDialogDetailPageConditionLabel");
                    oInput = new HorizontalLayout({
                        allowWrapping: true,
                        content: [oInputBoxLeft, oLabel, oInputBoxRight],
                    });
                    oInput.addEventDelegate({
                        //workaround to set focus at right end position
                        onAfterRendering: function (oEvent) {
                            var length = oEvent.srcControl
                                .getParent()
                                .getParent()
                                .getContent().length;
                            var index = oEvent.srcControl
                                .getParent()
                                .getParent()
                                .indexOfAggregation("content", oEvent.srcControl.getParent());
                            if (index === length - 2) {
                                var value = oEvent.srcControl.getContent()[2].getValue();
                                oEvent.srcControl.getContent()[2].setValue();
                                oEvent.srcControl.getContent()[2].setValue(value);
                            }
                        },
                    });
                    break;
                default:
                    break;
            }
            return [oAdvancedCheckBox, oInput, oButton];
        },
        //event: date range selection box changed
        onDateRangeSelectionChange: function (oEvent) {
            var oDateRangeSelection = oEvent.getSource();
            var oAdvancedCondition = oDateRangeSelection.getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oDateRangeSelection.getDateValue() && oDateRangeSelection.getSecondDateValue()) {
                oAdvancedCheckBox.setSelected(true);
                SearchFacetDialogHelper.insertNewAdvancedCondition(oAdvancedCondition, "date");
                SearchFacetDialogHelper.updateCountInfo(oAdvancedCondition.getParent().getParent());
            }
            else {
                oAdvancedCheckBox.setSelected(false);
            }
        },
        //event: advanced string input box changed
        onAdvancedInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var oAdvancedCondition = oInput.getParent().getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oInput.getValue()) {
                oAdvancedCheckBox.setSelected(true);
                SearchFacetDialogHelper.updateCountInfo(oAdvancedCondition.getParent().getParent().getParent().getParent().getParent());
            }
            else {
                oAdvancedCheckBox.setSelected(false);
            }
        },
        //event: advanced condition delete button pressed
        onDeleteButtonPress: function (oEvent) {
            var oAdvancedCondition = oEvent.getSource().getParent();
            SearchFacetDialogHelper.deleteAdvancedCondition(oAdvancedCondition);
        },
        //event: advanced number input box changed
        onAdvancedNumberInputChange: function (oEvent) {
            var oInput = oEvent.getSource();
            var oAdvancedCondition = oInput.getParent().getParent();
            var oAdvancedCheckBox = oAdvancedCondition.getContent()[0];
            if (oInput.getParent().getContent()[0].getValue() &&
                oInput.getParent().getContent()[2].getValue()) {
                oAdvancedCheckBox.setSelected(true);
                SearchFacetDialogHelper.insertNewAdvancedCondition(oAdvancedCondition, "number");
                SearchFacetDialogHelper.updateCountInfo(oAdvancedCondition.getParent().getParent());
            }
            else {
                oAdvancedCheckBox.setSelected(false);
            }
        },
    });
    SearchAdvancedCondition.setSearchFacetDialogHelper = function (_SearchFacetDialogHelper) {
        SearchFacetDialogHelper = _SearchFacetDialogHelper;
    };
    return SearchAdvancedCondition;
});
