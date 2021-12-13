/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

/* global Proxy, Reflect, Symbol */

(function(){
/* eslint-disable @typescript-eslint/no-this-alias */
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
sap.ui.define(["require", "exports", "../AbstractProvider", "./FacetMode", "./FederationType", "./ProviderHelper", "../../sina/Sina", "./FederationMethod", "../../core/Log", "../../sina/SinaConfiguration", "../abap_odata/Provider", "../hana_odata/Provider", "../sample/Provider", "../inav2/Provider", "../dummy/Provider"], function (require, exports, AbstractProvider_1, FacetMode_1, FederationType_1, ProviderHelper_1, Sina_1, FederationMethod, Log_1, SinaConfiguration_1, Provider_1, Provider_2, Provider_3, Provider_4, Provider_5) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MultiProvider = void 0;
    var MultiProvider = /** @class */ (function (_super) {
        __extends(MultiProvider, _super);
        function MultiProvider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = "multi";
            return _this;
        }
        MultiProvider.prototype._initAsync = function (properties) {
            return __awaiter(this, void 0, void 0, function () {
                var creationPromises, hasSubProvider, promises;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.log = new Log_1.Log("MultiProvider");
                            this.sina = properties.sina;
                            this.facetMode = FacetMode_1.FacetMode[properties.facetMode] || FacetMode_1.FacetMode.flat;
                            this.federationType =
                                FederationType_1.FederationType[properties.federationType] || FederationType_1.FederationType.advanced_round_robin;
                            this.multiSina = [];
                            this.multiDataSourceMap = {}; //key: multiId, value: originalDataSource
                            this.sina.dataSourceMap[this.sina.allDataSource.id] = this.sina.allDataSource;
                            this.providerHelper = new ProviderHelper_1.ProviderHelper(this);
                            switch (this.federationType) {
                                case FederationType_1.FederationType.advanced_round_robin: {
                                    this.federationMethod = new FederationMethod.AdvancedRoundRobin();
                                    break;
                                }
                                case FederationType_1.FederationType.ranking: {
                                    this.federationMethod = new FederationMethod.Ranking();
                                    break;
                                }
                                case FederationType_1.FederationType.round_robin: {
                                    this.federationMethod = new FederationMethod.RoundRobin();
                                    break;
                                }
                            }
                            this.sina.capabilities = this.sina._createCapabilities({
                                fuzzy: false,
                            });
                            creationPromises = [];
                            properties.subProviders.forEach(function (configuration) {
                                var creationPromise = _this.createAsync(configuration).then(function (childSina) {
                                    _this.providerHelper.updateProviderId(childSina);
                                    for (var i = 0; i < childSina.dataSources.length; i++) {
                                        var childDataSource = childSina.dataSources[i];
                                        var multiId = _this.providerHelper.calculateMultiDataSourceId(childDataSource.id, childSina.provider.id);
                                        _this.providerHelper.createMultiDataSource(multiId, childDataSource);
                                        _this.multiDataSourceMap[multiId] = childDataSource;
                                    }
                                    _this.multiSina.push(childSina);
                                    return childSina;
                                });
                                creationPromises.push(creationPromise);
                            });
                            hasSubProvider = false;
                            return [4 /*yield*/, Promise.allSettled(creationPromises)];
                        case 1:
                            promises = _a.sent();
                            promises.forEach(function (promise) {
                                if (promise.status === "rejected") {
                                    _this.log.warn("Error during creation of subprovider: " + promise.reason.stack);
                                }
                                else if (promise.status === "fulfilled") {
                                    hasSubProvider = true;
                                    if (promise.value.capabilities.fuzzy) {
                                        _this.sina.capabilities.fuzzy = true;
                                    }
                                }
                            });
                            if (!hasSubProvider) {
                                this.log.error("Error during creation of multi provider: no valid subproviders");
                                return [2 /*return*/, Promise.reject()];
                            }
                            this.sina.dataSources.sort(function (a, b) {
                                return a.label.localeCompare(b.label);
                            });
                            return [2 /*return*/, this.sina];
                    }
                });
            });
        };
        MultiProvider.prototype.createAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                var normalizedConfiguration, providerInstance, sina;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.log.debug("Creating new eshclient instance using provider " + configuration.provider);
                            return [4 /*yield*/, SinaConfiguration_1._normalizeConfiguration(configuration)];
                        case 1:
                            normalizedConfiguration = _a.sent();
                            switch (normalizedConfiguration.provider) {
                                case SinaConfiguration_1.AvailableProviders.HANA_ODATA: {
                                    providerInstance = new Provider_2.Provider();
                                    break;
                                }
                                case SinaConfiguration_1.AvailableProviders.ABAP_ODATA: {
                                    providerInstance = new Provider_1.Provider();
                                    break;
                                }
                                case SinaConfiguration_1.AvailableProviders.INAV2: {
                                    providerInstance = new Provider_4.Provider();
                                    break;
                                }
                                case SinaConfiguration_1.AvailableProviders.MULTI: {
                                    providerInstance = new MultiProvider();
                                    break;
                                }
                                case SinaConfiguration_1.AvailableProviders.SAMPLE: {
                                    providerInstance = new Provider_3.Provider();
                                    break;
                                }
                                case SinaConfiguration_1.AvailableProviders.DUMMY: {
                                    providerInstance = new Provider_5.Provider();
                                    break;
                                }
                                default: {
                                    throw new Error("Unknown Provider: '" +
                                        configuration.provider +
                                        "' - Available Providers: " +
                                        SinaConfiguration_1.AvailableProviders.HANA_ODATA +
                                        ", " +
                                        SinaConfiguration_1.AvailableProviders.ABAP_ODATA +
                                        ", " +
                                        SinaConfiguration_1.AvailableProviders.INAV2 +
                                        ", " +
                                        SinaConfiguration_1.AvailableProviders.MULTI +
                                        ", " +
                                        SinaConfiguration_1.AvailableProviders.SAMPLE +
                                        ", " +
                                        SinaConfiguration_1.AvailableProviders.DUMMY);
                                }
                            }
                            sina = new Sina_1.Sina(providerInstance);
                            return [4 /*yield*/, sina._initAsync(normalizedConfiguration)];
                        case 2:
                            _a.sent();
                            return [2 /*return*/, sina];
                    }
                });
            });
        };
        MultiProvider.prototype.executeSearchQuery = function (query) {
            var that = this;
            var childQuery;
            var querys = [];
            that.searchResultSet = that.sina._createSearchResultSet({
                title: "Search Multi Result List",
                query: query,
                items: [],
                totalCount: 0,
                facets: [],
            });
            that.searchResultSetItemList = [];
            //// search with all dataSource
            if (query.filter.dataSource === that.sina.allDataSource) {
                that.searchResultSet.facets.push(that.sina._createDataSourceResultSet({
                    title: query.filter.dataSource.label,
                    items: [],
                    query: query,
                }));
                for (var i = 0; i < that.multiSina.length; i++) {
                    childQuery = that.multiSina[i].createSearchQuery({
                        calculateFacets: query.calculateFacets,
                        multiSelectFacets: query.multiSelectFacets,
                        dataSource: that.multiSina[i].allDataSource,
                        searchTerm: query.getSearchTerm(),
                        top: query.top,
                        skip: query.skip,
                        sortOrder: query.sortOrder,
                        sina: that.multiSina[i],
                    });
                    querys.push(childQuery.getResultSetAsync());
                }
                return Promise.all(querys).then(function (result) {
                    for (var j = 0; j < result.length; j++) {
                        var searchResultSet = result[j];
                        for (var k = 0; k < searchResultSet.items.length; k++) {
                            var resultItem = searchResultSet.items[k];
                            var multiId = that.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
                            // var dataSource = this.providerHelper.createMultiDataSource(multiId, resultItem.dataSource);
                            var dataSource = that.sina.dataSourceMap[multiId];
                            resultItem.dataSource = dataSource;
                            resultItem.sina = that.sina;
                        }
                        that.searchResultSet.totalCount += searchResultSet.totalCount;
                        that.searchResultSetItemList.push(searchResultSet.items);
                        if (searchResultSet.facets[0]) {
                            if (that.facetMode === FacetMode_1.FacetMode.tree) {
                                var childDataSource_1 = that.sina.getDataSource(that.providerHelper.calculateMultiDataSourceId(searchResultSet.query.filter.dataSource.id, searchResultSet.sina.provider.id));
                                that.searchResultSet.facets[0].items.push(that.sina._createDataSourceResultSetItem({
                                    dataSource: childDataSource_1,
                                    dimensionValueFormatted: that.providerHelper.calculateMultiDataSourceLabel(searchResultSet.query.filter.dataSource.label, searchResultSet.sina.provider),
                                    measureValue: searchResultSet.totalCount,
                                    measureValueFormatted: searchResultSet.totalCount,
                                }));
                            }
                            else {
                                var dataSourceFacets = that.providerHelper.updateDataSourceFacets(searchResultSet.facets);
                                dataSourceFacets[0].items.forEach(function (facetItem) {
                                    that.searchResultSet.facets[0].items.push(facetItem);
                                });
                            }
                        }
                    }
                    that.searchResultSet.items = that.federationMethod.sort(that.searchResultSetItemList);
                    that.searchResultSet.items = that.searchResultSet.items.slice(query.skip, query.top);
                    return that.searchResultSet;
                });
            }
            //// search with user defined dataSources
            else if (query.filter.dataSource.id === "MyFavorites") {
                var myFavorites_1 = that.sina.dataSourceMap[query.filter.dataSource.id];
                var childFavorites_1 = [];
                that.multiSina.forEach(function (childSina) {
                    // create for abap_odata provider child favorites dataSource
                    if (childSina.provider.id.startsWith("abap_odata")) {
                        var childFavoritesDataSourceId = that.providerHelper.calculateMultiDataSourceId(myFavorites_1.id, childSina.provider.id);
                        var abapProviderFavorite = that.multiDataSourceMap[childFavoritesDataSourceId];
                        if (!abapProviderFavorite) {
                            abapProviderFavorite = childSina.createDataSource({
                                id: childFavoritesDataSourceId,
                                label: myFavorites_1.label,
                                labelPlural: myFavorites_1.labelPlural,
                                type: myFavorites_1.type,
                                subDataSources: [],
                                undefinedSubDataSourceIds: [],
                            });
                            that.multiDataSourceMap[childFavoritesDataSourceId] = abapProviderFavorite;
                        }
                        else {
                            abapProviderFavorite.subDataSources = [];
                        }
                    }
                });
                // loop subDataSources, split to get a list childFavorites with different providers
                myFavorites_1.subDataSources.forEach(function (subDataSource) {
                    var childDataSource = that.multiDataSourceMap[subDataSource.id];
                    var childDataSourceSina = childDataSource.sina;
                    // abap_odata provider can search with subDataSources, split with each abap_odata provider
                    if (childDataSourceSina.provider.id.startsWith("abap_odata")) {
                        var childFavoritesDataSourceId = that.providerHelper.calculateMultiDataSourceId(myFavorites_1.id, childDataSourceSina.provider.id);
                        var abapProviderFavorite = that.multiDataSourceMap[childFavoritesDataSourceId];
                        if (abapProviderFavorite.subDataSources.length === 0) {
                            childFavorites_1.push(abapProviderFavorite);
                        }
                        abapProviderFavorite.subDataSources.push(childDataSource);
                    }
                    // other providers can only search with one dataSource, split as single dataSource
                    else {
                        childFavorites_1.push(childDataSource);
                    }
                });
                childFavorites_1.forEach(function (childFavorite) {
                    childQuery = childFavorite.sina.createSearchQuery({
                        calculateFacets: query.calculateFacets,
                        multiSelectFacets: query.multiSelectFacets,
                        dataSource: childFavorite,
                        searchTerm: query.getSearchTerm(),
                        top: query.top,
                        skip: query.skip,
                        sortOrder: query.sortOrder,
                        sina: childFavorite.sina,
                    });
                    querys.push(childQuery.getResultSetAsync());
                });
                return Promise.all(querys).then(function (result) {
                    that.searchResultSet.facets.push(that.sina._createDataSourceResultSet({
                        title: query.filter.dataSource.label,
                        items: [],
                        query: query,
                    }));
                    for (var j = 0; j < result.length; j++) {
                        var searchResultSet = result[j];
                        for (var k = 0; k < searchResultSet.items.length; k++) {
                            var resultItem = searchResultSet.items[k];
                            var multiId = that.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
                            var dataSource = that.sina.dataSourceMap[multiId];
                            resultItem.dataSource = dataSource;
                            resultItem.sina = that.sina;
                        }
                        that.searchResultSet.totalCount += searchResultSet.totalCount;
                        that.searchResultSetItemList.push(searchResultSet.items);
                        // favorite should certainly be a dataSource facet
                        if (query.calculateFacets) {
                            var childDataSource_2 = searchResultSet.query.filter.dataSource;
                            var childDataSourceResultSet = searchResultSet.sina._createDataSourceResultSet({
                                title: childDataSource_2.label,
                                items: [],
                                query: searchResultSet.query,
                            });
                            // manually create a dataSourceResultSet for abap_odata one dataSource child favorite, resultSet has no facet
                            if (searchResultSet.facets.length === 0 && searchResultSet.items.length > 0) {
                                childDataSourceResultSet.items.push(searchResultSet.sina._createDataSourceResultSetItem({
                                    dataSource: childDataSource_2.subDataSources[0],
                                    dimensionValueFormatted: childDataSource_2.subDataSources[0].label,
                                    measureValue: searchResultSet.totalCount,
                                    measureValueFormatted: searchResultSet.totalCount,
                                }));
                                searchResultSet.facets.push(childDataSourceResultSet);
                            }
                            // manually update a dataSourceResultSet for non abap_odata favorite, resultSet has chart facet
                            if (searchResultSet.facets.length > 0 &&
                                searchResultSet.facets[0].type === "Chart" &&
                                searchResultSet.items.length > 0) {
                                childDataSourceResultSet.items.push(searchResultSet.sina._createDataSourceResultSetItem({
                                    dataSource: childDataSource_2,
                                    dimensionValueFormatted: childDataSource_2.label,
                                    measureValue: searchResultSet.totalCount,
                                    measureValueFormatted: searchResultSet.totalCount,
                                }));
                                searchResultSet.facets = [childDataSourceResultSet];
                            }
                            // normally update a dataSourceResultSet
                            if (searchResultSet.facets.length === 1 &&
                                searchResultSet.facets[0].type === "DataSource") {
                                that.providerHelper.updateDataSourceFacets(searchResultSet.facets);
                                that.searchResultSet.facets[0].items =
                                    that.searchResultSet.facets[0].items.concat(searchResultSet.facets[0].items);
                            }
                        }
                    }
                    that.searchResultSet.items = that.federationMethod.sort(that.searchResultSetItemList);
                    that.searchResultSet.items = that.searchResultSet.items.slice(query.skip, query.top);
                    return that.searchResultSet;
                });
            }
            //// search with single child provider dataSource
            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            var rootCondition = query.getRootCondition().clone();
            that.providerHelper.updateRootCondition(rootCondition, childDataSource.sina);
            childQuery = childDataSource.sina.createSearchQuery({
                calculateFacets: query.calculateFacets,
                multiSelectFacets: query.multiSelectFacets,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                rootCondition: query.getRootCondition(),
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder,
                sina: childDataSource.sina,
            });
            return childQuery.getResultSetAsync().then(function (searchResultSet) {
                that.searchResultSet.items = searchResultSet.items;
                that.searchResultSet.totalCount = searchResultSet.totalCount;
                //                    this.searchResultSet.facets = searchResultSet.facets;
                for (var i = 0; i < that.searchResultSet.items.length; i++) {
                    var resultItem = that.searchResultSet.items[i];
                    var resultItemMultiId = that.providerHelper.calculateMultiDataSourceId(resultItem.dataSource.id, resultItem.sina.provider.id);
                    //update attributes metadata
                    that.providerHelper.updateAttributesMetadata(resultItem.dataSource, that.sina.dataSourceMap[resultItemMultiId]);
                    //set the facet result item dataSource as multi provider dataSource
                    resultItem.dataSource = that.sina.dataSourceMap[resultItemMultiId];
                    resultItem.sina = that.sina;
                }
                var multiFacets;
                //dataSource facet
                if (searchResultSet.facets.length === 1 &&
                    searchResultSet.facets[0].items[0].dataSource) {
                    multiFacets = searchResultSet.facets;
                    multiFacets[0].title = that.providerHelper.calculateMultiDataSourceLabel(searchResultSet.facets[0].title, searchResultSet.facets[0].sina.provider);
                    that.providerHelper.updateDataSourceFacets(multiFacets);
                }
                else {
                    //chart facet
                    multiFacets = [];
                    for (var k = 0; k < searchResultSet.facets.length; k++) {
                        var chartResultSet = searchResultSet.facets[k];
                        multiFacets.push(that.providerHelper.createMultiChartResultSet(chartResultSet));
                    }
                }
                that.searchResultSet.facets = multiFacets;
                return that.searchResultSet;
            });
        };
        MultiProvider.prototype.executeChartQuery = function (query) {
            var that = this;
            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            var rootCondition = query.getRootCondition().clone();
            that.providerHelper.updateRootCondition(rootCondition, childDataSource.sina);
            var childQuery = childDataSource.sina.createChartQuery({
                dimension: query.dimension,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                rootCondition: rootCondition,
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder,
            });
            return childQuery.getResultSetAsync().then(function (chartResultSet) {
                return that.providerHelper.createMultiChartResultSet(chartResultSet);
            });
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        MultiProvider.prototype.executeHierarchyQuery = function (query) {
            throw new Error("Method not implmented.");
        };
        MultiProvider.prototype.executeSuggestionQuery = function (query) {
            var that = this;
            var childQuery;
            if (query.filter.dataSource === that.sina.allDataSource) {
                var querys = [];
                for (var i = 0; i < that.multiSina.length; i++) {
                    childQuery = that.multiSina[i].createSuggestionQuery({
                        types: query.types,
                        calculationModes: query.calculationModes,
                        dataSource: that.multiSina[i].allDataSource,
                        searchTerm: query.getSearchTerm(),
                        top: query.top,
                        skip: query.skip,
                        sortOrder: query.sortOrder,
                    });
                    querys.push(childQuery.getResultSetAsync());
                }
                return Promise.allSettled(querys).then(function (results) {
                    var mergedSuggestionResultSet = that.sina._createSuggestionResultSet({
                        title: "Multi Suggestions",
                        query: query,
                        items: [],
                    });
                    for (var j = 0; j < results.length; j++) {
                        var result = results[j];
                        if (result.status === "fulfilled") {
                            var suggestionResultSet = that.providerHelper.updateSuggestionDataSource(result.value);
                            mergedSuggestionResultSet.items = new FederationMethod.RoundRobin().mergeMultiResults(mergedSuggestionResultSet.items, suggestionResultSet.items, j + 1);
                        }
                    }
                    return mergedSuggestionResultSet;
                });
            }
            var childDataSource = that.multiDataSourceMap[query.filter.dataSource.id];
            childQuery = childDataSource.sina.createSuggestionQuery({
                types: query.types,
                calculationModes: query.calculationModes,
                dataSource: childDataSource,
                searchTerm: query.getSearchTerm(),
                top: query.top,
                skip: query.skip,
                sortOrder: query.sortOrder,
            });
            return childQuery.getResultSetAsync().then(function (results) {
                return that.providerHelper.updateSuggestionDataSource(results);
            });
        };
        return MultiProvider;
    }(AbstractProvider_1.AbstractProvider));
    exports.MultiProvider = MultiProvider;
});
})();