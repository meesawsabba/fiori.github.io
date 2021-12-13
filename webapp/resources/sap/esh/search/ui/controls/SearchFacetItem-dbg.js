/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "sap/esh/search/ui/SearchHelper",
    "sap/ui/core/CustomData",
    "sap/ui/core/format/NumberFormat",
    "sap/m/ListType",
    "sap/m/StandardListItem",
], function (SearchHelper, CustomData, NumberFormat, ListType, StandardListItem) {
    "use strict";
    return StandardListItem.extend("sap.esh.search.ui.controls.SearchFacetItem", {
        constructor: function (sId, options) {
            var that = this;
            that.options = jQuery.extend({}, {
                type: ListType.Active,
                title: "{label}",
                tooltip: "{label}: {valueLabel}",
                icon: "{icon}",
                info: {
                    parts: [
                        {
                            path: "value",
                        },
                    ],
                    formatter: function (valueLabel) {
                        return typeof valueLabel === "number"
                            ? SearchHelper.formatInteger(valueLabel)
                            : "";
                    },
                },
                selected: "{selected}",
                customData: [
                    new CustomData({
                        key: "test-id-facet-dimension-value",
                        value: {
                            parts: ["facetTitle", "label"],
                            formatter: function (facetAttribute, label) {
                                return facetAttribute + "-" + label;
                            },
                        },
                        writeToDom: true,
                    }),
                ],
            }, options);
            StandardListItem.prototype.constructor.apply(this, [sId, that.options]);
            this.addStyleClass("sapUshellSearchFacetItem");
            this.addEventDelegate({
                onAfterRendering: function () {
                    if (that.getBindingContext() && that.getBindingContext().getObject()) {
                        var level = that.getBindingContext().getObject().level;
                        if (jQuery("html").attr("dir") === "rtl") {
                            jQuery(that.getDomRef())
                                .children(".sapMLIBContent")
                                .css("padding-right", level + "rem");
                        }
                        else {
                            jQuery(that.getDomRef())
                                .children(".sapMLIBContent")
                                .css("padding-left", level + "rem");
                        }
                    }
                },
            });
        },
        renderer: "sap.m.StandardListItemRenderer",
    });
});
