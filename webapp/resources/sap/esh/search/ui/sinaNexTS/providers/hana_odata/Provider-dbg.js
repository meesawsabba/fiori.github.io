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
sap.ui.define(["require", "exports", "../../core/ajax", "../../core/core", "./MetadataParserXML", "./MetadataParserJson", "./ItemParser", "./FacetParser", "./suggestionParser", "./eshObjects/src/index", "./conditionSerializerEshObj", "../../core/Log", "../../sina/SearchQuery", "../../sina/SortOrder", "../AbstractProvider", "../../sina/SuggestionType", "../../sina/ComplexCondition", "../../core/errors", "./HierarchyParser", "./HierarchyNodePathParser"], function (require, exports, ajax, core, MetadataParserXML_1, MetadataParserJson_1, ItemParser_1, FacetParser_1, suggestionParser_1, index_1, conditionSerializer, Log_1, SearchQuery_1, SortOrder_1, AbstractProvider_1, SuggestionType_1, ComplexCondition_1, errors_1, HierarchyParser_1, HierarchyNodePathParser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = void 0;
    var Provider = /** @class */ (function (_super) {
        __extends(Provider, _super);
        function Provider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = "hana_odata";
            return _this;
        }
        Provider.prototype._initAsync = function (configuration) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function () {
                var metaDataJsonType, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            this.requestPrefix = configuration.url;
                            this.odataVersion = configuration.odataVersion;
                            this.sina = configuration.sina;
                            this.querySuffix = this.convertQuerySuffixToExpression(configuration.querySuffix);
                            this.metaDataSuffix = (_a = configuration.metaDataSuffix) !== null && _a !== void 0 ? _a : "";
                            this.ajaxClient =
                                (_b = configuration.ajaxClient) !== null && _b !== void 0 ? _b : new ajax.Client({
                                    csrf: false,
                                });
                            metaDataJsonType = configuration.metaDataJsonType;
                            if (metaDataJsonType) {
                                this.metadataParser = new MetadataParserJson_1.MetadataParserJson(this);
                            }
                            else {
                                this.metadataParser = new MetadataParserXML_1.MetadataParserXML(this);
                            }
                            this.itemParser = new ItemParser_1.ItemParser(this);
                            this.facetParser = new FacetParser_1.FacetParser(this);
                            this.suggestionParser = new suggestionParser_1.SuggestionParser(this);
                            this.hierarchyNodePathParser = new HierarchyNodePathParser_1.HierarchyNodePathParser(this.sina);
                            _c = this;
                            return [4 /*yield*/, this.loadServerInfo()];
                        case 1:
                            _c.serverInfo = _d.sent();
                            if (!this.supports("Search")) {
                                throw new errors_1.ESHNotActiveError();
                            }
                            return [4 /*yield*/, this.loadBusinessObjectDataSources()];
                        case 2:
                            _d.sent();
                            if (this.sina.dataSources.length === 0) {
                                return [2 /*return*/, Promise.reject(new errors_1.ESHNotActiveError("Enterprise Search is not active - no datasources"))];
                            }
                            return [2 /*return*/, {
                                    capabilities: this.sina._createCapabilities({
                                        fuzzy: false,
                                    }),
                                }];
                    }
                });
            });
        };
        Provider.prototype.supports = function (service, capability) {
            var supportedServices = this.serverInfo.services;
            for (var supportedService in supportedServices) {
                if (supportedService === service) {
                    if (!capability) {
                        return true;
                    }
                    var supportedCapabilities = supportedServices[supportedService].Capabilities;
                    for (var j = 0; j < supportedCapabilities.length; ++j) {
                        var checkCapability = supportedCapabilities[j];
                        if (checkCapability === capability) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        Provider.prototype.loadServerInfo = function () {
            return __awaiter(this, void 0, void 0, function () {
                var simulatedHanaServerinfo;
                return __generator(this, function (_a) {
                    simulatedHanaServerinfo = {
                        rawServerInfo: {
                            Services: [
                                {
                                    Service: "Search",
                                    Capabilities: [
                                        {
                                            Capability: "SemanticObjectType",
                                        },
                                    ],
                                },
                                {
                                    Service: "Suggestions2",
                                    Capabilities: [
                                        {
                                            Capability: "ScopeTypes",
                                        },
                                    ],
                                },
                            ],
                        },
                        services: {
                            Suggestions: {
                                suggestionTypes: ["objectdata"],
                            },
                            Search: {
                                capabilities: ["SemanticObjectType"],
                            },
                        },
                    };
                    return [2 /*return*/, simulatedHanaServerinfo];
                });
            });
        };
        Provider.prototype._prepareMetadataRequest = function () {
            var requestObj = {
                metadataCall: true,
                resourcePath: this.getPrefix() + "/$metadata",
            };
            if (typeof this.metaDataSuffix === "string" && this.metaDataSuffix.length > 0) {
                // TODO: for the temp compatibility of import wizard call, metaDataSuffix shall only contains entityset
                if (this.metaDataSuffix.startsWith("/EntitySets")) {
                    this.metaDataSuffix = this.metaDataSuffix.replace(/\/EntitySets\(/, "");
                    this.metaDataSuffix = this.metaDataSuffix.substring(0, this.metaDataSuffix.length - 1);
                }
                requestObj.metadataObjects = {
                    entitySets: this.metaDataSuffix,
                };
            }
            return index_1.getEshSearchQuery(requestObj);
        };
        Provider.prototype.loadBusinessObjectDataSources = function () {
            return __awaiter(this, void 0, void 0, function () {
                var requestUrl, response, allMetaDataMap, i, dataSource;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            requestUrl = this._prepareMetadataRequest();
                            return [4 /*yield*/, this.metadataParser.fireRequest(this.ajaxClient, requestUrl)];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, this.metadataParser.parseResponse(response)];
                        case 2:
                            allMetaDataMap = _a.sent();
                            for (i = 0; i < allMetaDataMap.dataSourcesList.length; ++i) {
                                dataSource = allMetaDataMap.dataSourcesList[i];
                                this.metadataParser.fillMetadataBuffer(dataSource, allMetaDataMap.businessObjectMap[dataSource.id]);
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Provider.prototype.assembleOrderBy = function (query) {
            var result = [];
            if (Array.isArray(query.sortOrder)) {
                for (var i = 0; i < query.sortOrder.length; ++i) {
                    var sortKey = query.sortOrder[i];
                    var sortOrder = sortKey.order === SortOrder_1.SortOrder.Descending ? index_1.ESOrderType.Descending : index_1.ESOrderType.Ascending;
                    result.push({
                        key: sortKey.id,
                        order: sortOrder,
                    });
                }
            }
            return result;
        };
        Provider.prototype.assembleGroupBy = function (query) {
            var result = null;
            if (query.groupBy && query.groupBy.attributeName && query.groupBy.attributeName.length > 0) {
                result.properties = query.groupBy.attributeName;
                if (query.groupBy.aggregateCountAlias && query.groupBy.aggregateCountAlias !== "") {
                    result.aggregateCountAlias = query.groupBy.aggregateCountAlias;
                }
            }
            return result;
        };
        Provider.prototype.executeSearchQuery = function (query) {
            var oUrlData = this._prepareSearchObjectSuggestionRequest(query);
            return this._fireSearchQuery(oUrlData);
        };
        Provider.prototype._prepareSearchObjectSuggestionRequest = function (query) {
            // assemble request object
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (!Array.isArray(filter.items)) {
                filter.items = [];
            }
            var searchTerms = query.filter.searchTerm;
            if (this.querySuffix) {
                filter.items.push(this.querySuffix);
            }
            var dataSource = query.filter.dataSource;
            var top = query.top || 10;
            var skip = query.skip || 0;
            var sortOrder = this.assembleOrderBy(query);
            var searchOptions = {
                // query: searchTerms,
                resourcePath: this.getPrefix() + "/$all",
                $top: top,
                $skip: skip,
                whyfound: true,
                $count: true,
                $orderby: sortOrder,
                freeStyleText: searchTerms,
                searchQueryFilter: filter,
            };
            if (dataSource !== this.sina.getAllDataSource()) {
                searchOptions.scope = dataSource.id;
            }
            if (query instanceof SearchQuery_1.SearchQuery) {
                if (query.calculateFacets) {
                    searchOptions.facets = ["all"];
                    searchOptions.facetlimit = query.facetTop || 5;
                }
                var groupBy = this.assembleGroupBy(query);
                if (groupBy) {
                    searchOptions.groupby = groupBy;
                    searchOptions.whyfound = false;
                }
            }
            var queryData = {
                url: index_1.getEshSearchQuery(searchOptions),
                query: query,
            };
            return queryData;
        };
        Provider.prototype._fireSearchQuery = function (oInputData) {
            return __awaiter(this, void 0, void 0, function () {
                var response, hierarchyNodePaths, items, facets, statistics, constructedDataSourceFacet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ajaxClient.getJson(oInputData.url)];
                        case 1:
                            response = _a.sent();
                            this.metadataParser.parseDynamicMetadata(response);
                            hierarchyNodePaths = this.hierarchyNodePathParser.parse(response);
                            return [4 /*yield*/, this.itemParser.parse(oInputData.query, response.data)];
                        case 2:
                            items = _a.sent();
                            statistics = response.data["@com.sap.vocabularies.Search.v1.SearchStatistics"].ConnectorStatistics;
                            if (!(oInputData.query.getDataSource() === this.sina.getAllDataSource() &&
                                statistics &&
                                Array.isArray(statistics) &&
                                statistics.length === 1)) return [3 /*break*/, 4];
                            constructedDataSourceFacet = [
                                {
                                    "@com.sap.vocabularies.Search.v1.Facet": {
                                        PropertyName: "scope",
                                        isConnectorFacet: true,
                                    },
                                    Items: [
                                        {
                                            scope: statistics[0].OdataID,
                                            _Count: response.data["@odata.count"],
                                        },
                                    ],
                                },
                            ];
                            return [4 /*yield*/, this.facetParser.parse(oInputData.query, constructedDataSourceFacet)];
                        case 3:
                            facets = _a.sent();
                            return [3 /*break*/, 6];
                        case 4: return [4 /*yield*/, this.facetParser.parse(oInputData.query, response.data)];
                        case 5:
                            facets = _a.sent();
                            _a.label = 6;
                        case 6: 
                        // function getTotalCount() {
                        //     let countName = '@odata.count';
                        //     if (query.groupBy && query.groupBy.aggregateCountAlias) {
                        //         countName = query.groupBy.aggregateCountAlias;
                        //     }
                        //     return response.data[countName] ?? 0;
                        // }
                        return [2 /*return*/, this.sina._createSearchResultSet({
                                title: "Search Result List",
                                query: oInputData.query,
                                items: items,
                                totalCount: response.data["@odata.count"] || 0,
                                facets: facets,
                                hierarchyNodePaths: hierarchyNodePaths,
                            })];
                    }
                });
            });
        };
        Provider.prototype._fireObjectSuggestionsQuery = function (oInputData) {
            return __awaiter(this, void 0, void 0, function () {
                var response, searchItems;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.ajaxClient.getJson(oInputData.url)];
                        case 1:
                            response = _a.sent();
                            this.metadataParser.parseDynamicMetadata(response);
                            return [4 /*yield*/, this.itemParser.parse(oInputData.query, response.data)];
                        case 2:
                            searchItems = _a.sent();
                            return [2 /*return*/, this.suggestionParser.parseObjectSuggestions(oInputData.query, searchItems)];
                    }
                });
            });
        };
        Provider.prototype._prepareChartQueryRequest = function (query, rootCondition, resultDeletion) {
            // const searchTerms = this._escapeSearchTerm(query.filter.searchTerm);
            var searchTerms = query.filter.searchTerm;
            var dataSource = query.filter.dataSource;
            // const rootCondition = query.filter.rootCondition.clone();
            var facetTop = 15; // default value for numeric range/interval facets
            //In value help mode delete current condition from root and prepare to construct the value help part of query
            var isValueHelpMode = resultDeletion.deleted || false;
            var filter = conditionSerializer.serialize(dataSource, rootCondition);
            if (!Array.isArray(filter.items)) {
                filter.items = [];
            }
            var top = query.top || 5;
            //construct search part of $apply
            if (isValueHelpMode === true) {
                //value help mode
                // Attribute value "*" can only be used without EQ part
                // this will be changed on serverside later
                var valueString = resultDeletion.value;
                if (!resultDeletion.value ||
                    resultDeletion.value === "" ||
                    valueString.match(/^[*\s]+$/g) !== null) {
                    resultDeletion.value = "*";
                    // searchExpression +=
                    //     "(" +
                    //     resultDeletion.attribute +
                    //     ':"*") ' +
                    //     filter +
                    //     " " +
                    //     parentthesis4SearchTermsOpen +
                    //     searchTerms;
                    filter.items.push(new index_1.Comparison({
                        property: resultDeletion.attribute,
                        operator: index_1.SearchQueryComparisonOperator.Search,
                        value: new index_1.Term({ term: "*" }),
                    }));
                }
                else {
                    // searchExpression +=
                    //     "(" +
                    //     resultDeletion.attribute +
                    //     ':EQ:"' +
                    //     resultDeletion.value +
                    //     '*") ' +
                    //     filter +
                    //     " " +
                    //     parentthesis4SearchTermsOpen +
                    //     searchTerms;
                    filter.items.push(new index_1.Comparison({
                        property: resultDeletion.attribute,
                        operator: index_1.SearchQueryComparisonOperator.EqualCaseInsensitive,
                        value: new index_1.Phrase({
                            phrase: resultDeletion.value + "*",
                        }),
                    }));
                }
            }
            if (this.querySuffix) {
                filter.items.push(this.querySuffix);
            }
            var chartOptions = {
                resourcePath: this.getPrefix() + "/$all",
                $top: 0,
                $count: true,
                searchQueryFilter: filter,
                freeStyleText: searchTerms,
            };
            if (dataSource !== this.sina.getAllDataSource()) {
                chartOptions.scope = dataSource.id;
            }
            var facetScope = [];
            chartOptions.facetlimit = top;
            if (query.dimension) {
                facetScope.push(query.dimension);
                var metadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
                if (metadata && (metadata.type === "Double" || metadata.type === "Integer") && top >= 20) {
                    //facet limit decides number of intervals/ranges of numeric data types, but has no effect on date/time ranges
                    chartOptions.facetlimit = facetTop;
                }
            }
            //just require own chart facet in case that
            chartOptions.facets = facetScope;
            // Get Query Url
            return index_1.getEshSearchQuery(chartOptions);
        };
        Provider.prototype.executeChartQuery = function (query) {
            var log = new Log_1.Log();
            //In value help mode delete current condition from root and prepare to construct the value help part of query
            var rootCondition = query.filter.rootCondition.clone();
            var resultDeletion = rootCondition.removeAttributeConditions(query.dimension);
            var url = this._prepareChartQueryRequest(query, rootCondition, resultDeletion);
            // fire request
            return this.ajaxClient
                .getJson(url)
                .then(function (response) {
                // return this.facetParser.parse(query, response.data);
                var facets = this.facetParser.parse(query, response.data, log);
                return facets;
            }.bind(this))
                .then(function (facets) {
                if (facets.length > 0) {
                    return facets[0];
                }
                var metadataLabel = "";
                var metadata = query.filter.dataSource.getAttributeMetadata(query.dimension);
                if (metadata && metadata.label) {
                    metadataLabel = metadata.label;
                }
                return this.sina._createChartResultSet({
                    title: metadataLabel,
                    items: [],
                    query: query,
                    log: log,
                });
            }.bind(this));
        };
        Provider.prototype.executeHierarchyQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var hierarchyParser, filter, requestUrl, response, attributeMetadata, facets, facet;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            hierarchyParser = new HierarchyParser_1.HierarchyParser();
                            filter = conditionSerializer.serialize(query.filter.dataSource, query.filter.rootCondition);
                            if (!Array.isArray(filter.items)) {
                                filter.items = [];
                            }
                            if (this.querySuffix) {
                                filter.items.push(this.querySuffix);
                            }
                            requestUrl = index_1.getEshSearchQuery({
                                resourcePath: this.getPrefix() + "/$all",
                                $top: 0,
                                searchQueryFilter: filter,
                                freeStyleText: query.filter.searchTerm,
                                scope: query.filter.dataSource.id,
                                facets: [query.attributeId],
                                facetroot: [
                                    new index_1.HierarchyFacet({ facetColumn: query.attributeId, rootIds: [query.nodeId], levels: 1 }),
                                ],
                            });
                            return [4 /*yield*/, this.ajaxClient.getJson(requestUrl)];
                        case 1:
                            response = _a.sent();
                            attributeMetadata = query.filter.dataSource.getAttributeMetadata(query.attributeId);
                            facets = response.data["@com.sap.vocabularies.Search.v1.Facets"];
                            facet = facets.find(function (facet) {
                                var attributeId = core.getProperty(facet, [
                                    "@com.sap.vocabularies.Search.v1.Facet",
                                    "Dimensions",
                                    0,
                                    "PropertyName",
                                ]);
                                return attributeId === query.attributeId;
                            });
                            return [2 /*return*/, hierarchyParser.parseHierarchyFacet(query, attributeMetadata, facet)];
                    }
                });
            });
        };
        Provider.prototype.executeSuggestionQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // handle regular suggestions and object suggestion separately because
                    // object suggestions have only searchterms and no suggestionInput
                    return [2 /*return*/, Promise.all([
                            this.executeRegularSuggestionQuery(query),
                            this.executeObjectSuggestionQuery(query),
                        ]).then(function (results) {
                            var suggestions = [];
                            suggestions.push.apply(suggestions, results[1]);
                            suggestions.push.apply(suggestions, results[0]);
                            return this.sina._createSuggestionResultSet({
                                title: "Suggestions",
                                query: query,
                                items: suggestions,
                            });
                        }.bind(this))];
                });
            });
        };
        Provider.prototype.isObjectSuggestionQuery = function (query) {
            return (query.types.indexOf(SuggestionType_1.SuggestionType.Object) >= 0 &&
                query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject);
        };
        Provider.prototype.executeObjectSuggestionQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var oUrlData;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // check query type
                            if (!this.isObjectSuggestionQuery(query)) {
                                return [2 /*return*/, Promise.resolve([])];
                            }
                            return [4 /*yield*/, this._prepareSearchObjectSuggestionRequest(query)];
                        case 1:
                            oUrlData = _a.sent();
                            return [2 /*return*/, this._fireObjectSuggestionsQuery(oUrlData)];
                    }
                });
            });
        };
        Provider.prototype.executeRegularSuggestionQuery = function (query) {
            var sina2OdataConversion = {
                SearchTerm: {
                    Data: "SuggestObjectData",
                    History: "SuggestSearchHistory",
                },
                Object: {},
                DataSource: {
                    Data: "SuggestDataSources",
                },
            };
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            var blankPromise = Promise.resolve([]);
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2OdataConversion[suggestionType][calculationMode];
                    switch (value) {
                        case "SuggestObjectData":
                            return this._fireSuggestionQuery(query);
                        // case "SuggestSearchHistory":
                        // case "SuggestDataSources":
                        default:
                            return blankPromise;
                    }
                }
            }
            // return this._fireSuggestionQuery(query);
        };
        Provider.prototype._prepareSuggestionQueryRequest = function (query) {
            /*
                type=scope for search connector names
                currently only for technical names, shall be discussed
                Do we need count?
                $apply=filter part exactly as search query but move search terms to term parameter in getSuggestion
            */
            // split search term in query into (1) searchTerm (2) suggestionTerm
            // const searchTerm = this._escapeSearchTerm(query.filter.searchTerm);
            // const searchTerm = encodeURIComponent(
            //     query.filter.searchTerm
            // );
            var searchTerms = query.filter.searchTerm;
            var dataSource = query.filter.dataSource;
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (!Array.isArray(filter.items)) {
                filter.items = [];
            }
            var top = query.top || 10;
            var skip = query.skip || 0;
            if (this.querySuffix) {
                filter.items.push(this.querySuffix);
            }
            var suggestionOptions = {
                suggestTerm: searchTerms,
                resourcePath: this.getPrefix() + "/$all",
                $top: top,
                $skip: skip,
                searchQueryFilter: filter,
            };
            if (dataSource !== this.sina.getAllDataSource()) {
                suggestionOptions.scope = dataSource.id;
            }
            return index_1.getEshSearchQuery(suggestionOptions);
        };
        Provider.prototype._fireSuggestionQuery = function (query) {
            var url = this._prepareSuggestionQueryRequest(query);
            // fire request
            return this.ajaxClient.getJson(url).then(function (response) {
                var suggestions = [];
                if (response.data.value) {
                    suggestions = this.suggestionParser.parse(query, response.data.value);
                }
                return suggestions;
            }.bind(this));
        };
        // getFilterValueFromConditionTree(
        //     dimension: any,
        //     conditionTree: {
        //         ConditionAttribute: any;
        //         ConditionValue: any;
        //         SubFilters: string | any[];
        //     }
        // ) {
        //     if (
        //         conditionTree.ConditionAttribute &&
        //         conditionTree.ConditionAttribute === dimension
        //     ) {
        //         return conditionTree.ConditionValue;
        //     } else if (conditionTree.SubFilters) {
        //         let i: number;
        //         let result = null;
        //         for (
        //             i = 0;
        //             result === null && i < conditionTree.SubFilters.length;
        //             i++
        //         ) {
        //             result = this.getFilterValueFromConditionTree(
        //                 dimension,
        //                 conditionTree.SubFilters[i]
        //             );
        //         }
        //         return result;
        //     }
        //     return null;
        // }
        Provider.prototype.getPrefix = function () {
            var _a, _b;
            var odataVersion = (_a = this.odataVersion) !== null && _a !== void 0 ? _a : "/v20411";
            var requestPrefix = (_b = this.requestPrefix) !== null && _b !== void 0 ? _b : "/sap/es/odata";
            var prefix = requestPrefix + odataVersion;
            return prefix;
        };
        Provider.prototype.convertQuerySuffixToExpression = function (suffix) {
            var suffixExpression = null;
            if (suffix && suffix instanceof ComplexCondition_1.ComplexCondition) {
                suffixExpression = conditionSerializer.serialize(null, suffix);
            }
            return suffixExpression;
        };
        Provider.prototype.getDebugInfo = function () {
            return "ESH API Provider: " + this.id;
        };
        return Provider;
    }(AbstractProvider_1.AbstractProvider));
    exports.Provider = Provider;
});
})();