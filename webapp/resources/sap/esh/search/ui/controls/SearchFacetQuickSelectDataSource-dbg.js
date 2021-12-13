/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "sap/m/List",
    "sap/m/StandardListItem",
    "sap/m/ListSeparators",
    "sap/m/ListMode",
    "sap/m/ListType",
    "sap/ui/core/CustomData",
    "sap/esh/search/ui/SearchHelper",
], function (List, StandardListItem, ListSeparators, ListMode, ListType, CustomData // SearchHelper
) {
    "use strict";
    return List.extend("sap.esh.search.ui.controls.SearchFacetQuickSelectDataSource", {
        constructor: function (id, settings) {
            if (typeof id === "object") {
                settings = id;
                id = undefined;
            }
            jQuery.extend(settings, {
                showSeparators: ListSeparators.None,
                mode: ListMode.SingleSelectMaster,
                itemPress: function (event) {
                    var itemControl = event.getParameter("srcControl");
                    var item = itemControl.getBindingContext().getObject();
                    var model = itemControl.getModel();
                    // reset search term (even if selected item gets pressed again)
                    if (model.config.bResetSearchTermOnQuickSelectDataSourceItemPress) {
                        model.setSearchBoxTerm("", false);
                    }
                    // DWC exit for handling SearchIn facets
                    if (typeof model.config.cleanUpSpaceFilters === "function") {
                        model.config.cleanUpSpaceFilters(model);
                    }
                    model.setDataSource(item.dataSource);
                },
                items: {
                    path: "items",
                    template: new StandardListItem({
                        type: ListType.Active,
                        title: "{dataSource/label}",
                        tooltip: "{dataSource/label}",
                        icon: "{dataSource/icon}",
                        customData: [
                            new CustomData({
                                key: "test-id-collection",
                                value: "{dataSource/label}",
                                writeToDom: true,
                            }),
                        ],
                        selected: {
                            parts: ["/queryFilter", "dataSource"],
                            formatter: function (queryFilter, dataSource) {
                                return queryFilter.dataSource === dataSource;
                            },
                        },
                    }),
                },
            });
            return List.prototype.constructor.apply(this, [id, settings]);
        },
        init: function () {
            this.addStyleClass("sapUshellSearchFacet");
        },
        renderer: "sap.m.ListRenderer",
    });
});
