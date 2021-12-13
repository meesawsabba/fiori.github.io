/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProviderHelper = void 0;
    var ProviderHelper = /** @class */ (function () {
        function ProviderHelper(provider) {
            this.provider = provider;
            this.sina = provider.sina;
        }
        ProviderHelper.prototype.calculateMultiDataSourceLabel = function (label, provider) {
            if (provider.label) {
                var identify = provider.label || provider.id;
                return label + " - " + identify;
            }
            return label;
        };
        ProviderHelper.prototype.calculateMultiDataSourceId = function (id, identify) {
            return identify + "_" + id;
        };
        ProviderHelper.prototype.updateProviderId = function (childSina) {
            var i = 0;
            for (;;) {
                if (i !== 0) {
                    childSina.provider.id = childSina.provider.id + "_" + i;
                }
                var duplicateSina = this.findSinaById(childSina.provider.id);
                if (duplicateSina) {
                    i++;
                    continue;
                }
                else {
                    break;
                }
            }
        };
        //input: multiDataSource id, dataSource with child provider, output: dataSource with multi provider
        ProviderHelper.prototype.createMultiDataSource = function (id, dataSource) {
            return this.sina._createDataSource({
                id: id,
                label: this.calculateMultiDataSourceLabel(dataSource.label, dataSource.sina.provider),
                labelPlural: this.calculateMultiDataSourceLabel(dataSource.labelPlural, dataSource.sina.provider),
                type: dataSource.type,
                hidden: dataSource.hidden,
                attributesMetadata: dataSource.attributesMetadata,
            });
        };
        ProviderHelper.prototype.findSinaById = function (providerId) {
            for (var i = 0; i < this.provider.multiSina.length; i++) {
                var childSina = this.provider.multiSina[i];
                if (providerId === childSina.provider.id) {
                    return childSina;
                }
            }
            return undefined;
        };
        ProviderHelper.prototype.updateAttributesMetadata = function (dataSourceWithMetadata, dataSource) {
            dataSource.attributesMetadata = dataSourceWithMetadata.attributesMetadata;
            dataSource.attributeMetadataMap = dataSourceWithMetadata.attributeMetadataMap;
        };
        ProviderHelper.prototype.updateSuggestionDataSource = function (results) {
            for (var i = 0; i < results.items.length; i++) {
                var item = results.items[i];
                if (item.childSuggestions) {
                    for (var j = 0; j < item.childSuggestions.length; j++) {
                        var childSuggestion = item.childSuggestions[j];
                        var dataSourceId = this.calculateMultiDataSourceId(childSuggestion.dataSource.id, childSuggestion.sina.provider.id);
                        childSuggestion.dataSource = this.sina.dataSourceMap[dataSourceId];
                        childSuggestion.filter.dataSource = this.sina.dataSourceMap[dataSourceId];
                    }
                }
                //update dataSource for dataSource suggestion type
                if (item.dataSource) {
                    item.label = this.calculateMultiDataSourceLabel(item.label, item.sina.provider);
                    var multiDataSourceId = this.calculateMultiDataSourceId(item.dataSource.id, item.sina.provider.id);
                    // const multiDataSource = this.createMultiDataSource(multiDataSourceId, item.dataSource);
                    var multiDataSource = this.sina.dataSourceMap[multiDataSourceId];
                    item.dataSource = multiDataSource;
                    item.sina = this.sina;
                }
            }
            return results;
        };
        ProviderHelper.prototype.createMultiChartResultSet = function (chartResultSet) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            var multiChartResultSet = that.sina._createChartResultSet({
                id: chartResultSet.id,
                items: [],
                query: chartResultSet.query,
                title: chartResultSet.title,
            });
            for (var i = 0; i < chartResultSet.items.length; i++) {
                var childChartResultSetItem = chartResultSet.items[i];
                var childFilterCondition = that.sina.parseConditionFromJson(childChartResultSetItem.filterCondition.toJson());
                multiChartResultSet.items.push(that.sina._createChartResultSetItem({
                    filterCondition: childFilterCondition,
                    dimensionValueFormatted: childChartResultSetItem.dimensionValueFormatted,
                    measureValue: childChartResultSetItem.measureValue,
                    measureValueFormatted: childChartResultSetItem.measureValueFormatted,
                }));
            }
            return multiChartResultSet;
        };
        ProviderHelper.prototype.updateDataSourceFacets = function (resultSetFacets) {
            for (var j = 0; j < resultSetFacets[0].items.length; j++) {
                var facetItem = resultSetFacets[0].items[j];
                if (facetItem.dataSource) {
                    var facetItemMultiId = this.calculateMultiDataSourceId(facetItem.dataSource.id, facetItem.sina.provider.id);
                    //new Category, should be insert to multi provider
                    if (!this.provider.multiDataSourceMap[facetItemMultiId]) {
                        this.createMultiDataSource(facetItemMultiId, facetItem.dataSource);
                        this.provider.multiDataSourceMap[facetItemMultiId] = facetItem.dataSource;
                    }
                    //set the facet result item dataSource as multi provider dataSource
                    facetItem.dataSource = this.sina.dataSourceMap[facetItemMultiId];
                }
            }
            return resultSetFacets;
        };
        // update rootCondition sina as childSina
        ProviderHelper.prototype.updateRootCondition = function (rootCondition, childSina) {
            rootCondition.sina = childSina;
            if (rootCondition.conditions && rootCondition.conditions.length > 0) {
                for (var i = 0; i < rootCondition.conditions.length; i++) {
                    this.updateRootCondition(rootCondition.conditions[i], childSina);
                }
            }
        };
        return ProviderHelper;
    }());
    exports.ProviderHelper = ProviderHelper;
});
})();