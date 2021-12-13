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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
sap.ui.define(["require", "exports", "../../sina/SearchQuery", "./typeConverter", "../../sina/LogicalOperator", "../../sina/ComparisonOperator", "../../core/Log", "../../core/errors", "./HierarchyParser"], function (require, exports, SearchQuery_1, typeConverter, LogicalOperator_1, ComparisonOperator_1, Log_1, errors_1, HierarchyParser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.FacetParser = void 0;
    var FacetParser = /** @class */ (function () {
        function FacetParser(provider) {
            this.provider = provider;
            this.sina = provider.sina;
            this.log = new Log_1.Log("hana_odata facet parser");
        }
        FacetParser.prototype.parse = function (query, data) {
            return __awaiter(this, void 0, void 0, function () {
                var hierarchyParser, value, facets, i, facetData, resultSet, attributeMetadata, itemsInString;
                return __generator(this, function (_a) {
                    hierarchyParser = new HierarchyParser_1.HierarchyParser();
                    value = data["@com.sap.vocabularies.Search.v1.Facets"];
                    if (data.error && !value) {
                        return [2 /*return*/, Promise.reject(new errors_1.InternalServerError(data.error.message))];
                    }
                    if (!value) {
                        return [2 /*return*/, Promise.resolve([])];
                    }
                    if (data.error) {
                        this.log.warn("Server-side Warning: " + data.error.message);
                    }
                    facets = [];
                    for (i = 0; i < value.length; i++) {
                        facetData = value[i];
                        resultSet = void 0;
                        if (query.filter.dataSource === query.sina.getAllDataSource()) {
                            try {
                                resultSet = this.parseDataSourceFacet(query, facetData);
                            }
                            catch (e1) {
                                this.log.warn("Error occurred by parsing dataource item number " + i + ": " + e1.message);
                                continue;
                            }
                        }
                        else {
                            if (query.filter.dataSource.type === query.sina.DataSourceType.Category) {
                                continue; // ignore common attributes facets
                            }
                            if (facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyType ===
                                "GeometryPolygonFacet") {
                                continue;
                            }
                            try {
                                attributeMetadata = this.parseFacetAttribute(query, facetData);
                                if (attributeMetadata.isHierarchy) {
                                    resultSet = hierarchyParser.parseHierarchyFacet(query, attributeMetadata, facetData);
                                }
                                else {
                                    resultSet = this.parseChartFacet(query, attributeMetadata, facetData);
                                }
                            }
                            catch (e1) {
                                itemsInString = "";
                                if (facetData.Items && Array.isArray(facetData.Items)) {
                                    itemsInString = JSON.stringify(facetData);
                                }
                                this.log.warn("Error occurred by parsing facet " +
                                    (facetData["@com.sap.vocabularies.Common.v1.Label"] || "") +
                                    "', facet position: " +
                                    i +
                                    ": " +
                                    e1.message +
                                    "; item data: " +
                                    itemsInString);
                                continue;
                            }
                        }
                        facets.push(resultSet);
                    }
                    return [2 /*return*/, Promise.all(facets)];
                });
            });
        };
        FacetParser.prototype.parseDataSourceFacet = function (query, facetData) {
            // for search query with datasource facet: create corresponding datasource query
            var dataSourceQuery = query;
            if (query instanceof SearchQuery_1.SearchQuery) {
                dataSourceQuery = this.sina.createDataSourceQuery({
                    dataSource: query.filter.dataSource,
                    filter: query.filter.clone(),
                });
            }
            // assemble results set items
            var items = [];
            for (var i = 0; i < facetData.Items.length; i++) {
                var cell = facetData.Items[i];
                // create filter (used when clicking on the item)
                var dataSource = this.sina.getDataSource(cell.scope);
                if (!dataSource) {
                    dataSource = this.sina.createDataSource({
                        type: this.sina.DataSourceType.Category,
                        id: cell.ValueLow,
                        label: cell.Description,
                    });
                }
                // create item
                items.push(this.sina._createDataSourceResultSetItem({
                    dataSource: dataSource,
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: cell._Count,
                    measureValueFormatted: cell._Count.toString(),
                }));
            }
            // create result set
            var resultSet = this.sina._createDataSourceResultSet({
                title: query.filter.dataSource.label,
                items: items,
                query: dataSourceQuery,
            });
            // init query with result set
            if (query instanceof SearchQuery_1.SearchQuery) {
                return dataSourceQuery._setResultSet(resultSet);
            }
            return resultSet;
        };
        FacetParser.prototype.createAttributeFilterCondition = function (attributeId, metadata, cell) {
            if (typeof cell[attributeId] === "object" &&
                (Object.prototype.hasOwnProperty.call(cell[attributeId], "From") ||
                    Object.prototype.hasOwnProperty.call(cell[attributeId], "From"))) {
                // Range Condition
                var finalCondition = this.sina.createComplexCondition({
                    attributeLabel: metadata.label,
                    valueLabel: this.formatFacetValue(cell[attributeId]),
                    operator: LogicalOperator_1.LogicalOperator.And,
                    conditions: [],
                });
                var lowBoundCondition = void 0, upperBoundCondition = void 0;
                if (!cell[attributeId].From) {
                    upperBoundCondition = this.sina.createSimpleCondition({
                        attribute: attributeId,
                        operator: ComparisonOperator_1.ComparisonOperator.Le,
                        value: typeConverter.odata2Sina(metadata.type, cell[attributeId].To),
                    });
                    finalCondition.conditions.push(upperBoundCondition);
                }
                else if (!cell[attributeId].To) {
                    lowBoundCondition = this.sina.createSimpleCondition({
                        attribute: attributeId,
                        operator: ComparisonOperator_1.ComparisonOperator.Ge,
                        value: typeConverter.odata2Sina(metadata.type, cell[attributeId].From),
                    });
                    finalCondition.conditions.push(lowBoundCondition);
                }
                else {
                    lowBoundCondition = this.sina.createSimpleCondition({
                        attribute: attributeId,
                        operator: ComparisonOperator_1.ComparisonOperator.Ge,
                        value: typeConverter.odata2Sina(metadata.type, cell[attributeId].From),
                    });
                    finalCondition.conditions.push(lowBoundCondition);
                    upperBoundCondition = this.sina.createSimpleCondition({
                        attribute: attributeId,
                        operator: ComparisonOperator_1.ComparisonOperator.Le,
                        value: typeConverter.odata2Sina(metadata.type, cell[attributeId].To),
                    });
                    finalCondition.conditions.push(upperBoundCondition);
                }
                return finalCondition;
            }
            // Single Condition
            return this.sina.createSimpleCondition({
                attributeLabel: metadata.label,
                attribute: attributeId,
                value: cell[attributeId],
                valueLabel: typeConverter.odata2Sina(metadata.type, cell[attributeId]),
            });
        };
        FacetParser.prototype.formatFacetValue = function (value /**metadata*/) {
            var initialValue = "";
            // if (metadata.type === 'Double' || metadata.type === 'Integer') {
            //     initialValue = 0;
            // }
            if (value["@com.sap.vocabularies.Common.v1.Label"]) {
                return value["@com.sap.vocabularies.Common.v1.Label"];
            }
            if (typeof value === "object" &&
                (Object.prototype.hasOwnProperty.call(value, "From") ||
                    Object.prototype.hasOwnProperty.call(value, "To"))) {
                value = (value.From || initialValue) + "..." + (value.To || initialValue);
            }
            return value;
        };
        FacetParser.prototype.parseFacetAttribute = function (query, facetData) {
            var dataSource = query.filter.dataSource;
            var attributeId = "";
            if (query.dimension) {
                attributeId = query.dimension;
            }
            else {
                if (facetData["@com.sap.vocabularies.Search.v1.Facet"] &&
                    facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions &&
                    facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0] &&
                    facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyName) {
                    attributeId = facetData["@com.sap.vocabularies.Search.v1.Facet"].Dimensions[0].PropertyName;
                }
                else {
                    throw new errors_1.FacetsParseError("parse error facets");
                }
            }
            var metadata = dataSource.getAttributeMetadata(attributeId);
            return metadata;
        };
        FacetParser.prototype.parseChartFacet = function (query, attributeMetadata, facetData) {
            var dataSource = query.filter.dataSource;
            var items = [];
            // for search query with attribute facet: create corresponding chart query
            var chartQuery = query;
            var filter = query.filter.clone();
            filter.setDataSource(dataSource); // relevant only for common attribute facets
            filter.setRootCondition(query.filter.rootCondition.clone()); // changing ds removes condition
            chartQuery = this.sina.createChartQuery({
                filter: filter,
                dimension: attributeMetadata.id,
            });
            // create result set items
            for (var i = 0; i < facetData.Items.length; i++) {
                var cell = facetData.Items[i];
                items.push(this.sina._createChartResultSetItem({
                    filterCondition: this.createAttributeFilterCondition(attributeMetadata.id, attributeMetadata, cell),
                    dimensionValueFormatted: this.formatFacetValue(cell[attributeMetadata.id]),
                    measureValue: cell._Count,
                    measureValueFormatted: cell._Count,
                    icon: cell[attributeMetadata.id + "@com.sap.vocabularies.Common.v1.Text"],
                }));
            }
            // create result set
            var resultSet = this.sina._createChartResultSet({
                title: attributeMetadata.label,
                items: items,
                query: chartQuery,
            });
            // init query with result set
            if (query instanceof SearchQuery_1.SearchQuery) {
                return chartQuery._setResultSet(resultSet);
            }
            return resultSet;
        };
        return FacetParser;
    }());
    exports.FacetParser = FacetParser;
});
})();