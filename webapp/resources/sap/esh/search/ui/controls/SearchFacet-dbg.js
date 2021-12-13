/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "../i18n",
    "sap/esh/search/ui/controls/SearchFacetItem",
    "sap/m/List",
    "sap/m/ListMode",
    "sap/m/ListSeparators",
], 
/**
 *
 * @param {*} i18n
 * @param {*} SearchFacetItem
 * @param {*} List
 * @param {*} ListMode
 * @param {*} ListSeparators
 */
function (i18n, SearchFacetItem, List, ListMode, ListSeparators) {
    "use strict";
    return List.extend("sap.esh.search.ui.controls.SearchFacet", {
        metadata: {
            properties: {
                eshRole: {
                    type: "string",
                    defaultValue: "datasource", // "datasource" or "attribute"
                },
            },
        },
        init: function () {
            // define group for F6 handling
            this.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
        },
        constructor: function (sId, options) {
            options = jQuery.extend({}, {
                mode: ListMode.SingleSelectMaster,
                showSeparators: ListSeparators.None,
                includeItemInSelection: true,
                /**
                 * @this sap.esh.search.ui.controls.SearchFacet
                 */
                selectionChange: function (oEvent) {
                    if (this.getEshRole() === "attribute") {
                        // @ts-ignore
                        this.handleItemPress(oEvent);
                    }
                },
                /**
                 * @this sap.esh.search.ui.controls.SearchFacet
                 */
                itemPress: function (oEvent) {
                    if (this.getModel().config.searchScopeWithoutAll) {
                        return;
                    }
                    if (this.getEshRole() === "datasource") {
                        // @ts-ignore
                        this.handleItemPress(oEvent);
                    }
                },
            }, options);
            List.prototype.constructor.apply(this, [sId, options]);
            this.addStyleClass("sapUshellSearchFacet");
        },
        handleItemPress: function (event) {
            var listItem = event.mParameters.listItem;
            var oSelectedItem = listItem.getBindingContext().getObject();
            var model = this.getModel();
            var filterCondition = oSelectedItem.filterCondition;
            if (listItem.getSelected()) {
                // DWC exit for handling SearchIn facets
                if (typeof model.config.cleanUpSpaceFilters === "function") {
                    model.config.cleanUpSpaceFilters(model, filterCondition);
                }
                model.addFilterCondition(filterCondition);
                model.eventLogger.logEvent({
                    type: model.eventLogger.FACET_FILTER_ADD,
                    referencedAttribute: oSelectedItem.facetAttribute,
                    clickedValue: oSelectedItem.value,
                    clickedPosition: listItem.getList().getItems().indexOf(listItem),
                });
            }
            else {
                model.removeFilterCondition(oSelectedItem.filterCondition);
                model.eventLogger.logEvent({
                    type: model.eventLogger.FACET_FILTER_DEL,
                    referencedAttribute: oSelectedItem.facetAttribute,
                    clickedValue: oSelectedItem.value,
                    clickedPosition: listItem.getList().getItems().indexOf(listItem),
                });
            }
        },
        renderer: "sap.m.ListRenderer",
        onAfterRendering: function () {
            var infoZeile = jQuery(this.getDomRef())
                .closest(".sapUshellSearchFacetIconTabBar")
                .find(".sapUshellSearchFacetInfoZeile")[0];
            if (infoZeile) {
                var oInfoZeile = sap.ui.getCore().byId(infoZeile.id);
                // @ts-ignore
                oInfoZeile.setVisible(false);
            }
            var model = this.getModel();
            if (typeof model.config.setQuickSelectDataSourceAllAppearsNotSelected === "function") {
                model.config.setQuickSelectDataSourceAllAppearsNotSelected(this, model);
            }
        },
        setEshRole: function (role) {
            var items = {
                path: "items",
                template: new SearchFacetItem(),
            };
            switch (role.toLowerCase()) {
                case "attribute":
                    var listMode;
                    if (this.getModel().config &&
                        typeof this.getModel().config.getSearchInFacetListMode === "function") {
                        var currentItemData = this.getModel().getProperty(this.getBindingContext().getPath());
                        listMode = this.getModel().config.getSearchInFacetListMode(currentItemData);
                    }
                    this.setMode(listMode || ListMode.MultiSelect);
                    this.setHeaderText("");
                    break;
                default:
                    // case "datasource": // is default case anyway
                    this.setMode(ListMode.SingleSelectMaster);
                    this.setHeaderText(i18n.getText("searchIn"));
                    break;
            }
            this.bindAggregation("items", items);
            this.setProperty("eshRole", role); // this validates and stores the new value
            return this; // return "this" to allow method chaining
        },
        setModel: function () {
            return List.prototype.setModel.apply(this, arguments);
        },
    });
});
