/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
sap.ui.define([
    "../i18n",
    "sap/m/Text",
    "sap/m/Toolbar",
    "sap/m/ToolbarSpacer",
    "sap/m/ToolbarDesign",
    "sap/ui/core/Icon",
], 
/**
 * @param {*} i18n
 * @param {*} Text
 * @param {sap.m.Toolbar} Toolbar
 * @param {*} ToolbarSpacer
 * @param {*} ToolbarDesign
 * @param {*} Icon
 */
function (i18n, Text, Toolbar, ToolbarSpacer, ToolbarDesign, Icon) {
    "use strict";
    return sap.m.Toolbar.extend("sap.esh.search.ui.controls.SearchFilterBar", {
        /**
         * @this sap.esh.search.ui.controls.SearchFilterBar
         */
        constructor: function (options) {
            var that = this;
            // blue bar
            options = jQuery.extend({}, {
                design: ToolbarDesign.Info,
            }, options);
            sap.m.Toolbar.prototype.constructor.apply(that, [options]);
            that.addStyleClass("sapUshellSearchFilterContextualBar");
            // bind file formatter
            that.filterFormatter = that.filterFormatter.bind(that);
            // filter text string
            that.filterText = new Text("", {
                text: {
                    parts: ["/uiFilter/rootCondition", "/facets"],
                    formatter: that.filterFormatter,
                },
                tooltip: {
                    parts: ["/uiFilter/rootCondition", "/facets"],
                    formatter: that.filterFormatter,
                },
            }).addStyleClass("sapUshellSearchFilterText");
            that.filterText.setMaxLines(1);
            that.filterText.clampText();
            that.addContent(that.filterText);
            // filter middle space
            that.addContent(new ToolbarSpacer());
            // filter reset button
            that.resetButton = new Icon("", {
                src: "sap-icon://clear-filter",
                tooltip: i18n.getText("resetFilterButton_tooltip"),
            }).addStyleClass("sapUshellSearchFilterResetButton");
            that.addContent(that.resetButton);
        },
        filterFormatter: function (rootCondition, facets) {
            if (!rootCondition || !rootCondition.hasFilters()) {
                return "";
            }
            // sort filter values, use same order as in facets
            rootCondition = this.sortConditions(rootCondition, facets);
            // collect all filter values
            var attributeLabels = [];
            for (var i = 0; i < rootCondition.conditions.length; ++i) {
                var complexCondition = rootCondition.conditions[i];
                var labels = [];
                for (var j = 0; j < complexCondition.conditions.length; ++j) {
                    var filterCondition = complexCondition.conditions[j];
                    if (j === 0) {
                        labels.push(filterCondition.attributeLabel, " (");
                    }
                    else {
                        labels.push(", ");
                    }
                    labels.push(this._formatLabel(filterCondition.valueLabel || filterCondition.value, filterCondition.operator));
                }
                labels.push(")");
                attributeLabels.push(labels.join(""));
            }
            return i18n.getText("filtered_by", [attributeLabels.join(", ")]);
        },
        /**
         * @this sap.esh.search.ui.controls.SearchFilterBar
         */
        _formatLabel: function (label, operator) {
            var labelFormatted;
            switch (operator) {
                case this.getModel().sinaNext.ComparisonOperator.Bw: // "Bw"
                    labelFormatted = label + "*";
                    break;
                case this.getModel().sinaNext.ComparisonOperator.Ew: // "Ew"
                    labelFormatted = "*" + label;
                    break;
                case this.getModel().sinaNext.ComparisonOperator.Co: // "Co"
                    labelFormatted = "*" + label + "*";
                    break;
                default:
                    labelFormatted = label;
                    break;
            }
            return labelFormatted;
        },
        sortConditions: function (rootCondition, facets) {
            // cannot sort without facets
            if (facets.length === 0) {
                return rootCondition;
            }
            // helper: get attribute from a complex condition
            var getAttribute = function (complexCondition) {
                var firstFilter = complexCondition.conditions[0];
                if (firstFilter.attribute) {
                    return firstFilter.attribute;
                }
                return firstFilter.conditions[0].attribute;
            };
            // helper get list index
            var getIndex = function (list, attribute, value) {
                for (var i = 0; i < list.length; ++i) {
                    var element = list[i];
                    if (element[attribute] === value) {
                        return i;
                    }
                }
            };
            // clone: we don't want to modify the original filter
            rootCondition = rootCondition.clone();
            // 1) sort complexConditons (each complexCondition holds the filters for a certain attribute)
            rootCondition.conditions.sort(function (complexCondition1, complexCondition2) {
                var attribute1 = getAttribute(complexCondition1);
                var index1 = getIndex(facets, "dimension", attribute1);
                var attribute2 = getAttribute(complexCondition2);
                var index2 = getIndex(facets, "dimension", attribute2);
                return index1 - index2;
            });
            // 2) sort filters within a complexConditon
            var sortValues = function (complexCondition) {
                var attribute = getAttribute(complexCondition);
                var index = getIndex(facets, "dimension", attribute);
                if (!index) {
                    return;
                }
                var facet = facets[index];
                if (facet.facetType === "hierarchy") {
                    return; // no sort for hierarchy
                }
                var valueSortFunction = function (filter1, filter2) {
                    return (getIndex(facet.items, "label", filter1.valueLabel) -
                        getIndex(facet.items, "label", filter2.valueLabel));
                };
                complexCondition.conditions.sort(valueSortFunction);
            };
            for (var i = 0; i < rootCondition.conditions.length; ++i) {
                var complexCondition = rootCondition.conditions[i];
                sortValues(complexCondition);
            }
            return rootCondition;
        },
        renderer: "sap.m.ToolbarRenderer",
        /**
         * @this sap.esh.search.ui.controls.SearchFilterBar
         */
        onAfterRendering: function () {
            var that = this;
            // don't have model until after rendering
            // attach press action
            that.resetButton.attachPress(function () {
                var model = that.getModel();
                model.eventLogger.logEvent({
                    type: model.eventLogger.CLEAR_ALL_FILTERS,
                });
                model.resetFilterConditions(true);
            });
            // add aria label
            var $filterText = jQuery(".sapUshellSearchFilterText");
            $filterText.attr("aria-label", i18n.getText("filtered_by_aria_label"));
        },
    });
});
