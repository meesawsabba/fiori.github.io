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
sap.ui.define(["require", "exports", "../core/core", "../core/errors", "../core/util", "./AttributeType", "./AttributeFormatType", "./AttributeGroupTextArrangement", "./DataSourceType", "./MatchingStrategy", "./LogicalOperator", "./ComparisonOperator", "./FacetType", "./SuggestionCalculationMode", "./SuggestionType", "./SortOrder", "./ConditionType", "../providers/tools/cds/CDSAnnotationsParser", "../providers/tools/sors/NavigationTargetGenerator", "./SearchResultSet", "./SearchResultSetItem", "./SearchResultSetItemAttribute", "./ObjectSuggestion", "./SearchQuery", "./ChartQuery", "./SuggestionQuery", "./DataSourceQuery", "./Filter", "./ComplexCondition", "./SimpleCondition", "./AttributeMetadata", "./AttributeGroupMetadata", "./AttributeGroupMembership", "./SearchResultSetItemAttributeGroup", "./SearchResultSetItemAttributeGroupMembership", "./SearchTermSuggestion", "./SearchTermAndDataSourceSuggestion", "./DataSourceSuggestion", "./SuggestionResultSet", "./ChartResultSet", "./DataSourceResultSet", "./ChartResultSetItem", "./DataSourceResultSetItem", "./Capabilities", "./Configuration", "./NavigationTarget", "./formatters/Formatter", "./DataSource", "./UserCategoryDataSource", "../providers/abap_odata/ItemPostParser", "../providers/tools/fiori/SuvNavTargetResolver", "../providers/tools/fiori/NavigationTargetForIntent", "../providers/tools/fiori/FioriIntentsResolver", "./formatters/ResultValueFormatter", "./formatters/NavtargetsInResultSetFormatter", "./formatters/ConfigSearchResultSetFormatter", "./formatters/ConfigMetadataFormatter", "./FilteredDataSource", "../providers/inav2/Provider", "../providers/abap_odata/Provider", "./HierarchyQuery", "./HierarchyNode", "./HierarchyResultSet", "../providers/inav2/typeConverter", "./HierarchyNodePath"], function (require, exports, core, errors, util, AttributeType_1, AttributeFormatType_1, AttributeGroupTextArrangement_1, DataSourceType_1, MatchingStrategy_1, LogicalOperator_1, ComparisonOperator_1, FacetType_1, SuggestionCalculationMode_1, SuggestionType_1, SortOrder_1, ConditionType_1, CDSAnnotationsParser_1, NavigationTargetGenerator_1, SearchResultSet_1, SearchResultSetItem_1, SearchResultSetItemAttribute_1, ObjectSuggestion_1, SearchQuery_1, ChartQuery_1, SuggestionQuery_1, DataSourceQuery_1, Filter_1, ComplexCondition_1, SimpleCondition_1, AttributeMetadata_1, AttributeGroupMetadata_1, AttributeGroupMembership_1, SearchResultSetItemAttributeGroup_1, SearchResultSetItemAttributeGroupMembership_1, SearchTermSuggestion_1, SearchTermAndDataSourceSuggestion_1, DataSourceSuggestion_1, SuggestionResultSet_1, ChartResultSet_1, DataSourceResultSet_1, ChartResultSetItem_1, DataSourceResultSetItem_1, Capabilities_1, Configuration_1, NavigationTarget_1, Formatter_1, DataSource_1, UserCategoryDataSource_1, ItemPostParser_1, SuvNavTargetResolver_1, NavigationTargetForIntent_1, FioriIntentsResolver_1, ResultValueFormatter_1, NavtargetsInResultSetFormatter_1, ConfigSearchResultSetFormatter_1, ConfigMetadataFormatter_1, FilteredDataSource_1, Provider_1, Provider_2, HierarchyQuery_1, HierarchyNode_1, HierarchyResultSet_1, inav2TypeConverter, HierarchyNodePath_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sina = void 0;
    var Sina = /** @class */ (function () {
        function Sina(provider) {
            this.core = core; // convenience: expose core lib
            this.errors = errors; // convenience: expose core lib
            this.util = util; // convenience: expose util lib
            this.inav2TypeConverter = inav2TypeConverter; // do not use except for inav2 compatability
            this.provider = provider;
            this.createSearchQuery = this.createSinaObjectFactory(SearchQuery_1.SearchQuery);
            this.createChartQuery = this.createSinaObjectFactory(ChartQuery_1.ChartQuery);
            this.createHierarchyQuery = this.createSinaObjectFactory(HierarchyQuery_1.HierarchyQuery);
            this.createSuggestionQuery = this.createSinaObjectFactory(SuggestionQuery_1.SuggestionQuery);
            this.createDataSourceQuery = this.createSinaObjectFactory(DataSourceQuery_1.DataSourceQuery);
            this.createFilter = this.createSinaObjectFactory(Filter_1.Filter);
            this.createComplexCondition = this.createSinaObjectFactory(ComplexCondition_1.ComplexCondition);
            this.createSimpleCondition = this.createSinaObjectFactory(SimpleCondition_1.SimpleCondition);
            this.createHierarchyNode = this.createSinaObjectFactory(HierarchyNode_1.HierarchyNode);
            this.createHierarchyNodePath = this.createSinaObjectFactory(HierarchyNodePath_1.HierarchyNodePath);
            this._createAttributeMetadata = this.createSinaObjectFactory(AttributeMetadata_1.AttributeMetadata);
            this._createAttributeGroupMetadata = this.createSinaObjectFactory(AttributeGroupMetadata_1.AttributeGroupMetadata);
            this._createAttributeGroupMembership = this.createSinaObjectFactory(AttributeGroupMembership_1.AttributeGroupMembership);
            this._createSearchResultSetItemAttribute = this.createSinaObjectFactory(SearchResultSetItemAttribute_1.SearchResultSetItemAttribute);
            this._createSearchResultSetItemAttributeGroup = this.createSinaObjectFactory(SearchResultSetItemAttributeGroup_1.SearchResultSetItemAttributeGroup);
            this._createSearchResultSetItemAttributeGroupMembership = this.createSinaObjectFactory(SearchResultSetItemAttributeGroupMembership_1.SearchResultSetItemAttributeGroupMembership);
            this._createSearchResultSetItem = this.createSinaObjectFactory(SearchResultSetItem_1.SearchResultSetItem);
            this._createSearchResultSet = this.createSinaObjectFactory(SearchResultSet_1.SearchResultSet);
            this._createSearchTermSuggestion = this.createSinaObjectFactory(SearchTermSuggestion_1.SearchTermSuggestion);
            this._createSearchTermAndDataSourceSuggestion = this.createSinaObjectFactory(SearchTermAndDataSourceSuggestion_1.SearchTermAndDataSourceSuggestion);
            this._createDataSourceSuggestion = this.createSinaObjectFactory(DataSourceSuggestion_1.DataSourceSuggestion);
            this._createObjectSuggestion = this.createSinaObjectFactory(ObjectSuggestion_1.ObjectSuggestion);
            this._createSuggestionResultSet = this.createSinaObjectFactory(SuggestionResultSet_1.SuggestionResultSet);
            this._createChartResultSet = this.createSinaObjectFactory(ChartResultSet_1.ChartResultSet);
            this._createHierarchyResultSet = this.createSinaObjectFactory(HierarchyResultSet_1.HierarchyResultSet);
            this._createDataSourceResultSet = this.createSinaObjectFactory(DataSourceResultSet_1.DataSourceResultSet);
            this._createChartResultSetItem = this.createSinaObjectFactory(ChartResultSetItem_1.ChartResultSetItem);
            this._createDataSourceResultSetItem = this.createSinaObjectFactory(DataSourceResultSetItem_1.DataSourceResultSetItem);
            this._createCapabilities = this.createSinaObjectFactory(Capabilities_1.Capabilities);
            this._createConfiguration = this.createSinaObjectFactory(Configuration_1.Configuration);
            this._createNavigationTarget = this.createSinaObjectFactory(NavigationTarget_1.NavigationTarget);
            this._createSorsNavigationTargetGenerator = this.createSinaObjectFactory(NavigationTargetGenerator_1.NavigationTargetGenerator);
            this._createFioriIntentsResolver = this.createSinaObjectFactory(FioriIntentsResolver_1.FioriIntentsResolver);
            this._createNavigationTargetForIntent = this.createSinaObjectFactory(NavigationTargetForIntent_1.NavigationTargetForIntent);
            this._createCDSAnnotationsParser = this.createSinaObjectFactory(CDSAnnotationsParser_1.CDSAnnotationsParser);
            this._createItemPostParser = this.createSinaObjectFactory(ItemPostParser_1.ItemPostParser);
            this._createSuvNavTargetResolver = this.createSinaObjectFactory(SuvNavTargetResolver_1.SuvNavTargetResolver);
            this.searchResultSetFormatters = [];
            this.suggestionResultSetFormatters = [];
            this.metadataFormatters = [];
            this.dataSources = [];
            this.dataSourceMap = {};
            this.allDataSource = this.createDataSource({
                id: "All",
                label: "All",
                type: DataSourceType_1.DataSourceType.Category,
            });
            this.searchResultSetFormatters.push(new NavtargetsInResultSetFormatter_1.NavtargetsInResultSetFormatter());
            // this.searchResultSetFormatters.push(new RemovePureAdvancedSearchFacetsFormatter());
            this.searchResultSetFormatters.push(new ResultValueFormatter_1.ResultValueFormatter());
            this.DataSourceType = DataSourceType_1.DataSourceType;
            this.DataSourceSubType = DataSourceType_1.DataSourceSubType;
            this.AttributeGroupTextArrangement = AttributeGroupTextArrangement_1.AttributeGroupTextArrangement;
            this.AttributeType = AttributeType_1.AttributeType;
            this.AttributeFormatType = AttributeFormatType_1.AttributeFormatType;
            this.FacetType = FacetType_1.FacetType;
            this.SuggestionType = SuggestionType_1.SuggestionType;
            this.ConditionType = ConditionType_1.ConditionType;
            this.SuggestionCalculationMode = SuggestionCalculationMode_1.SuggestionCalculationMode;
            this.SortOrder = SortOrder_1.SortOrder;
            this.MatchingStrategy = MatchingStrategy_1.MatchingStrategy;
            this.ComparisonOperator = ComparisonOperator_1.ComparisonOperator;
            this.LogicalOperator = LogicalOperator_1.LogicalOperator;
        }
        Sina.prototype._initAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                var initializationResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.configuration = configuration;
                            this.isDummyProvider = configuration.provider.indexOf("dummy") > -1;
                            this.provider.label = configuration.label;
                            return [4 /*yield*/, this._evaluateConfigurationAsync(configuration)];
                        case 1:
                            _a.sent();
                            configuration.sina = this;
                            return [4 /*yield*/, this.provider._initAsync(configuration)];
                        case 2:
                            initializationResult = _a.sent();
                            initializationResult = initializationResult || {
                                capabilities: null,
                            };
                            this.capabilities = initializationResult.capabilities || this._createCapabilities({ sina: this });
                            return [4 /*yield*/, this._formatMetadataAsync()];
                        case 3:
                            _a.sent();
                            if (!configuration.initAsync) return [3 /*break*/, 5];
                            return [4 /*yield*/, configuration.initAsync(this)];
                        case 4:
                            _a.sent();
                            _a.label = 5;
                        case 5:
                            if (this.getBusinessObjectDataSources().length === 0 && !this.isDummyProvider) {
                                throw new errors.ESHNotActiveError("Not active - no datasources");
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        Sina.prototype._formatMetadataAsync = function () {
            return core.executeSequentialAsync(this.metadataFormatters, function (formatter) {
                return formatter.formatAsync({
                    dataSources: this.dataSources,
                });
            }.bind(this));
        };
        Sina.prototype._evaluateConfigurationAsync = function (configuration) {
            return __awaiter(this, void 0, void 0, function () {
                var promises, i, searchResultSetFormatter, i, suggestionResultSetFormatter, j, metadataFormatter;
                return __generator(this, function (_a) {
                    promises = [];
                    // search result set formatters
                    if (configuration.searchResultSetFormatters) {
                        for (i = 0; i < configuration.searchResultSetFormatters.length; ++i) {
                            searchResultSetFormatter = configuration.searchResultSetFormatters[i];
                            if (!(searchResultSetFormatter instanceof Formatter_1.Formatter) &&
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                !searchResultSetFormatter.formatAsync) {
                                searchResultSetFormatter = new ConfigSearchResultSetFormatter_1.ConfigSearchResultSetFormatter(searchResultSetFormatter);
                            }
                            this.searchResultSetFormatters.push(searchResultSetFormatter);
                            if (searchResultSetFormatter.initAsync) {
                                promises.push(searchResultSetFormatter.initAsync());
                            }
                        }
                    }
                    // suggestion result set formatters
                    if (configuration.suggestionResultSetFormatters) {
                        for (i = 0; i < configuration.suggestionResultSetFormatters.length; ++i) {
                            suggestionResultSetFormatter = configuration.suggestionResultSetFormatters[i];
                            this.suggestionResultSetFormatters.push(suggestionResultSetFormatter);
                            if (suggestionResultSetFormatter.initAsync) {
                                promises.push(suggestionResultSetFormatter.initAsync());
                            }
                        }
                    }
                    // metadata formatters
                    if (configuration.metadataFormatters) {
                        for (j = 0; j < configuration.metadataFormatters.length; ++j) {
                            metadataFormatter = configuration.metadataFormatters[j];
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            if (!(metadataFormatter instanceof Formatter_1.Formatter) && !metadataFormatter.formatAsync) {
                                metadataFormatter = new ConfigMetadataFormatter_1.ConfigMetadataFormatter(metadataFormatter);
                            }
                            this.metadataFormatters.push(metadataFormatter);
                            if (metadataFormatter.initAsync) {
                                promises.push(metadataFormatter.initAsync());
                            }
                        }
                    }
                    return [2 /*return*/, Promise.all(promises)];
                });
            });
        };
        Sina.prototype.loadMetadata = function (dataSource) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    // do not use
                    // only for compatability inav2
                    if (this.provider instanceof Provider_1.Provider) {
                        if (this.provider.loadMetadata) {
                            return [2 /*return*/, this.provider.loadMetadata(dataSource)];
                        }
                    }
                    return [2 /*return*/, Promise.resolve()];
                });
            });
        };
        Sina.prototype.createDataSourceMap = function (dataSources) {
            var map = {};
            for (var i = 0; i < dataSources.length; ++i) {
                var dataSource = dataSources[i];
                map[dataSource.id] = dataSource;
            }
            return map;
        };
        Sina.prototype.createSinaObjectFactory = function (Clazz) {
            return function (properties) {
                properties = properties !== null && properties !== void 0 ? properties : { sina: this };
                properties.sina = this;
                return new Clazz(properties);
            };
        };
        Sina.prototype.createDataSource = function (properties) {
            properties.sina = this;
            var dataSource;
            switch (properties.type) {
                case DataSourceType_1.DataSourceType.BusinessObject:
                    switch (properties.subType) {
                        case DataSourceType_1.DataSourceSubType.Filtered:
                            dataSource = new FilteredDataSource_1.FilteredDataSource(properties);
                            break;
                        default:
                            dataSource = new DataSource_1.DataSource(properties);
                    }
                    break;
                case DataSourceType_1.DataSourceType.UserCategory:
                    dataSource = new UserCategoryDataSource_1.UserCategoryDataSource(properties);
                    break;
                default:
                    dataSource = new DataSource_1.DataSource(properties);
            }
            if (this.dataSourceMap[dataSource.id]) {
                throw new errors.CanNotCreateAlreadyExistingDataSourceError('cannot create an already existing datasource: "' + dataSource.id + '"');
            }
            this._addDataSource(dataSource);
            return dataSource;
        };
        /**
         *
         * @deprecated Use sina.createDataSource() instead
         */
        Sina.prototype._createDataSource = function (properties) {
            return this.createDataSource(properties);
        };
        Sina.prototype._addDataSource = function (dataSource) {
            if (dataSource.type === DataSourceType_1.DataSourceType.BusinessObject &&
                dataSource.subType === DataSourceType_1.DataSourceSubType.Filtered) {
                // 1 filtered datasources
                var insertIndex = -1;
                for (var i = this.dataSources.length - 1; i >= 1; --i) {
                    var checkDataSource = this.dataSources[i];
                    if (checkDataSource.type === DataSourceType_1.DataSourceType.BusinessObject &&
                        checkDataSource.subType === DataSourceType_1.DataSourceSubType.Filtered) {
                        insertIndex = i;
                        break;
                    }
                }
                if (insertIndex >= 0) {
                    this.dataSources.splice(insertIndex + 1, 0, dataSource);
                }
                else {
                    this.dataSources.push(dataSource);
                }
            }
            else {
                // 2 other datasources
                this.dataSources.push(dataSource);
            }
            this.dataSourceMap[dataSource.id] = dataSource;
        };
        Sina.prototype.getAllDataSource = function () {
            return this.allDataSource;
        };
        Sina.prototype.getBusinessObjectDataSources = function () {
            var result = [];
            for (var i = 0; i < this.dataSources.length; ++i) {
                var dataSource = this.dataSources[i];
                if (!dataSource.hidden && dataSource.type === DataSourceType_1.DataSourceType.BusinessObject) {
                    result.push(dataSource);
                }
            }
            return result;
        };
        Sina.prototype.getDataSource = function (id) {
            return this.dataSourceMap[id];
        };
        Sina.prototype.getConfigurationAsync = function (properties) {
            if (properties === void 0) { properties = {}; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    if (this.provider instanceof Provider_1.Provider || this.provider instanceof Provider_2.Provider) {
                        if (this.configurationPromise && !properties.forceReload) {
                            return [2 /*return*/, this.configurationPromise];
                        }
                        this.configurationPromise = this.provider.getConfigurationAsync();
                        return [2 /*return*/, this.configurationPromise];
                    }
                    return [2 /*return*/, Promise.resolve(this._createConfiguration({
                            personalizedSearch: false,
                            isPersonalizedSearchEditable: false,
                        }))];
                });
            });
        };
        Sina.prototype.logUserEvent = function (event) {
            if (this.provider instanceof Provider_1.Provider || this.provider instanceof Provider_2.Provider) {
                this.provider.logUserEvent(event);
            }
        };
        Sina.prototype.getDebugInfo = function () {
            return this.provider.getDebugInfo();
        };
        Sina.prototype.parseDataSourceFromJson = function (json) {
            var dataSource = this.getDataSource(json.id);
            if (dataSource) {
                return dataSource;
            }
            if (json.type !== DataSourceType_1.DataSourceType.Category) {
                throw new errors.DataSourceInURLDoesNotExistError("Datasource in URL does not exist " + json.id);
            }
            dataSource = this._createDataSource(json);
            return dataSource;
        };
        Sina.prototype.parseSimpleConditionFromJson = function (json) {
            var value;
            if (core.isObject(json.value)) {
                value = util.dateFromJson(json.value);
            }
            else {
                value = json.value;
            }
            // Following should satisfy no-unneeded-ternary eslint rule:
            var userDefined;
            if (json.userDefined) {
                userDefined = true;
            }
            else {
                userDefined = false;
            }
            return this.createSimpleCondition({
                operator: json.operator,
                attribute: json.attribute,
                value: value,
                attributeLabel: json.attributeLabel,
                valueLabel: json.valueLabel,
                userDefined: userDefined,
            });
        };
        Sina.prototype.parseComplexConditionFromJson = function (json) {
            var conditions = [];
            for (var i = 0; i < json.conditions.length; ++i) {
                var conditionJson = json.conditions[i];
                conditions.push(this.parseConditionFromJson(conditionJson));
            }
            // Following should satisfy no-unneeded-ternary eslint rule:
            var userDefined;
            if (json.userDefined) {
                userDefined = true;
            }
            else {
                userDefined = false;
            }
            return this.createComplexCondition({
                operator: json.operator,
                conditions: conditions,
                attributeLabel: json.attributeLabel,
                valueLabel: json.valueLabel,
                userDefined: userDefined,
            });
        };
        Sina.prototype.parseConditionFromJson = function (json) {
            switch (json.type) {
                case ConditionType_1.ConditionType.Simple:
                    return this.parseSimpleConditionFromJson(json);
                case ConditionType_1.ConditionType.Complex:
                    return this.parseComplexConditionFromJson(json);
                default:
                    throw new errors.UnknownConditionTypeError('unknown condition type "' + json.type + '"');
            }
        };
        Sina.prototype.parseFilterFromJson = function (json) {
            var rootCondition = this.parseConditionFromJson(json.rootCondition);
            if (rootCondition instanceof ComplexCondition_1.ComplexCondition) {
                return this.createFilter({
                    searchTerm: json === null || json === void 0 ? void 0 : json.searchTerm,
                    rootCondition: rootCondition,
                    dataSource: this.parseDataSourceFromJson(json.dataSource),
                });
            }
            else {
                throw new errors.UnknownConditionTypeError("Only complex condition is allowed in Filter JSON");
            }
        };
        return Sina;
    }());
    exports.Sina = Sina;
});
})();