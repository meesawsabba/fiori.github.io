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
sap.ui.define(["require", "exports", "./ajax", "./ajaxTemplates", "./conditionSerializer", "../../core/core", "./dataSourceSerializer", "./labelCalculation", "./suggestionTermSplitter", "../AbstractProvider", "./FacetParser", "./ItemParser", "./NlqParser", "./suggestionParser", "./UserEventLogger", "./MetadataParser", "../../core/errors"], function (require, exports, ajax, ajaxTemplates, conditionSerializer, core, dataSourceSerializer, labelCalculation, suggestionTermSplitter, AbstractProvider_1, FacetParser_1, ItemParser_1, NlqParser_1, suggestionParser_1, UserEventLogger_1, MetadataParser_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = void 0;
    var Provider = /** @class */ (function (_super) {
        __extends(Provider, _super);
        function Provider() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.id = "abap_odata";
            return _this;
        }
        Provider.prototype._initAsync = function (configuration) {
            var _a;
            this.contentProviderId = configuration.contentProviderId;
            this.requestPrefix = configuration.url || "/sap/opu/odata/sap/ESH_SEARCH_SRV";
            this.sina = configuration.sina;
            this.ajaxClient = (_a = configuration.ajaxClient) !== null && _a !== void 0 ? _a : ajax.createAjaxClient();
            this.metadataLoadPromises = {};
            this.internalMetadata = {};
            this.labelCalculator = labelCalculation.createLabelCalculator();
            this.userEventLogger = new UserEventLogger_1.UserEventLogger(this);
            this.metadataParser = new MetadataParser_1.MetadataParser(this);
            this.itemParser = new ItemParser_1.ItemParser(this);
            this.nlqParser = new NlqParser_1.NlqParser(this);
            this.facetParser = new FacetParser_1.FacetParser(this);
            this.suggestionParser = new suggestionParser_1.SuggestionParser(this, this.itemParser);
            this.sessionId = core.generateGuid();
            this.sorsNavigationTargetGenerator = this.sina._createSorsNavigationTargetGenerator({
                urlPrefix: "#Action-search&/top=10&filter=",
                getPropertyMetadata: function (metadata) {
                    return {
                        name: metadata.id,
                        label: metadata.label,
                        semanticObjectType: metadata._private.semanticObjectType,
                        response: !!(metadata.usage && (metadata.usage.Detail || metadata.usage.Title)),
                        request: true,
                    };
                },
            });
            return this.loadServerInfo()
                .then(function (serverInfo) {
                this.serverInfo = serverInfo.d.results[0];
                if (!this.supports("Search")) {
                    return Promise.reject(new errors_1.ESHNotActiveError("Enterprise Search is not active"));
                }
                return this.loadBusinessObjectDataSources();
            }.bind(this))
                .then(function () {
                return {
                    capabilities: this.sina._createCapabilities({
                        fuzzy: false,
                    }),
                };
            }.bind(this));
        };
        Provider.prototype.supports = function (service, capability) {
            for (var i = 0; i < this.serverInfo.Services.results.length; ++i) {
                var checkService = this.serverInfo.Services.results[i];
                if (checkService.Id == service) {
                    if (!capability) {
                        return true;
                    }
                    for (var j = 0; j < checkService.Capabilities.results.length; ++j) {
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
            var requestUrlServerInfos = this.buildQueryUrl(this.requestPrefix, "/ServerInfos?$expand=Services/Capabilities");
            var requestUrlMetadata = this.buildQueryUrl(this.requestPrefix, "/$metadata");
            var serverInfosProm = this.ajaxClient.getJson(requestUrlServerInfos);
            var metadataProm = this.ajaxClient.getXML(requestUrlMetadata);
            return Promise.all([serverInfosProm, metadataProm]).then(function (values) {
                var response = values[0];
                var serviceXML = values[1];
                if (typeof window !== "undefined") {
                    var oParser = new DOMParser();
                    var oDOM = oParser.parseFromString(serviceXML, "text/xml");
                    if (oDOM.documentElement.nodeName != "parsererror") {
                        this.serviceXML = oDOM;
                    }
                }
                else {
                    // Node.js sina tests
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    var jsdom = require("jsdom");
                    var dom = new jsdom.JSDOM(serviceXML);
                    this.serviceXML = dom.window.document;
                }
                return response.data;
            }.bind(this));
        };
        Provider.prototype.loadBusinessObjectDataSources = function () {
            // complete requestUrlTemplate is "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View' and IsInternal eq false";
            var requestUrlTemplate = "/DataSources?$expand=Annotations,Attributes/UIAreas,Attributes/Annotations&$filter=Type eq 'View'";
            if (this.serviceXML) {
                var annotationsQueryString = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSource]>NavigationProperty[Name=Annotations]," +
                    "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSourceAttribute]>NavigationProperty[Name=Annotations]";
                var elements = this.serviceXML.querySelectorAll(annotationsQueryString);
                if (elements.length != 2) {
                    // Do not query for annotations in data sources request
                    requestUrlTemplate = "/DataSources?$expand=Attributes/UIAreas&$filter=Type eq 'View'";
                }
                var isInternalPath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=DataSource]>Property[Name=IsInternal]";
                if (this.isQueryPropertySupported(isInternalPath)) {
                    // add isInternal filter in data sources request
                    requestUrlTemplate = requestUrlTemplate + " and IsInternal eq false";
                }
            }
            var requestUrl = this.buildQueryUrl(this.requestPrefix, requestUrlTemplate);
            return this.ajaxClient.getJson(requestUrl).then(function (response) {
                var dataSourcesData = response.data.d.results;
                this.metadataParser.parseDataSourceData(dataSourcesData, this.sorsNavigationTargetGenerator);
                this.sorsNavigationTargetGenerator.finishRegistration();
            }.bind(this));
        };
        Provider.prototype.assembleOrderBy = function (query) {
            var result = [];
            for (var i = 0; i < query.sortOrder.length; ++i) {
                var sortKey = query.sortOrder[i];
                var sortOrder = sortKey.order === this.sina.SortOrder.Descending ? "desc" : "asc";
                result.push({
                    AttributeId: sortKey.id,
                    SortOrder: sortOrder,
                });
            }
            return result;
        };
        Provider.prototype.executeSearchQuery = function (query) {
            var items, response;
            var requestTemplate = ajaxTemplates.searchRequest;
            if (query.nlq) {
                requestTemplate = ajaxTemplates.nlqSearchRequest;
            }
            var clientServiceNamePath = "Schema[Namespace=ESH_SEARCH_SRV]>EntityType[Name=SearchOptions]>Property[Name=ClientServiceName]";
            if (!this.isQueryPropertySupported(clientServiceNamePath)) {
                // remove ClientServiceName from data sources request
                delete requestTemplate.d.QueryOptions.ClientServiceName;
            }
            requestTemplate = JSON.parse(JSON.stringify(requestTemplate));
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            }
            else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
            requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.OrderBy = this.assembleOrderBy(query);
            this.addSessionId(requestTemplate);
            if (!query.calculateFacets) {
                delete requestTemplate.d.MaxFacetValues;
                delete requestTemplate.d.Facets;
            }
            else {
                requestTemplate.d.MaxFacetValues = 5;
                requestTemplate.d.Facets = [
                    {
                        Values: [],
                    },
                ];
            }
            // build url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");
            // fire request
            return this.ajaxClient
                .postJson(requestUrl, requestTemplate)
                .then(function (inputResponse) {
                response = inputResponse;
                return this.metadataParser.parseDynamicMetadata(response.data.d);
            }.bind(this))
                .then(function () {
                return this.itemParser.parse(query, response.data.d);
            }.bind(this))
                .then(function (inputItems) {
                items = inputItems;
                return this.facetParser.parse(query, response.data.d);
            }.bind(this))
                .then(function (facets) {
                var nlqResult = this.nlqParser.parse(response.data.d);
                var title = nlqResult.success ? nlqResult.description : "Search Result List";
                return this.sina._createSearchResultSet({
                    id: response.data.d.ResultList.ExecutionID,
                    title: title,
                    query: query,
                    items: items,
                    nlqSuccess: nlqResult.success,
                    totalCount: response.data.d.ResultList.TotalHits,
                    facets: facets,
                });
            }.bind(this))
                .then(function (searchResultSet) {
                this.sorsNavigationTargetGenerator.generateNavigationTargets(searchResultSet);
                return searchResultSet;
            }.bind(this));
        };
        Provider.prototype.executeChartQuery = function (query) {
            var requestUrl = "";
            var requestTemplate;
            var rootCondition = query.filter.rootCondition.clone();
            var filter;
            if (this.decideValueHelp(query)) {
                // value help chart query
                requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.valueHelperRequest));
                this.removeClientOptions(requestTemplate);
                requestTemplate.d.ValueHelpAttribute = query.dimension;
                filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
                if (filter.SubFilters.length !== 0) {
                    requestTemplate.d.Filter = filter;
                }
                else {
                    delete requestTemplate.d.Filter;
                }
                requestTemplate.d.ValueFilter = this.getFilterValueFromConditionTree(query.dimension, filter);
                requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
                requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
                requestUrl = this.buildQueryUrl(this.requestPrefix, "/ValueHelpQueries");
            }
            else {
                // normal chart query
                requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.chartRequest));
                filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
                if (filter.SubFilters.length !== 0) {
                    requestTemplate.d.Filter = filter;
                }
                else {
                    delete requestTemplate.d.Filter;
                }
                requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
                requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
                requestTemplate.d.QueryOptions.Skip = 0;
                this.addSessionId(requestTemplate);
                requestTemplate.d.FacetRequests = [
                    {
                        DataSourceAttribute: query.dimension,
                    },
                ];
                requestTemplate.d.MaxFacetValues = query.top;
                requestUrl = this.buildQueryUrl(this.requestPrefix, "/SearchQueries");
            }
            return this.ajaxClient
                .postJson(requestUrl, requestTemplate)
                .then(function (response) {
                // DataSourceAttribute is facet attribute
                return this.facetParser.parse(query, response.data.d);
            }.bind(this)
            // , function (error) {
            //     // DataSourceAttribute is advanced search relevant attribute, but NOT facet attribute
            //     return [];
            // }
            )
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
            throw new Error("Method not implemented.");
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
            return (query.types.indexOf("Object") >= 0 &&
                query.filter.dataSource.type === query.sina.DataSourceType.BusinessObject);
        };
        Provider.prototype.executeObjectSuggestionQuery = function (query) {
            // check query type
            if (!this.supports("ObjectSuggestions") || !this.isObjectSuggestionQuery(query)) {
                return Promise.resolve([]);
            }
            // build request
            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.objectSuggestionRequest));
            var rootCondition = query.filter.rootCondition.clone();
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            }
            else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.QueryOptions.SearchTerms = query.filter.searchTerm;
            this.addSessionId(requestTemplate);
            // build request url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");
            // fire request
            return this.ajaxClient.postJson(requestUrl, requestTemplate).then(function (response) {
                return this.suggestionParser.parseObjectSuggestions(query, response.data);
            }.bind(this));
        };
        Provider.prototype.executeRegularSuggestionQuery = function (query) {
            var requestTemplate = JSON.parse(JSON.stringify(ajaxTemplates.suggestionRequest));
            // split search term in query into (1) searchTerm (2) suggestionTerm
            var searchTerm = query.filter.searchTerm;
            var splittedTerm = suggestionTermSplitter.split(this, searchTerm);
            // add search term to condition
            var rootCondition = query.filter.rootCondition.clone();
            // assemble request
            var filter = conditionSerializer.serialize(query.filter.dataSource, rootCondition);
            if (filter.SubFilters.length !== 0) {
                requestTemplate.d.Filter = filter;
            }
            else {
                delete requestTemplate.d.Filter;
            }
            requestTemplate.d.DataSources = dataSourceSerializer.serialize(query.filter.dataSource);
            requestTemplate.d.QueryOptions.Top = query.top;
            requestTemplate.d.QueryOptions.Skip = query.skip;
            requestTemplate.d.SuggestionInput = splittedTerm.suggestionTerm;
            requestTemplate.d.QueryOptions.SearchTerms =
                splittedTerm.searchTerm === null ? "" : splittedTerm.searchTerm;
            if (!this.includeSuggestionTypes(query, requestTemplate)) {
                // no regular suggestions requested -> return
                return [];
            }
            this.addSessionId(requestTemplate);
            // build request url
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/SuggestionsQueries");
            // fire request
            return this.ajaxClient
                .postJson(requestUrl, requestTemplate)
                .then(function (response) {
                return this.suggestionParser.parseRegularSuggestions(query, response.data);
            }.bind(this))
                .then(function (suggestions) {
                suggestionTermSplitter.concatenate(this, splittedTerm, suggestions);
                return suggestions;
            }.bind(this));
        };
        Provider.prototype.includeSuggestionTypes = function (query, suggestionRequest) {
            var sina2OdataConversion = {
                SearchTerm: {
                    Data: "IncludeAttributeSuggestions",
                    History: "IncludeHistorySuggestions",
                },
                Object: {},
                DataSource: {
                    Data: "IncludeDataSourceSuggestions",
                },
            };
            var suggestionTypes = query.types;
            var calculationModes = query.calculationModes;
            var success = false;
            for (var i = 0; i < suggestionTypes.length; i++) {
                var suggestionType = suggestionTypes[i];
                for (var j = 0; j < calculationModes.length; j++) {
                    var calculationMode = calculationModes[j];
                    var value = sina2OdataConversion[suggestionType][calculationMode];
                    if (typeof value === "undefined") {
                        continue;
                    }
                    suggestionRequest.d[value] = true;
                    success = true;
                }
            }
            return success;
        };
        Provider.prototype.addSessionId = function (request) {
            //            if (!this.sessionId) {
            //                this.sessionId = core.generateGuid();
            //            }
            request.d.QueryOptions.ClientSessionID = this.sessionId;
            var timeStamp = new Date().getTime();
            request.d.QueryOptions.ClientCallTimestamp = "\\/Date(" + timeStamp + ")\\/";
        };
        Provider.prototype.removeClientOptions = function (request) {
            delete request.d.QueryOptions.ClientSessionID;
            delete request.d.QueryOptions.ClientCallTimestamp;
            delete request.d.QueryOptions.ClientServiceName;
            delete request.d.QueryOptions.ClientLastExecutionID;
        };
        Provider.prototype.getFilterValueFromConditionTree = function (dimension, conditionTree) {
            if (conditionTree.ConditionAttribute && conditionTree.ConditionAttribute === dimension) {
                return conditionTree.ConditionValue;
            }
            else if (conditionTree.SubFilters) {
                var i = void 0;
                var result = null;
                for (i = 0; result === null && i < conditionTree.SubFilters.length; i++) {
                    result = this.getFilterValueFromConditionTree(dimension, conditionTree.SubFilters[i]);
                }
                return result;
            }
            return null;
        };
        Provider.prototype.getConfigurationAsync = function () {
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/PersonalizedSearchMainSwitches?$filter=Selected eq true");
            return this.ajaxClient.getJson(requestUrl).then(function (response) {
                var config = {
                    personalizedSearch: false,
                    isPersonalizedSearchEditable: false,
                };
                switch (response.data.d.results[0].MainSwitch) {
                    case 3:
                        // Enabled after user‘s approval
                        config.isPersonalizedSearchEditable = true;
                        break;
                    case 4:
                        // Enabled until user‘s rejection
                        config.isPersonalizedSearchEditable = true;
                        break;
                    case 2:
                        // Enabled for all users
                        config.isPersonalizedSearchEditable = false;
                        break;
                    case 1:
                        // Disabled for all users
                        config.isPersonalizedSearchEditable = false;
                        break;
                }
                requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
                return this.ajaxClient.getJson(requestUrl).then(function (response) {
                    if (response.data.d.IsEnabledForPersonalizedSearch) {
                        config.personalizedSearch = true;
                    }
                    return this.sina._createConfiguration(config);
                }.bind(this));
            }.bind(this));
        };
        Provider.prototype.saveConfigurationAsync = function (configuration) {
            var data = {
                IsEnabledForPersonalizedSearch: configuration.personalizedSearch,
            };
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
            return this.ajaxClient.mergeJson(requestUrl, data);
        };
        Provider.prototype.resetPersonalizedSearchDataAsync = function () {
            var data = {
                ClearPersonalizedSearchHistory: true,
            };
            var requestUrl = this.buildQueryUrl(this.requestPrefix, "/Users('<current>')");
            return this.ajaxClient.mergeJson(requestUrl, data);
        };
        Provider.prototype.logUserEvent = function (event) {
            return this.userEventLogger.logUserEvent(event);
        };
        Provider.prototype.buildQueryUrl = function (queryPrefix, queryPostfix) {
            if (typeof window === "undefined") {
                // sina mocha tests on node
                return queryPrefix + queryPostfix;
            }
            var windowUrl = window.location.href;
            var requestUrl = "";
            var systemStringBegin;
            var systemString = "";
            var systemInRequestUrl = "";
            // assign search backend system manuelly
            // url: esh-system=sid(PH6.002) -> query: ;o=sid(PH6.002)
            systemStringBegin = windowUrl.indexOf("esh-system=sid(");
            if (systemStringBegin !== -1) {
                var systemStringEnd = windowUrl.substring(systemStringBegin).indexOf(")");
                if (systemStringEnd !== -1) {
                    systemString = windowUrl.substring(systemStringBegin + 15, systemStringBegin + systemStringEnd);
                    if (systemString.length !== 0) {
                        systemInRequestUrl = ";o=sid(" + systemString + ")";
                    }
                }
            }
            // assign search backend system manuelly
            // url: esh-system=ALIASNAMEXYZCLNT002 -> query: ;o=sid(ALIASNAMEXYZCLNT002)
            if (systemString.length === 0) {
                systemStringBegin = windowUrl.indexOf("esh-system=");
                if (systemStringBegin !== -1) {
                    var systemStringEnd1 = windowUrl.substring(systemStringBegin).indexOf("&");
                    var systemStringEnd2 = windowUrl.substring(systemStringBegin).indexOf("#");
                    if (systemStringEnd1 !== -1 && systemStringEnd2 !== -1) {
                        if (systemStringEnd1 < systemStringEnd2) {
                            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
                        }
                        else {
                            systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
                        }
                    }
                    if (systemStringEnd1 !== -1 && systemStringEnd2 === -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd1);
                    }
                    if (systemStringEnd1 === -1 && systemStringEnd2 !== -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11, systemStringBegin + systemStringEnd2);
                    }
                    if (systemStringEnd1 === -1 && systemStringEnd2 === -1) {
                        systemString = windowUrl.substring(systemStringBegin + 11);
                    }
                }
                if (systemString.length !== 0) {
                    systemInRequestUrl = ";o=" + systemString;
                }
            }
            requestUrl = queryPrefix + systemInRequestUrl + queryPostfix;
            return requestUrl;
        };
        Provider.prototype.getDebugInfo = function () {
            return ("Searchsystem: " +
                this.serverInfo.SystemId +
                " Client: " +
                this.serverInfo.Client +
                " ESH Search API Provider: " +
                this.id);
        };
        Provider.prototype.isQueryPropertySupported = function (path) {
            if (this.serviceXML === undefined) {
                return false;
            }
            var elements = this.serviceXML.querySelectorAll(path);
            if (elements.length > 0) {
                return true;
            }
            return false;
        };
        return Provider;
    }(AbstractProvider_1.AbstractProvider));
    exports.Provider = Provider;
});
})();