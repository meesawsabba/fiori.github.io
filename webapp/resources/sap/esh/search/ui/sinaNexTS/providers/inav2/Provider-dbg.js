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
sap.ui.define(["require", "exports", "../AbstractProvider", "../../core/core", "./conditionSerializer", "./dataSourceSerializer", "../../core/util", "../../core/lang", "../../core/ajax", "./ajaxTemplates", "./labelCalculation", "./pivotTableParser", "./suggestionParser", "./suggestionTermSplitter", "./UserEventLogger", "./MetadataParser", "./ItemParser", "./FacetParser", "../../sina/AttributeType", "../../core/errors"], function (require, exports, AbstractProvider_1, core, conditionSerializer, dataSourceSerializer, util, lang, ajax, ajaxTemplates, labelCalculation, pivotTableParser, suggestionParser, suggestionTermSplitter, UserEventLogger_1, MetadataParser_1, ItemParser_1, FacetParser_1, AttributeType_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = void 0;
    // sinaDefine(['../../core/core',
    //     '../../core/util',
    //     '../../core/lang',
    //     './ajax',
    //     './ajaxTemplates',
    //     './pivotTableParser',
    //     './conditionSerializer',
    //     './dataSourceSerializer',
    //     './FacetParser',
    //     './ItemParser',
    //     './suggestionParser',
    //     './suggestionTermSplitter',
    //     './labelCalculation',
    //     './UserEventLogger',
    //     './MetadataParser'
    // ], function (
    //     core,
    //     util,
    //     lang,
    //     ajax,
    //     ajaxTemplates,
    //     pivotTableParser,
    //     conditionSerializer,
    //     dataSourceSerializer,
    //     FacetParser,
    //     ItemParser,
    //     suggestionParser,
    //     suggestionTermSplitter,
    //     labelCalculation,
    //     UserEventLogger,
    //     MetadataParser) {
    var Provider = /** @class */ (function (_super) {
        __extends(Provider, _super);
        function Provider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = "inav2";
            return _this;
        }
        Provider.prototype._initAsync = function (configuration) {
            var _a;
            this.urlPrefix = "/sap/es/ina";
            this.getServerInfoUrl = this.urlPrefix + "/GetServerInfo";
            this.getResponseUrl = this.urlPrefix + "/GetResponse";
            this.sina = configuration.sina;
            this.ajaxClient =
                (_a = configuration.ajaxClient) !== null && _a !== void 0 ? _a : new ajax.Client({
                    csrf: true,
                    csrfByPassCache: true,
                });
            this.metadataLoadPromises = {};
            this.internalMetadata = {};
            this.labelCalculator = labelCalculation.createLabelCalculator();
            this.userEventLogger = new UserEventLogger_1.UserEventLogger(this);
            this.metadataParser = new MetadataParser_1.MetadataParser(this);
            this.itemParser = new ItemParser_1.ItemParser(this);
            this.facetParser = new FacetParser_1.FacetParser(this);
            this.executeSearchQuery = this.addMetadataLoadDecorator(this.executeSearchQuery);
            this.executeChartQuery = this.addMetadataLoadDecorator(this.executeChartQuery);
            this.executeSuggestionQuery = this.addMetadataLoadDecorator(this.executeSuggestionQuery);
            this.sessionId = core.generateGuid();
            return this.loadServerInfo()
                .then(function (serverInfo) {
                this.serverInfo = serverInfo;
                this.userEventLogger.delayedInit();
                if (!this.supports("Search")) {
                    return Promise.reject(new errors_1.ESHNotActiveError("Enterprise Search is not active"));
                }
                return this.loadBusinessObjectDataSources();
            }.bind(this))
                .then(function () {
                return {
                    capabilities: this.sina._createCapabilities({
                        fuzzy: this.supports("Search", "OptionFuzzy"),
                    }),
                };
            }.bind(this));
        };
        Provider.prototype.addMetadataLoadDecorator = function (executeQuery) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var query = args[0];
                var dataSource = query.filter.dataSource;
                return Promise.resolve()
                    .then(function () {
                    // 1) load metadata
                    return this.loadMetadata(dataSource);
                }.bind(this))
                    .then(function () {
                    // 2) execute query
                    return executeQuery.apply(this, args);
                }.bind(this));
            }.bind(this);
        };
        Provider.prototype.loadMetadata = function (dataSource) {
            // categories have no metadata
            if (dataSource.type === this.sina.DataSourceType.Category) {
                return Promise.resolve();
            }
            // check cache
            var loadPromise = this.metadataLoadPromises[dataSource.id];
            if (loadPromise) {
                return loadPromise;
            }
            // fire request
            ajaxTemplates.loadDataSourceMetadataRequest.DataSource.ObjectName = dataSource.id;
            this.addLanguagePreferences(ajaxTemplates.loadDataSourceMetadataRequest);
            loadPromise = this.ajaxClient
                .postJson(this.getResponseUrl, ajaxTemplates.loadDataSourceMetadataRequest)
                .then(function (response) {
                this.metadataParser.parseMetadataRequestMetadata(dataSource, response.data);
            }.bind(this));
            this.metadataLoadPromises[dataSource.id] = loadPromise;
            return loadPromise;
        };
        Provider.prototype.supports = function (service, capability) {
            for (var i = 0; i < this.serverInfo.Services.length; ++i) {
                var checkService = this.serverInfo.Services[i];
                if (checkService.Service == service) {
                    if (!capability) {
                        return true;
                    }
                    for (var j = 0; j < checkService.Capabilities.length; ++j) {
                        var checkCapability = checkService.Capabilities[j];
                        if (checkCapability.Capability === capability) {
                            return true;
                        }
                    }
                }
            }
            return false;
        };
        Provider.prototype.loadServerInfo = function () {
            return this.ajaxClient.getJson(this.getServerInfoUrl).then(function (response) {
                return response.data;
            });
        };
        Provider.prototype.loadBusinessObjectDataSources = function () {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            var that = this;
            that.addLanguagePreferences(ajaxTemplates.loadDataSourcesRequest);
            // description plural in capability -> add description plural property in request
            if (that.supports("Search", "PluralDescriptionForDataSource")) {
                ajaxTemplates.loadDataSourcesRequest.Search.NamedValues.push({
                    AttributeName: "DescriptionPlural",
                    Name: "DescriptionPlural",
                });
            }
            return that.ajaxClient.postJson(that.getResponseUrl, ajaxTemplates.loadDataSourcesRequest).then(function (response) {
                that._processDataSourcesResponse(response, false);
            }, function () {
                var connector = that.serverInfo.ServerInfo.SystemId +
                    that.serverInfo.ServerInfo.Client +
                    "~ESH_CONNECTOR~";
                ajaxTemplates.fallbackLoadDataSourcesRequest.DataSource.ObjectName = connector;
                return that.ajaxClient
                    .postJson(that.getResponseUrl, ajaxTemplates.fallbackLoadDataSourcesRequest)
                    .then(function (response) {
                    that._processDataSourcesResponse(response, true);
                });
            });
        };
        Provider.prototype._processDataSourcesResponse = function (response, isFallback) {
            var data = pivotTableParser.parse(response.data);
            var dataSourcesData = data.axes[0];
            var _loop_1 = function (i) {
                var dataSourceData = dataSourcesData[i];
                var label = "";
                var labelPlural = "";
                var id = "";
                if (!isFallback) {
                    if (core.isObject(dataSourceData.Description)) {
                        label = dataSourceData.Description.Value;
                    }
                    else {
                        label = dataSourceData.Description;
                    }
                    if (core.isObject(dataSourceData.DescriptionPlural)) {
                        labelPlural = dataSourceData.DescriptionPlural.Value;
                    }
                    else {
                        labelPlural = dataSourceData.DescriptionPlural;
                    }
                    if (core.isObject(dataSourceData.ObjectName)) {
                        id = dataSourceData.ObjectName.Value;
                    }
                    else {
                        id = dataSourceData.ObjectName;
                    }
                }
                else {
                    // fallback
                    dataSourceData.$$ResultItemAttributes$$.forEach(function (elem) {
                        if (elem.Name === "DESCRIPTION") {
                            label = elem.Value;
                        }
                        if (elem.Name === "DESCRIPTION_PLURAL") {
                            labelPlural = elem.Value;
                        }
                        if (elem.Name === "OBJECT_NAME") {
                            id = elem.Value;
                        }
                    });
                }
                if (!label) {
                    label = id;
                }
                if (!labelPlural) {
                    labelPlural = label;
                }
                var dataSource = this_1.sina._createDataSource({
                    id: id,
                    label: label,
                    labelPlural: labelPlural,
                    type: this_1.sina.DataSourceType.BusinessObject,
                    // attributesMetadata: [{
                    //     id: "dummy"
                    // }] // fill with dummy attribute
                });
                this_1.labelCalculator.calculateLabel(dataSource);
            };
            var this_1 = this;
            for (var i = 0; i < dataSourcesData.length; ++i) {
                _loop_1(i);
            }
        };
        Provider.prototype.getInternalMetadataAttributes = function (dataSource) {
            var attributesMetadata = [];
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                return attributesMetadata;
            }
            for (var attributeId in internalMetadata.data) {
                attributesMetadata.push(internalMetadata.data[attributeId]);
            }
            return attributesMetadata;
        };
        Provider.prototype.getInternalMetadataAttribute = function (dataSource, attributeId) {
            return this.internalMetadata[dataSource.id].data[attributeId];
        };
        Provider.prototype.getInternalMetadataLoadStatus = function (dataSource) {
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                return {};
            }
            return internalMetadata.loadStatus;
        };
        Provider.prototype.fillInternalMetadata = function (dataSource, loadStatusType, attributesMetadata) {
            var internalMetadata = this.internalMetadata[dataSource.id];
            if (!internalMetadata) {
                internalMetadata = {
                    loadStatus: {},
                    data: {},
                };
                this.internalMetadata[dataSource.id] = internalMetadata;
            }
            for (var i = 0; i < attributesMetadata.length; ++i) {
                var attributeMetadata = attributesMetadata[i];
                var bufferAttributeMetadata = internalMetadata.data[attributeMetadata.Name];
                if (!bufferAttributeMetadata) {
                    bufferAttributeMetadata = {};
                    internalMetadata.data[attributeMetadata.Name] = bufferAttributeMetadata;
                }
                for (var name_1 in attributeMetadata) {
                    bufferAttributeMetadata[name_1] = attributeMetadata[name_1];
                }
            }
            internalMetadata.loadStatus[loadStatusType] = true;
        };
        Provider.prototype.addTemplateConditions = function (rootCondition) {
            rootCondition.addCondition({
                attribute: "$$RenderingTemplatePlatform$$",
                operator: this.sina.ComparisonOperator.Eq,
                value: "html",
            });
            rootCondition.addCondition({
                attribute: "$$RenderingTemplateTechnology$$",
                operator: this.sina.ComparisonOperator.Eq,
                value: "Tempo",
            });
            rootCondition.addCondition({
                attribute: "$$RenderingTemplateType$$",
                operator: this.sina.ComparisonOperator.Eq,
                value: "ResultItem",
            });
            rootCondition.addCondition({
                attribute: "$$RenderingTemplateType$$",
                operator: this.sina.ComparisonOperator.Eq,
                value: "ItemDetails",
            });
        };
        Provider.prototype.assembleOrderBy = function (query) {
            var result = [];
            for (var i = 0; i < query.sortOrder.length; ++i) {
                var sortKey = query.sortOrder[i];
                var sortOrder = sortKey.order === this.sina.SortOrder.Descending ? "DESC" : "ASC";
                result.push({
                    AttributeName: sortKey.id,
                    SortOrder: sortOrder,
                });
            }
            return result;
        };
        Provider.prototype.executeSearchQuery = function (query) {
            var parsedItems, response;
            // assemble json request
            var rootCondition = query.filter.rootCondition.clone();
            this.addTemplateConditions(rootCondition);
            ajaxTemplates.searchRequest.Search.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            ajaxTemplates.searchRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
            ajaxTemplates.searchRequest.Search.SearchTerms = query.filter.searchTerm;
            ajaxTemplates.searchRequest.Search.Top = query.top;
            ajaxTemplates.searchRequest.Search.Skip = query.skip;
            ajaxTemplates.searchRequest.Options = this.assembleRequestOptions(query);
            ajaxTemplates.searchRequest.Search.OrderBy = this.assembleOrderBy(query);
            ajaxTemplates.searchRequest.Search.Expand = ["Grid", "Items", "TotalCount"];
            this.addLanguagePreferences(ajaxTemplates.searchRequest);
            this.addSessionId(ajaxTemplates.searchRequest);
            if (query.calculateFacets) {
                ajaxTemplates.searchRequest.Search.Expand.push("ResultsetFacets");
            }
            // fire request
            return this.ajaxClient
                .postJson(this.getResponseUrl, ajaxTemplates.searchRequest)
                .then(function (InputResponse) {
                response = InputResponse;
                return this.itemParser.parse(query, response.data);
            }.bind(this))
                .then(function (InputParsedItems) {
                parsedItems = InputParsedItems;
                return this.facetParser.parse(query, response.data);
            }.bind(this))
                .then(function (parsedFacets) {
                return this.sina._createSearchResultSet({
                    id: response.data.ExecutionID,
                    title: "Search Result List",
                    query: query,
                    items: parsedItems.items,
                    totalCount: parsedItems.totalCount,
                    facets: parsedFacets,
                });
            }.bind(this));
        };
        Provider.prototype.executeChartQuery = function (query) {
            // assemble json request
            var rootCondition = query.filter.rootCondition.clone();
            this.addTemplateConditions(rootCondition);
            ajaxTemplates.chartRequest.Search.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            ajaxTemplates.chartRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
            ajaxTemplates.chartRequest.Search.SearchTerms = query.filter.searchTerm;
            ajaxTemplates.chartRequest.Search.Top = 1;
            ajaxTemplates.chartRequest.Search.Skip = 0;
            ajaxTemplates.chartRequest.Facets.Attributes = [query.dimension];
            ajaxTemplates.chartRequest.Facets.MaxNumberOfReturnValues = query.top;
            ajaxTemplates.chartRequest.Options = this.assembleRequestOptions(query);
            this.addLanguagePreferences(ajaxTemplates.chartRequest);
            this.addSessionId(ajaxTemplates.chartRequest);
            // fire request
            return this.ajaxClient
                .postJson(this.getResponseUrl, ajaxTemplates.chartRequest)
                .then(function (response) {
                return this.facetParser.parse(query, response.data);
            }.bind(this))
                .then(function (facets) {
                if (facets.length > 0) {
                    return facets[0];
                }
                return this.sina._createChartResultSet({
                    title: query.filter.dataSource.getAttributeMetadata(query.dimension).label,
                    items: [],
                    query: query,
                });
            }.bind(this));
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Provider.prototype.executeHierarchyQuery = function (query) {
            throw new Error("Method not implmented.");
        };
        Provider.prototype.executeSuggestionQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var searchTerm, splittedTerm, rootCondition;
                return __generator(this, function (_a) {
                    searchTerm = query.filter.searchTerm;
                    splittedTerm = suggestionTermSplitter.split(this, searchTerm);
                    rootCondition = query.filter.rootCondition.clone();
                    if (splittedTerm.searchTerm) {
                        rootCondition.addCondition(query.sina.createSimpleCondition({
                            attribute: AttributeType_1.AttributeType.INAV2_SearchTerms,
                            value: splittedTerm.searchTerm,
                        }));
                    }
                    // add suggestion term to condition
                    rootCondition.addCondition(query.sina.createSimpleCondition({
                        attribute: AttributeType_1.AttributeType.INAV2_SuggestionTerms,
                        value: splittedTerm.suggestionTerm,
                    }));
                    // assemble request
                    ajaxTemplates.suggestionRequest.Suggestions2.Filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
                    ajaxTemplates.suggestionRequest.DataSource = dataSourceSerializer.serialize(query.filter.dataSource);
                    ajaxTemplates.suggestionRequest.Options = this.assembleSuggestionOptions(query);
                    if (ajaxTemplates.suggestionRequest.Options.length === 0) {
                        return [2 /*return*/, this.sina._createSuggestionResultSet({
                                title: "Suggestions",
                                query: query,
                                items: [],
                            })];
                    }
                    ajaxTemplates.suggestionRequest.Suggestions2.Top = query.top;
                    ajaxTemplates.suggestionRequest.Suggestions2.Skip = query.skip;
                    this.addLanguagePreferences(ajaxTemplates.suggestionRequest);
                    this.addSessionId(ajaxTemplates.suggestionRequest);
                    // fire request
                    return [2 /*return*/, this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.suggestionRequest).then(function (response) {
                            var suggestions = suggestionParser.parse(this, query, response.data);
                            suggestionTermSplitter.concatenate(this, splittedTerm, suggestions);
                            return this.sina._createSuggestionResultSet({
                                title: "Suggestions",
                                query: query,
                                items: suggestions,
                            });
                        }.bind(this))];
                });
            });
        };
        Provider.prototype.addSessionId = function (request) {
            if (!this.supports("Search", "SessionHandling")) {
                delete request.SessionID;
                delete request.SessionTimestamp;
                return;
            }
            request.SessionID = this.sessionId;
            request.SessionTimestamp = parseInt(util.generateTimestamp(), 10);
        };
        Provider.prototype.addLanguagePreferences = function (request) {
            if (!this.supports("Search", "LanguagePreferences")) {
                delete request.LanguagePreferences;
                return;
            }
            request.LanguagePreferences = lang.getLanguagePreferences();
        };
        Provider.prototype.assembleSuggestionOptions = function (query) {
            // conversion table
            var sina2InaConversion = {
                SearchTerm: {
                    Data: "SuggestObjectData",
                    History: "SuggestSearchHistory",
                },
                Object: {},
                DataSource: {
                    Data: "SuggestDataSources",
                },
            };
            // based on capabilities -> remove from conversion table
            if (!this.supports("Suggestions2", "ScopeTypes")) {
                delete sina2InaConversion.SearchTerm.History;
                delete sina2InaConversion.DataSource.Data;
            }
            // apply conversion table
            var options = [];
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2InaConversion[suggestionType][calculationMode];
                    if (!value) {
                        continue;
                    }
                    options.push(value);
                }
            }
            return options; //['SuggestObjectData'];
        };
        Provider.prototype.assembleRequestOptions = function (query) {
            var Options = ["SynchronousRun"];
            if (this.decideValueHelp(query)) {
                Options.push("ValueHelpMode");
            }
            return Options;
        };
        Provider.prototype.decideValueHelp = function (query) {
            var conditions = query.filter.rootCondition.conditions;
            for (var i = 0; i < conditions.length; i++) {
                if (query.filter._getAttribute(conditions[i]) === query.dimension) {
                    return true;
                }
            }
            return false;
        };
        Provider.prototype.getConfigurationAsync = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.supports("PersonalizedSearch", "SetUserStatus")) {
                        return [2 /*return*/, Promise.resolve(this.sina._createConfiguration({
                                personalizedSearch: false,
                                isPersonalizedSearchEditable: false,
                            }))];
                    }
                    return [2 /*return*/, this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.getConfigurationRequest).then(function (response) {
                            var config = {
                                personalizedSearch: false,
                                isPersonalizedSearchEditable: false,
                            };
                            config.personalizedSearch = response.data.Data.PersonalizedSearch.SessionUserActive;
                            switch (response.data.Data.PersonalizedSearch.PersonalizationPolicy) {
                                case "Opt-In":
                                    config.isPersonalizedSearchEditable = true;
                                    break;
                                case "Opt-Out":
                                    config.isPersonalizedSearchEditable = true;
                                    break;
                                case "Enforced":
                                    config.isPersonalizedSearchEditable = false;
                                    break;
                                case "Disabled":
                                    config.isPersonalizedSearchEditable = false;
                                    break;
                            }
                            return this.sina._createConfiguration(config);
                        }.bind(this))];
                });
            });
        };
        Provider.prototype.saveConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (!this.supports("PersonalizedSearch", "SetUserStatus")) {
                        return [2 /*return*/, Promise.resolve()];
                    }
                    ajaxTemplates.saveConfigurationRequest.SearchConfiguration.Data.PersonalizedSearch.SessionUserActive =
                        configuration.personalizedSearch;
                    return [2 /*return*/, this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.saveConfigurationRequest)];
                });
            });
        };
        Provider.prototype.resetPersonalizedSearchDataAsync = function () {
            if (!this.supports("PersonalizedSearch", "ResetUserData")) {
                return Promise.resolve();
            }
            return this.ajaxClient.postJson(this.getResponseUrl, ajaxTemplates.resetPersonalizedSearchDataRequest);
        };
        Provider.prototype.logUserEvent = function (event) {
            return this.userEventLogger.logUserEvent(event);
        };
        Provider.prototype.getDebugInfo = function () {
            return ("Searchsystem: " +
                this.serverInfo.ServerInfo.SystemId +
                " Client: " +
                this.serverInfo.ServerInfo.Client +
                " ESH API Provider: " +
                this.id);
        };
        return Provider;
    }(AbstractProvider_1.AbstractProvider));
    exports.Provider = Provider;
});
})();