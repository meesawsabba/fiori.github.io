/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "sap/ui/core/InvisibleText",
    "sap/m/Button",
    "sap/m/FlexBox",
    "sap/m/FlexItemData",
    "sap/m/FlexAlignItems",
    "sap/esh/search/ui/SearchHelper",
    "sap/esh/search/ui/controls/SearchSelect",
    "sap/esh/search/ui/controls/SearchInput",
    "sap/esh/search/ui/controls/SearchButton",
], function (InvisibleText, Button, FlexBox, FlexItemData, FlexAlignItems
// SearchHelper,
// SearchSelect,
// SearchInput,
// SearchButton,
) {
    "use strict";
    return sap.ui.core.Control.extend("sap.esh.search.ui.controls.SearchFieldGroup", {
        metadata: {
            properties: {
                selectActive: {
                    defaultValue: true,
                    type: "boolean",
                },
                inputActive: {
                    defaultValue: true,
                    type: "boolean",
                },
                buttonActive: {
                    defaultValue: true,
                    type: "boolean",
                },
                cancelButtonActive: {
                    defaultValue: true,
                    type: "boolean",
                },
            },
            aggregations: {
                _flexBox: {
                    type: "sap.m.FlexBox",
                    multiple: false,
                    visibility: "hidden",
                },
                _buttonAriaText: {
                    type: "sap.ui.core.InvisibleText",
                    multiple: false,
                    visibility: "hidden",
                },
            },
        },
        constructor: function () {
            sap.ui.core.Control.prototype.constructor.apply(this, arguments);
            var that = this;
            that.initSelect();
            that.initInput();
            that.initButton();
            that.initCancelButton();
            that.initFlexBox();
        },
        setCancelButtonActive: function (active) {
            if (active === this.getProperty("cancelButtonActive")) {
                return;
            }
            this.setProperty("cancelButtonActive", active);
            this.initFlexBox();
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        initFlexBox: function () {
            if (!this.select) {
                return;
            }
            var items = [];
            if (this.getSelectActive()) {
                this.select.setLayoutData(
                // @ts-ignore
                new FlexItemData("", {
                    growFactor: 0,
                }));
                items.push(this.select);
            }
            if (this.getInputActive()) {
                this.input.setLayoutData(
                // @ts-ignore
                new FlexItemData("", {
                    growFactor: 1,
                }));
                items.push(this.input);
            }
            if (this.getButtonActive()) {
                this.button.setLayoutData(
                // @ts-ignore
                new FlexItemData("", {
                    growFactor: 0,
                }));
                items.push(this.button);
            }
            if (this.getCancelButtonActive()) {
                this.cancelButton.setLayoutData(
                // @ts-ignore
                new FlexItemData("", {
                    growFactor: 0,
                }));
                items.push(this.cancelButton);
            }
            var flexBox = /** @type {sap.m.FlexBox} */ (this.getAggregation("_flexBox"));
            if (!flexBox) {
                flexBox = new FlexBox("", {
                    alignItems: FlexAlignItems.Start,
                    // @ts-ignore
                    items: items,
                });
                this.setAggregation("_flexBox", flexBox);
            }
            else {
                flexBox.removeAllAggregation("items");
                for (var i = 0; i < items.length; ++i) {
                    flexBox.addItem(items[i]);
                }
            }
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        initSelect: function () {
            var that = this;
            that.select = new sap.esh.search.ui.controls.SearchSelect(that.getId() + "-select", {});
            that.select.attachChange(function () {
                if (that.getAggregation("input")) {
                    var input = /** @type {sap.m.Input} */ (that.getAggregation("input"));
                    input.destroySuggestionRows();
                }
            });
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        initInput: function () {
            var that = this;
            that.input = new sap.esh.search.ui.controls.SearchInput(that.getId() + "-input", {});
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        initButton: function () {
            var that = this;
            that.button = new sap.esh.search.ui.controls.SearchButton(that.getId() + "-button", {
                // @ts-ignore
                tooltip: "{i18n>searchbox_tooltip}",
                // eslint-disable-next-line no-unused-vars
                press: function (event) {
                    // searchterm is empty and datasource==all
                    // do not trigger search instead close search field
                    var model = /** @type {sap.esh.search.ui.SearchModel} */ (that.button.getModel());
                    if (!model.config.odataProvider && model.config.isUshell) {
                        if (that.input.getValue() === "" &&
                            model.getDataSource() === model.getDefaultDataSource()) {
                            return;
                        }
                    }
                    // trigger search
                    model.invalidateQuery();
                    that.input.destroySuggestionRows();
                    that.input.triggerSearch();
                },
            });
            that.setAggregation("_buttonAriaText", new InvisibleText(that.getId() + "-buttonAriaText", {
                text: "{i18n>searchbox_tooltip}",
            }));
            that.button.addAriaLabelledBy(that.getAggregation("_buttonAriaText"));
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        initCancelButton: function () {
            this.cancelButton = new Button("", {
                text: "{i18n>cancelBtn}",
            });
            this.cancelButton.addStyleClass("sapUshellSearchCancelButton");
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFieldGroup
         */
        setModel: function (model) {
            this.select.setModel(model);
            this.input.setModel(model);
            this.button.setModel(model);
            this.cancelButton.setModel(model);
        },
        renderer: function (oRm, oControl) {
            oRm.write("<div");
            oRm.writeControlData(oControl);
            oRm.addClass("SearchFieldGroup");
            oRm.writeClasses();
            oRm.write(">");
            oRm.renderControl(oControl.getAggregation("_flexBox"));
            oRm.renderControl(oControl.getAggregation("_buttonAriaText"));
            oRm.write("</div>");
        },
    });
});
