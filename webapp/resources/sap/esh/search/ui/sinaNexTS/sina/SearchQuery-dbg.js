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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
sap.ui.define(["require", "exports", "../core/core", "./Query", "./EqualsMode", "./ConditionType", "./DataSourceType", "../core/errors"], function (require, exports, core, Query_1, EqualsMode_1, ConditionType_1, DataSourceType_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SearchQuery = void 0;
    var SearchQuery = /** @class */ (function (_super) {
        __extends(SearchQuery, _super);
        function SearchQuery(properties) {
            var _a, _b, _c, _d, _e;
            var _this = _super.call(this, properties) || this;
            _this.calculateFacets = false;
            _this.multiSelectFacets = false;
            _this.nlq = false;
            _this.facetTop = 5;
            _this.calculateFacets = (_a = properties.calculateFacets) !== null && _a !== void 0 ? _a : _this.calculateFacets;
            _this.multiSelectFacets = (_b = properties.multiSelectFacets) !== null && _b !== void 0 ? _b : _this.multiSelectFacets;
            _this.nlq = (_c = properties.nlq) !== null && _c !== void 0 ? _c : _this.nlq;
            _this.facetTop = (_d = properties.facetTop) !== null && _d !== void 0 ? _d : _this.facetTop;
            _this.groupBy = (_e = properties.groupBy) !== null && _e !== void 0 ? _e : _this.groupBy;
            return _this;
        }
        SearchQuery.prototype.setCalculateFacets = function (calculateFacets) {
            if (calculateFacets === void 0) { calculateFacets = false; }
            this.calculateFacets = calculateFacets;
        };
        SearchQuery.prototype.setMultiSelectFacets = function (multiSelectFacets) {
            if (multiSelectFacets === void 0) { multiSelectFacets = false; }
            this.multiSelectFacets = multiSelectFacets;
        };
        SearchQuery.prototype.setNlq = function (nlq) {
            if (nlq === void 0) { nlq = false; }
            this.nlq = nlq;
        };
        SearchQuery.prototype.setFacetTop = function (facetTop) {
            if (facetTop === void 0) { facetTop = 5; }
            this.facetTop = facetTop;
        };
        SearchQuery.prototype._createReadOnlyClone = function () {
            var query = this.clone();
            query.getResultSetAsync = function () {
                throw new errors_1.QueryIsReadOnlyError("this query is readonly");
            };
            return query;
        };
        SearchQuery.prototype.clone = function () {
            var clone = new SearchQuery({
                skip: this.skip,
                top: this.top,
                filter: this.filter.clone(),
                sortOrder: this.sortOrder,
                sina: this.sina,
                groupBy: this.groupBy,
                calculateFacets: this.calculateFacets,
                multiSelectFacets: this.multiSelectFacets,
                nlq: this.nlq,
                facetTop: this.facetTop,
            });
            return clone;
        };
        SearchQuery.prototype.equals = function (other, mode) {
            if (mode === void 0) { mode = EqualsMode_1.EqualsMode.CheckFireQuery; }
            if (!(other instanceof SearchQuery)) {
                return false;
            }
            if (!other) {
                return false;
            }
            if (!_super.prototype.equals.call(this, other)) {
                return false;
            }
            if (this.groupBy !== other.groupBy) {
                return false;
            }
            // check nlq
            if (this.nlq !== other.nlq) {
                return false;
            }
            // check multiSelectFacets
            if (this.multiSelectFacets !== other.multiSelectFacets) {
                return false;
            }
            // check facetTop
            if (this.facetTop !== other.facetTop) {
                return false;
            }
            // special check for calculate Facets
            switch (mode) {
                case EqualsMode_1.EqualsMode.CheckFireQuery:
                    if (other.calculateFacets && !this.calculateFacets) {
                        // if old query (other) was with facets and new is without
                        // -> we do not need to fire new query -> return true
                        return true;
                    }
                    return this.calculateFacets === other.calculateFacets;
                default:
                    return this.calculateFacets === other.calculateFacets;
            }
        };
        SearchQuery.prototype._execute = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var filterAttributes, chartQueries, requests, delayedCharQueries, i, chartQuery, dataSourceMetadata, results, delayedChartQueryRequests, j, delayedCharQuery, dataSourceMetadata, delayedCharQueryResults, searchResult, chartResultSets;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            chartQueries = [];
                            // multi select facets: assemble chart queries for all facets with set filters
                            // (The main search request typically does not inlcude facets if a filter is set for a facet,
                            //  because the facet then is trivial. For multi select we need to display also facets with set
                            // filters therefore a special chart query is assembled)
                            if (this.multiSelectFacets) {
                                // collect attribute for which filters are set
                                filterAttributes = this._collectAttributesWithFilter(query);
                                // create chart queries for filterAttribute
                                chartQueries = this._createChartQueries(query, filterAttributes);
                            }
                            requests = [];
                            delayedCharQueries = [];
                            requests.push(this._doExecuteSearchQuery(query));
                            for (i = 0; i < chartQueries.length; ++i) {
                                chartQuery = chartQueries[i];
                                dataSourceMetadata = query.filter.dataSource.getAttributeMetadata(chartQuery.dimension);
                                if (!dataSourceMetadata) {
                                    // in case of inav2 the metadata ist loaded by the main search call
                                    // ->
                                    // collect chartQueries for which we have no metadata
                                    // in order to execute them after the main search call returned
                                    delayedCharQueries.push(chartQuery);
                                }
                                else {
                                    if (dataSourceMetadata.usage.Facet) {
                                        requests.push(chartQuery.getResultSetAsync());
                                    }
                                }
                            }
                            return [4 /*yield*/, Promise.all(requests)];
                        case 1:
                            results = _a.sent();
                            delayedChartQueryRequests = [];
                            for (j = 0; j < delayedCharQueries.length; ++j) {
                                delayedCharQuery = delayedCharQueries[j];
                                dataSourceMetadata = query.filter.dataSource.getAttributeMetadata(delayedCharQuery.dimension);
                                if (dataSourceMetadata.usage.Facet) {
                                    delayedChartQueryRequests.push(delayedCharQuery.getResultSetAsync());
                                }
                            }
                            return [4 /*yield*/, Promise.all(delayedChartQueryRequests)];
                        case 2:
                            delayedCharQueryResults = _a.sent();
                            results = results.concat(delayedCharQueryResults);
                            searchResult = results[0];
                            chartResultSets = results.slice(1);
                            this._mergeFacetsToSearchResultSet(searchResult, chartResultSets);
                            return [2 /*return*/, searchResult];
                    }
                });
            });
        };
        SearchQuery.prototype._doExecuteSearchQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var transformedQuery, resultSet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            transformedQuery = this._filteredQueryTransform(query);
                            return [4 /*yield*/, this.sina.provider.executeSearchQuery(transformedQuery)];
                        case 1:
                            resultSet = _a.sent();
                            return [2 /*return*/, this._filteredQueryBackTransform(query, resultSet)];
                    }
                });
            });
        };
        SearchQuery.prototype._filteredQueryTransform = function (query) {
            return this._genericFilteredQueryTransform(query);
        };
        SearchQuery.prototype._filteredQueryBackTransform = function (query, resultSet) {
            if (query.filter.dataSource.type !== DataSourceType_1.DataSourceType.BusinessObject ||
                query.filter.dataSource.subType !== DataSourceType_1.DataSourceSubType.Filtered) {
                return resultSet;
            }
            resultSet.query = query;
            for (var _i = 0, _a = resultSet.facets; _i < _a.length; _i++) {
                var chartResultSet = _a[_i];
                chartResultSet.query.filter = query.filter.clone();
            }
            return resultSet;
        };
        SearchQuery.prototype._formatResultSetAsync = function (resultSet) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, core.executeSequentialAsync(this.sina.searchResultSetFormatters, function (formatter) {
                            return formatter.formatAsync(resultSet);
                        })];
                });
            });
        };
        SearchQuery.prototype._collectAttributesWithFilter = function (query) {
            // recursively collect attributes
            var attributeMap = {};
            this._doCollectAttributes(attributeMap, query.filter.rootCondition);
            var attributedIds = Object.keys(attributeMap);
            // filter out hierarchy attributes
            // (for hierarchy attributes no chart queries are created per attribute
            // instead in SearchHierarchyFacetsFormatter HierarchyQueries are created)
            return attributedIds.filter(function (attributeId) {
                var attributeMetadata = query.filter.dataSource.getAttributeMetadata(attributeId);
                if (!attributeMetadata) {
                    return true; // inav2: metadata may not be loaded, but inav2 does not support hierarchy
                }
                return !attributeMetadata.isHierarchy;
            });
        };
        SearchQuery.prototype._doCollectAttributes = function (attributeMap, condition) {
            switch (condition.type) {
                case ConditionType_1.ConditionType.Simple:
                    attributeMap[condition.attribute] = true;
                    break;
                case ConditionType_1.ConditionType.Complex:
                    for (var i = 0; i < condition.conditions.length; ++i) {
                        var subCondition = condition.conditions[i];
                        this._doCollectAttributes(attributeMap, subCondition);
                    }
                    break;
            }
        };
        SearchQuery.prototype._createChartQuery = function (query, filterAttribute) {
            var chartQuery = this.sina.createChartQuery({
                dimension: filterAttribute,
                top: this.facetTop,
            });
            chartQuery.setFilter(query.filter.clone());
            chartQuery.filter.rootCondition.removeAttributeConditions(filterAttribute);
            return chartQuery;
        };
        SearchQuery.prototype._createChartQueries = function (query, filterAttributes) {
            var chartQueries = [];
            for (var i = 0; i < filterAttributes.length; ++i) {
                var filterAttribute = filterAttributes[i];
                var chartQuery = this._createChartQuery(query, filterAttribute);
                chartQueries.push(chartQuery);
            }
            return chartQueries;
        };
        SearchQuery.prototype._mergeFacetsToSearchResultSet = function (searchResultSet, chartResultSets) {
            //////////////////////////////////////////////////////////////////////////////////
            // selected filters
            // main request
            // chart request
            // total count
            // 1. selected filters -> facets (no count info)
            // 2. facets (no count info) + total count -> facets (facets with one facet item, count info)
            // 3. facets (facets with one facet item, count info) + main request (count info) -> facets (partial count info)
            // 4. facets (partial count info) + chart request -> facets
            //////////////////////////////////////////////////////////////////////////////////
            this._addSelectedFiltersToSearchResultSet(searchResultSet);
            for (var i = 0; i < chartResultSets.length; ++i) {
                var chartResultSet = chartResultSets[i];
                this._addChartResultSetToSearchResultSet(searchResultSet, chartResultSet);
            }
        };
        SearchQuery.prototype._calculateFacetTitle = function (condition, dataSource) {
            // if (condition.attributeLabel) {
            //     return condition.attributeLabel;
            // }
            var attribute = condition._getAttribute();
            var attributeMetadata = dataSource.getAttributeMetadata(attribute);
            return attributeMetadata.label;
        };
        SearchQuery.prototype._addSelectedFiltersToSearchResultSet = function (searchResultSet) {
            var dataSource = searchResultSet.query.filter.dataSource;
            var rootCondition = searchResultSet.query.filter.rootCondition;
            for (var j = 0; j < rootCondition.conditions.length; j++) {
                var conditions = rootCondition.conditions[j].conditions;
                var conditionAttributeLabel = this._calculateFacetTitle(conditions[0], searchResultSet.query.filter.dataSource);
                var conditionAttribute = void 0;
                switch (conditions[0].type) {
                    case ConditionType_1.ConditionType.Simple:
                        conditionAttribute = conditions[0].attribute;
                        break;
                    case ConditionType_1.ConditionType.Complex:
                        conditionAttribute = conditions[0].conditions[0].attribute;
                        break;
                }
                var attributeMetadata = dataSource.getAttributeMetadata(conditionAttribute);
                if (attributeMetadata.isHierarchy) {
                    continue;
                }
                var matchFacetIndex = this._findMatchFacet(conditionAttribute, searchResultSet.facets);
                var matchFacet = searchResultSet.facets[matchFacetIndex];
                if (!matchFacet) {
                    var chartquery = this._createChartQuery(searchResultSet.query, conditionAttribute);
                    matchFacet = this.sina._createChartResultSet({
                        title: conditionAttributeLabel,
                        items: [],
                        query: chartquery,
                    });
                    searchResultSet.facets.splice(matchFacetIndex, 1, matchFacet);
                }
                var countValue = null;
                if (conditions.length === 1) {
                    countValue = searchResultSet.totalCount;
                }
                var selectedFacetItemList = [];
                for (var k = 0; k < conditions.length; k++) {
                    var matchFacetItemIndex = void 0;
                    // check in searchResultSet facets
                    if (this._findFilterConditionInFacetItemList(conditions[k], matchFacet.items) >= 0) {
                        matchFacetItemIndex = this._findFilterConditionInFacetItemList(conditions[k], matchFacet.items);
                        selectedFacetItemList.push(matchFacet.items[matchFacetItemIndex]);
                    }
                    else {
                        selectedFacetItemList.push(this.sina._createChartResultSetItem({
                            filterCondition: conditions[k],
                            dimensionValueFormatted: conditions[k].valueLabel || conditions[k].value,
                            measureValue: countValue,
                            measureValueFormatted: conditions[k].valueLabel || conditions[k].value,
                        }));
                    }
                }
                matchFacet.items = selectedFacetItemList;
            }
        };
        SearchQuery.prototype._addChartResultSetToSearchResultSet = function (searchResultSet, chartResultSet) {
            if (chartResultSet.items.length === 0) {
                return;
            }
            // check for matching facet in searchResultSet
            var dimension = chartResultSet.query.dimension;
            var matchFacetIndex = this._findMatchFacet(dimension, searchResultSet.facets);
            var matchFacet = searchResultSet.facets[matchFacetIndex];
            // selected facet items for this dimension
            var selectedFacetItemList = matchFacet.items;
            // merge selected facet items to chartResultSet
            var facetItemSelectionOutsideRange = false;
            var appendFacetItemList = [];
            for (var m = 0; m < selectedFacetItemList.length; m++) {
                var matchIndex = this._findFilterConditionInFacetItemList(selectedFacetItemList[m].filterCondition, chartResultSet.items);
                if (matchIndex >= 0) {
                    // if find, insert matching facet item to append list for range facet, because it has count info
                    if (this._isRangeFacet(chartResultSet.query)) {
                        appendFacetItemList.push(chartResultSet.items[matchIndex]);
                    }
                }
                else {
                    // not find, insert selected facet item to append list
                    // for range facet, set boolean as true
                    if (this._isRangeFacet(chartResultSet.query)) {
                        facetItemSelectionOutsideRange = true;
                    }
                    appendFacetItemList.push(selectedFacetItemList[m]);
                }
            }
            appendFacetItemList.sort(function (a, b) {
                return b.measureValue - a.measureValue;
            });
            if (this._isRangeFacet(chartResultSet.query)) {
                if (facetItemSelectionOutsideRange) {
                    chartResultSet.items = appendFacetItemList;
                }
            }
            else {
                chartResultSet.items = chartResultSet.items.concat(appendFacetItemList);
            }
            // merged list as search result facet
            searchResultSet.facets.splice(matchFacetIndex, 1, chartResultSet);
        };
        SearchQuery.prototype._findMatchFacet = function (dimension, facets) {
            var i = 0;
            for (; i < facets.length; i++) {
                var facet = facets[i];
                if (facet.query.dimension === dimension) {
                    break;
                }
            }
            return i;
        };
        SearchQuery.prototype._findFilterConditionInFacetItemList = function (filterCondition, facetItems) {
            var index = -1;
            for (var i = 0; i < facetItems.length; i++) {
                var chartFacetitem = facetItems[i];
                if (filterCondition.equals(chartFacetitem.filterCondition)) {
                    index = i;
                    break;
                }
            }
            return index;
        };
        SearchQuery.prototype._isRangeFacet = function (query) {
            var dataSourceMetadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
            if (dataSourceMetadata.type === query.sina.AttributeType.Double) {
                return true;
            }
            return false;
        };
        return SearchQuery;
    }(Query_1.Query));
    exports.SearchQuery = SearchQuery;
});
})();