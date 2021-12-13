/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
// @ts-check
(function () {
    "use strict";
    sap.ui.define(["./i18n", "sap/esh/search/ui/SearchModel", "sap/m/MessageBox", "sap/ui/core/TextDirection"], 
    /**
     *
     * @param {*} i18n
     * @param {*} SearchModel
     * @param {*} MessageBox
     * @param {*} TextDirection
     */
    function (i18n, SearchModel, MessageBox, TextDirection) {
        return SearchModel.extend("sap.esh.search.ui.SearchFacetDialogModel", {
            constructor: function (searchModel) {
                var that = this;
                SearchModel.prototype.constructor.apply(that, [
                    {
                        searchModel: searchModel,
                        configuration: searchModel.config,
                    },
                ]);
                that.aFilters = [];
            },
            prepareFacetList: function () {
                var that = this;
                var metaData = that.getDataSource();
                that.setProperty("/facetDialog", that.oFacetFormatter.getDialogFacetsFromMetaData(metaData, that));
            },
            // properties: sAttribute, sBindingPath
            facetDialogSingleCall: function (properties) {
                var that = this;
                that.chartQuery.dimension = properties.sAttribute;
                that.chartQuery.top = properties.sAttributeLimit;
                return that.chartQuery.getResultSetAsync().then(function (resultSet) {
                    var oFacet = that.oFacetFormatter.getDialogFacetsFromChartQuery(resultSet, that, properties.bInitialFilters);
                    var oFacet2 = jQuery.extend(true, {}, oFacet);
                    oFacet.items4pie = oFacet2.items;
                    var amountInPie = 0, amountNotInPie = 0, percentageMissingInPie = 0, averageSliceValue = 0;
                    for (var i = 0; i < oFacet.items4pie.length; i++) {
                        if (i < 9) {
                            oFacet.items4pie[i].pieReady = true;
                            if (oFacet.items4pie[i].value > 0) {
                                amountInPie += oFacet.items4pie[i].value;
                            }
                        }
                        else {
                            oFacet.items4pie[i].pieReady = false;
                            if (oFacet.items4pie[i].value > 0) {
                                amountNotInPie += oFacet.items4pie[i].value;
                            }
                        }
                    }
                    percentageMissingInPie = (amountNotInPie * 100) / (amountInPie + amountNotInPie);
                    percentageMissingInPie = Math.ceil(percentageMissingInPie);
                    averageSliceValue = amountInPie / 9;
                    averageSliceValue = Math.floor(averageSliceValue);
                    if (percentageMissingInPie > 0) {
                        var newItem = oFacet.items4pie[0].clone([true, true]);
                        newItem.value = averageSliceValue;
                        newItem.label = i18n.getText("facetPieChartOverflowText2", [
                            percentageMissingInPie.toString(),
                            "9",
                        ]);
                        newItem.pieReady = true;
                        newItem.valueLabel = "" + averageSliceValue;
                        newItem.isPieChartDummy = true;
                        oFacet.items4pie.push(newItem);
                    }
                    for (var j = 0; j < oFacet.items4pie.length; j++) {
                        oFacet.items4pie[j].percentageMissingInBigPie = percentageMissingInPie;
                    }
                    that.setProperty(properties.sBindingPath + "/items4pie", oFacet.items4pie);
                    that.setProperty(properties.sBindingPath + "/items", oFacet.items);
                }, function (error) {
                    var errorTitle = i18n.getText("searchError");
                    var errorText = error.message;
                    MessageBox.error(errorText, {
                        icon: MessageBox.Icon.NONE,
                        title: errorTitle,
                        actions: MessageBox.Action.OK,
                        onClose: null,
                        styleClass: "",
                        initialFocus: null,
                        textDirection: TextDirection.Inherit,
                    });
                });
            },
            resetChartQueryFilterConditions: function () {
                var that = this;
                if (that.chartQuery) {
                    that.chartQuery.resetConditions();
                }
            },
            hasFilterCondition: function (filterCondition) {
                var that = this;
                for (var i = 0; i < that.aFilters.length; i++) {
                    if (that.aFilters[i].filterCondition.equals &&
                        that.aFilters[i].filterCondition.equals(filterCondition)) {
                        return true;
                    }
                }
                return false;
            },
            hasFilter: function (item) {
                var that = this;
                var filterCondition = item.filterCondition;
                return that.hasFilterCondition(filterCondition);
            },
            addFilter: function (item) {
                var that = this;
                if (!that.hasFilter(item)) {
                    that.aFilters.push(item);
                }
            },
            removeFilter: function (item) {
                var that = this;
                var filterCondition = item.filterCondition;
                for (var i = 0; i < that.aFilters.length; i++) {
                    if (that.aFilters[i].filterCondition.equals &&
                        that.aFilters[i].filterCondition.equals(filterCondition)) {
                        that.aFilters.splice(i, 1);
                        return;
                    }
                }
            },
            changeFilterAdvaced: function (item, bAdvanced) {
                var that = this;
                var filterCondition = item.filterCondition;
                for (var i = 0; i < that.aFilters.length; i++) {
                    if (that.aFilters[i].filterCondition.equals &&
                        that.aFilters[i].filterCondition.equals(filterCondition)) {
                        that.aFilters[i].advanced = bAdvanced;
                        return;
                    }
                }
            },
            addFilterCondition: function (filterCondition) {
                this.chartQuery.filter.autoInsertCondition(filterCondition);
            },
            // determinate the attribute list data type
            getAttributeDataType: function (facet) {
                switch (facet.dataType) {
                    case "Integer":
                        return "integer";
                    case "Double":
                        return "number";
                    case "Timestamp":
                        return "timestamp";
                    case "Date":
                        return "date";
                    case "String":
                        if (facet.matchingStrategy === this.sinaNext.MatchingStrategy.Text) {
                            return "text";
                        }
                        return "string";
                    default:
                        return "string";
                }
            },
        });
    });
    // @ts-ignore
})(window);
