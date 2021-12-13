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
/* global $ */
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
sap.ui.define(["require", "exports", "../AbstractProvider", "./template", "./template2"], function (require, exports, AbstractProvider_1, template_1, template2_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Provider = void 0;
    var Provider = /** @class */ (function (_super) {
        __extends(Provider, _super);
        function Provider() {
            var _this = _super.call(this) || this;
            _this.id = "sample";
            _this.instanceCounterStr = "0";
            return _this;
        }
        Provider.prototype._initAsync = function (properties) {
            return __awaiter(this, void 0, void 0, function () {
                var forceSample, demoRoot, res;
                return __generator(this, function (_a) {
                    this.sina = properties.sina;
                    this.sina.util.sampleProviderInstanceCounter++;
                    this.instanceCounterStr = "" + this.sina.util.sampleProviderInstanceCounter;
                    forceSample = 0;
                    if (document.location.href.indexOf("use=sample1") > 0) {
                        forceSample = 1;
                    }
                    else if (document.location.href.indexOf("use=sample2") > 0) {
                        forceSample = 2;
                    }
                    if (forceSample === 1) {
                        this.templateProvider = template2_1.createTemplate; //the original template, scientists
                    }
                    else if (forceSample === 2) {
                        this.templateProvider = template_1.createTemplate; //the newer template, folklorists
                    }
                    else if (parseInt(this.instanceCounterStr, 10) % 2 === 1) {
                        this.templateProvider = template_1.createTemplate;
                    }
                    else {
                        this.templateProvider = template2_1.createTemplate;
                    }
                    demoRoot = this.templateProvider(this);
                    demoRoot._init(demoRoot);
                    res = Promise.resolve({
                        capabilities: this.sina._createCapabilities({
                            fuzzy: false,
                        }),
                    });
                    return [2 /*return*/, res];
                });
            });
        };
        Provider.prototype.getSuggestionList = function (templateData) {
            var listAsString = this._stringify(templateData);
            /* eslint no-useless-escape:0 */
            var regexp = new RegExp('"valueFormatted":"([^{/]+?)","valueHighlighted', "g");
            var matches = listAsString.match(regexp);
            var singleWords = matches.toString().split(" ");
            singleWords = singleWords.toString().split(",");
            matches = matches.concat(singleWords);
            //matches = singleWords;
            matches = matches.filter(function (item, pos) {
                if (item !== "") {
                    return matches.indexOf(item) == pos;
                }
            });
            return matches;
        };
        Provider.prototype._stringify = function (o) {
            var cache = [];
            var s = JSON.stringify(o, function (key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        // Circular reference found, discard key
                        return undefined;
                    }
                    // Store value in our collection
                    cache.push(value);
                }
                return value;
            });
            cache = null; // Enable garbage collection
            return s;
        };
        Provider.prototype.adjustImageViewing = function () {
            var clonePic, top, left;
            try {
                //try catch added for require issues  during unit testing per qUnit
                $(".sapUshellSearchResultListItem-Image").on("mouseenter", function () {
                    //var pos = $(this).offset();
                    clonePic = $(this).clone();
                    $("body").append(clonePic);
                    top = ($(window).height() - $(clonePic).outerHeight()) * 0.33;
                    left = ($(window).width() - $(clonePic).outerWidth()) * 0.33;
                    //var w = clonePic[0].width;
                    clonePic
                        .css({
                        position: "absolute",
                        top: top + "px",
                        left: left + "px",
                    })
                        .show();
                });
                $(".sapUshellSearchResultListItem-Image").on("mouseleave", function () {
                    clonePic.remove();
                });
            }
            catch (error) {
                //do nothing
            }
        };
        Provider.prototype.applyFilters = function (items, searchQuery) {
            var newItemsArray = [];
            if (searchQuery.filter.rootCondition.conditions.length === 0 ||
                searchQuery.filter.rootCondition.conditions[0].conditions.length === 0) {
                return items;
            }
            var toBeDimensionValuePairsArray = [];
            var toBeDimensionsArray = [];
            for (var g = 0; g < searchQuery.filter.rootCondition.conditions.length; g++) {
                var conditions = searchQuery.filter.rootCondition.conditions[g]
                    .conditions;
                for (var h = 0; h < conditions.length; h++) {
                    //conditions[j].attribute; //eg LOCATION
                    //conditions[j].value; //eg Galapagos
                    toBeDimensionValuePairsArray.push([conditions[h].attribute, conditions[h].value]);
                    toBeDimensionsArray.push(conditions[h].attribute);
                }
            }
            var fits = false;
            for (var i = 0; i < items.length; i++) {
                //compare items with collected to-be-valid conditions
                var item = items[i];
                var fitsArray = [];
                for (var j = 0; j < toBeDimensionValuePairsArray.length; j++) {
                    fits = false;
                    for (var k = 0; k < item.detailAttributes.length; k++) {
                        //loop thru all detailAttributes of item
                        var detailAttribute = item.detailAttributes[k];
                        if (detailAttribute.id === toBeDimensionValuePairsArray[j][0] &&
                            detailAttribute.value === toBeDimensionValuePairsArray[j][1]) {
                            fits = true;
                        }
                    }
                    for (var m = 0; m < item.titleAttributes.length; m++) {
                        //loop thru all titleAttributes of item
                        var titleAttribute = item.titleAttributes[m];
                        if (titleAttribute.id === toBeDimensionValuePairsArray[j][0] &&
                            titleAttribute.value === toBeDimensionValuePairsArray[j][1]) {
                            fits = true;
                        }
                    }
                    toBeDimensionValuePairsArray[j][2] = fits;
                    fitsArray.push(fits);
                }
                if (fitsArray.toString().match(/false/) === null) {
                    newItemsArray.push(item);
                }
                else {
                    //see it there is one 'true' match for each unique dimension, if so we can still add item
                    var fitsArray2 = [];
                    var uniqueDimensionsArray = toBeDimensionsArray.filter(function (item, pos) {
                        return toBeDimensionsArray.indexOf(item) == pos;
                    });
                    for (var n = 0; n < uniqueDimensionsArray.length; n++) {
                        fits = false;
                        var dimension = uniqueDimensionsArray[n];
                        for (var p = 0; p < toBeDimensionValuePairsArray.length; p++) {
                            if (toBeDimensionValuePairsArray[p][0] === dimension &&
                                toBeDimensionValuePairsArray[p][2] === true) {
                                fits = true;
                                break;
                            }
                        }
                        fitsArray2.push(fits);
                    }
                    if (fitsArray2.toString().match(/false/) === null) {
                        newItemsArray.push(item);
                    }
                }
            }
            return newItemsArray;
        };
        Provider.prototype.adjustHighlights = function (items, searchTerm) {
            var newItemsArray = [];
            var attrMetadataType = "";
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                var neverFound = true;
                attrMetadataType = "";
                item.titleHighlighted = this.addHighlight(item.title, searchTerm);
                if (item.titleHighlighted !== item.title) {
                    neverFound = false;
                }
                for (var j = 0; j < item.detailAttributes.length; j++) {
                    var detailAttr = item.detailAttributes[j];
                    attrMetadataType = detailAttr.metadata.type;
                    if (attrMetadataType === "String" || attrMetadataType === "Integer") {
                        detailAttr.valueHighlighted = this.addHighlight(detailAttr.valueFormatted, searchTerm);
                        if (detailAttr.valueHighlighted !== detailAttr.valueFormatted) {
                            neverFound = false;
                        }
                    }
                }
                for (var k = 0; k < item.titleAttributes.length; k++) {
                    var titleAttr = item.titleAttributes[k];
                    attrMetadataType = titleAttr.metadata.type;
                    //  KLUDGE!! ImageUrl added to the following for publications / document links
                    if (attrMetadataType === "String" ||
                        attrMetadataType === "Integer" ||
                        attrMetadataType === "ImageUrl") {
                        titleAttr.valueHighlighted = this.addHighlight(titleAttr.valueFormatted, searchTerm);
                        if (titleAttr.valueHighlighted !== titleAttr.valueFormatted) {
                            neverFound = false;
                        }
                    }
                }
                if (neverFound === false || searchTerm === "*" || searchTerm === "") {
                    // asterisk
                    newItemsArray.push(item);
                }
            }
            return newItemsArray;
        };
        Provider.prototype.addHighlight = function (hText, searchTerm) {
            if (typeof hText !== "string" || typeof searchTerm !== "string") {
                return hText;
            }
            var pos1 = hText.toLowerCase().indexOf(searchTerm.toLowerCase());
            if (pos1 > -1) {
                var pos2 = pos1 + searchTerm.length;
                var newHText = hText.substring(0, pos1) +
                    "<b>" +
                    hText.substring(pos1, pos2) +
                    "</b>" +
                    hText.substring(pos2);
                return newHText;
            }
            return hText;
        };
        Provider.prototype.addSuvLinkToSearchResultItem = function (searchResultItem, suvPath, searchTermsArray) {
            var suvNavTargetResolver = this.sina._createSuvNavTargetResolver();
            if (!suvPath) {
                suvPath =
                    "/resources/sap/esh/search/ui/sinaNexTS/providers/sample/docs/folklorist_authors_and_publications.suv";
            }
            if (!searchTermsArray) {
                searchTermsArray = [];
            }
            var suvAttributes = {};
            suvAttributes.obj = {
                suvThumbnailAttribute: searchResultItem,
                suvTargetMimeTypeAttribute: {
                    value: "application/vnd.sap.universal-viewer+suv",
                },
                suvTargetUrlAttribute: {
                    value: suvPath,
                },
            };
            suvNavTargetResolver.resolveSuvNavTargets(null, suvAttributes, searchTermsArray);
        };
        // private augmentDetailAttributes(
        //     resultItemArray: Array<SearchResultSetItem>
        // ): Array<SearchResultSetItem> {
        //     for (let i = 0; i < resultItemArray.length; i++) {
        //         const attributesArray = resultItemArray[i].detailAttributes;
        //         for (let j = 0; j < attributesArray.length; j++) {
        //             let attribute = attributesArray[j];
        //             attribute = util.addPotentialNavTargetsToAttribute(
        //                 this.sina,
        //                 attribute
        //             );
        //         }
        //     }
        //     return resultItemArray;
        // }
        Provider.prototype.executeSearchQuery = function (searchQuery) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.searchQuery = searchQuery;
                    return [2 /*return*/, new Promise(function (resolve) {
                            var resultSet;
                            var itemsRoot = _this.templateProvider(_this);
                            var items1 = itemsRoot.searchResultSetItemArray;
                            // items1 = this.augmentDetailAttributes(items1);
                            var items2 = itemsRoot.searchResultSetItemArray2;
                            // items2 = this.augmentDetailAttributes(items2);
                            var itemsAll = items1.concat(items2);
                            var items3;
                            if (itemsRoot.searchResultSetItemArray3) {
                                items3 = itemsRoot.searchResultSetItemArray3;
                                itemsAll = itemsAll.concat(items3);
                            }
                            var searchTerm = searchQuery.filter.searchTerm;
                            var dataSourceId = searchQuery.filter.dataSource.id;
                            var facets1 = _this.generateFacets(searchQuery);
                            var items;
                            if (dataSourceId === "Scientists" || dataSourceId === "Folklorists") {
                                items = _this.adjustHighlights(items1, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                resultSet = _this.sina._createSearchResultSet({
                                    items: items,
                                    facets: facets1,
                                    query: searchQuery,
                                    title: "",
                                    totalCount: items.length,
                                });
                            }
                            else if (dataSourceId === "Mysterious_Sightings" || dataSourceId === "Urban_Legends") {
                                items = _this.adjustHighlights(items2, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                resultSet = _this.sina._createSearchResultSet({
                                    items: items,
                                    facets: facets1,
                                    query: searchQuery,
                                    title: "",
                                    totalCount: items.length,
                                });
                            }
                            else if (dataSourceId === "Publications") {
                                items = _this.adjustHighlights(items3, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                resultSet = _this.sina._createSearchResultSet({
                                    items: items,
                                    facets: facets1,
                                    query: searchQuery,
                                    title: "",
                                    totalCount: items.length,
                                });
                            }
                            else if (dataSourceId === "All") {
                                //calculate total counts for each sub branch of 'all'
                                items = _this.adjustHighlights(items1, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                var totalCount1 = items.length;
                                items = _this.adjustHighlights(items2, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                var totalCount2 = items.length;
                                var totalCount3 = 0;
                                if (items3) {
                                    items = _this.adjustHighlights(items3, searchTerm);
                                    items = _this.applyFilters(items, searchQuery);
                                    totalCount3 = items.length;
                                }
                                facets1[0].items[0].measureValue = totalCount1; //scientists
                                facets1[0].items[0].measureValueFormatted = "" + totalCount1;
                                facets1[0].items[1].measureValue = totalCount2; //mysterious sightings
                                facets1[0].items[1].measureValueFormatted = "" + totalCount2;
                                if (items3 && facets1[0].items.length > 2) {
                                    facets1[0].items[2].measureValue = totalCount3; //publications
                                    facets1[0].items[2].measureValueFormatted = "" + totalCount3;
                                }
                                //proceed to insert facets into resultSet
                                items = _this.adjustHighlights(itemsAll, searchTerm);
                                items = _this.applyFilters(items, searchQuery);
                                resultSet = _this.sina._createSearchResultSet({
                                    items: items,
                                    facets: facets1,
                                    query: searchQuery,
                                    title: "",
                                    totalCount: items.length,
                                });
                            }
                            // window.setTimeout(this.adjustImageViewing, 1000);
                            resolve(resultSet);
                        })];
                });
            });
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Provider.prototype.executeHierarchyQuery = function (query) {
            throw new Error("Method not implmented.");
        };
        Provider.prototype.executeSuggestionQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var searchTerm, demoRoot, searchAbleItems, suggestionTerms, suggestionsMatchingSearchterm, suggestions, createSuggestionItem, i, resultSet;
                return __generator(this, function (_a) {
                    searchTerm = query.filter.searchTerm;
                    demoRoot = this.templateProvider(this);
                    searchAbleItems = demoRoot.searchResultSetItemArray
                        .concat(demoRoot.searchResultSetItemArray2)
                        .concat(demoRoot.searchResultSetItemArray3);
                    suggestionTerms = this.getSuggestionList(searchAbleItems);
                    suggestionsMatchingSearchterm = suggestionTerms.filter(function (s) {
                        var regexp = new RegExp("^" + searchTerm, "gi");
                        return s.match(regexp);
                    });
                    if (suggestionsMatchingSearchterm.length === 0) {
                        suggestionsMatchingSearchterm = suggestionTerms;
                    }
                    suggestions = [];
                    createSuggestionItem = function (term) {
                        var calculationMode = this.sina.SuggestionCalculationMode.Data;
                        var filter = query.filter.clone();
                        filter.setSearchTerm(term);
                        return this.sina._createSearchTermSuggestion({
                            searchTerm: term,
                            calculationMode: calculationMode,
                            filter: filter,
                            label: term,
                        });
                    };
                    for (i = 0; i < suggestionsMatchingSearchterm.length; i++) {
                        suggestions.push(createSuggestionItem(suggestionsMatchingSearchterm[i]));
                    }
                    resultSet = this.sina._createSuggestionResultSet({
                        title: "Suggestions",
                        query: query,
                        items: suggestions,
                    });
                    return [2 /*return*/, new Promise(function (resolve) {
                            resolve(resultSet);
                        })];
                });
            });
        };
        Provider.prototype.executeChartQuery = function (query) {
            return __awaiter(this, void 0, void 0, function () {
                var chartResultSetItems, whichChart;
                return __generator(this, function (_a) {
                    chartResultSetItems = this.generateFacets(query);
                    whichChart = 1;
                    if (query.dimension === "LOCATION" || chartResultSetItems.length === 1) {
                        whichChart = 0;
                    }
                    return [2 /*return*/, new Promise(function (resolve) {
                            resolve(chartResultSetItems[whichChart]);
                        })];
                });
            });
        };
        Provider.prototype.getChartResultSetItemsForLocations = function (resultSetItemsArray) {
            var chartResultSetItems = [];
            var location;
            var locations = [];
            var chartResultSetItem, i, j, k, attrs;
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].detailAttributes;
                for (j = 0; j < attrs.length; j++) {
                    if (attrs[j].id === "LOCATION") {
                        location = attrs[j].value;
                        if (locations.indexOf(location) === -1) {
                            //new location
                            locations.push(location);
                            chartResultSetItem = this.sina._createChartResultSetItem({
                                filterCondition: this.sina.createSimpleCondition({
                                    attribute: "LOCATION",
                                    operator: this.sina.ComparisonOperator.Eq,
                                    value: location,
                                }),
                                dimensionValueFormatted: location,
                                measureValue: 1,
                                measureValueFormatted: "1",
                            });
                            chartResultSetItems.push(chartResultSetItem);
                        }
                        else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === location) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted =
                                        "" + chartResultSetItems[k].measureValue;
                                }
                            }
                        }
                    }
                }
            }
            return chartResultSetItems;
        };
        Provider.prototype.getChartResultSetItemsForPublications = function (resultSetItemsArray) {
            var chartResultSetItems = [];
            var location;
            var locations = [];
            var chartResultSetItem, i, j, k, attrs;
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].detailAttributes;
                for (j = 0; j < attrs.length; j++) {
                    if (attrs[j].id === "PUBLICATION") {
                        location = attrs[j].value;
                        if (locations.indexOf(location) === -1) {
                            //new location
                            locations.push(location);
                            chartResultSetItem = this.sina._createChartResultSetItem({
                                filterCondition: this.sina.createSimpleCondition({
                                    attribute: "PUBLICATION",
                                    operator: this.sina.ComparisonOperator.Eq,
                                    value: location,
                                }),
                                dimensionValueFormatted: location,
                                measureValue: 1,
                                measureValueFormatted: "1",
                            });
                            chartResultSetItems.push(chartResultSetItem);
                        }
                        else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === location) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted =
                                        "" + chartResultSetItems[k].measureValue;
                                }
                            }
                        }
                    }
                }
            }
            return chartResultSetItems;
        };
        Provider.prototype.getSientistOrFolkloristFacet = function (searchQuery, resultSetItemsArray) {
            var scientist;
            var scientists = [];
            var chartResultSetItem, i, j, k, attrs, dimension;
            var chartResultSetItems = [];
            for (i = 0; i < resultSetItemsArray.length; i++) {
                attrs = resultSetItemsArray[i].titleAttributes; //for folklorists and scientists
                if (searchQuery.filter.dataSource.id === "Mysterious_Sightings" ||
                    searchQuery.filter.dataSource.id === "Urban_Legends" ||
                    searchQuery.filter.dataSource.id === "Publications") {
                    attrs = resultSetItemsArray[i].detailAttributes;
                }
                for (j = 0; j < attrs.length; j++) {
                    if (attrs[j].id === "SCIENTIST" || attrs[j].id === "FOLKLORIST") {
                        scientist = attrs[j].value;
                        dimension = attrs[j].id;
                        if (scientists.indexOf(scientist) === -1) {
                            //this particular scientist is not listed yet
                            scientists.push(scientist);
                            chartResultSetItem = this.sina._createChartResultSetItem({
                                filterCondition: this.sina.createSimpleCondition({
                                    attribute: attrs[j].id,
                                    operator: this.sina.ComparisonOperator.Eq,
                                    value: scientist,
                                }),
                                dimensionValueFormatted: scientist,
                                measureValue: 1,
                                measureValueFormatted: "1",
                            });
                            chartResultSetItems.push(chartResultSetItem);
                        }
                        else {
                            //add to measureValue
                            for (k = 0; k < chartResultSetItems.length; k++) {
                                if (chartResultSetItems[k].filterCondition.value === scientist) {
                                    chartResultSetItems[k].measureValue = chartResultSetItems[k].measureValue + 1;
                                    chartResultSetItems[k].measureValueFormatted =
                                        "" + chartResultSetItems[k].measureValue;
                                }
                            }
                        }
                    }
                }
            }
            return [chartResultSetItems, dimension];
        };
        Provider.prototype.getTopFacetOnly = function (searchQuery) {
            var dataSource = searchQuery.filter.sina.allDataSource;
            var dataSourceItems = [
                this.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[1],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 4,
                    measureValueFormatted: "4", //4 scientists currently
                }),
                this.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[2],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 5,
                    measureValueFormatted: "5", //5 sightings currently
                }),
            ];
            if (searchQuery.filter.sina.dataSources[3]) {
                dataSourceItems[2] = this.sina._createDataSourceResultSetItem({
                    dataSource: searchQuery.filter.sina.dataSources[3],
                    dimensionValueFormatted: dataSource.labelPlural,
                    measureValue: 1,
                    measureValueFormatted: "1", //1 publication currently
                });
            }
            var dataSourceFacets = [
                this.sina._createDataSourceResultSet({
                    title: searchQuery.filter.dataSource.label,
                    items: dataSourceItems,
                    query: searchQuery,
                }),
            ];
            return dataSourceFacets;
        };
        Provider.prototype.generateFacets = function (searchQuery) {
            if (searchQuery.filter.dataSource.id === "All") {
                return this.getTopFacetOnly(searchQuery);
            }
            var chartResultSetArray = [];
            var chartResultSet;
            var gen = this.templateProvider(this);
            var filter = this.sina.createFilter({
                searchTerm: this.searchQuery.filter.searchTerm,
                dataSource: this.searchQuery.filter.dataSource,
                rootCondition: this.searchQuery.filter.rootCondition.clone(),
            });
            var chartResultSetItems = [];
            var resultSetItemsArray;
            /*
             *
             *           get the right resultsetitems
             *
             */
            if (searchQuery.filter.dataSource.id === "Publications") {
                resultSetItemsArray = gen.searchResultSetItemArray3;
            }
            else if (searchQuery.filter.dataSource.id === "Scientists" ||
                searchQuery.filter.dataSource.id === "Folklorists") {
                resultSetItemsArray = gen.searchResultSetItemArray;
            }
            else if (searchQuery.filter.dataSource.id === "Urban_Legends" ||
                searchQuery.filter.dataSource.id === "Mysterious_Sightings") {
                resultSetItemsArray = gen.searchResultSetItemArray2;
            }
            /*
             *
             *           Location Facet
             *
             */
            if (searchQuery.filter.dataSource.id === "Scientists" ||
                searchQuery.filter.dataSource.id === "Mysterious_Sightings") {
                chartResultSetItems = this.getChartResultSetItemsForLocations(resultSetItemsArray);
                chartResultSet = this.sina._createChartResultSet({
                    items: chartResultSetItems,
                    query: this.sina.createChartQuery({
                        filter: filter,
                        dimension: "LOCATION",
                    }),
                    title: "Locations",
                });
                chartResultSetArray.push(chartResultSet);
            }
            /*
             *
             *           Scientist or Folklorist Facet
             *
             */
            var info = this.getSientistOrFolkloristFacet(searchQuery, resultSetItemsArray);
            chartResultSetItems = info[0];
            var dimension = info[1];
            chartResultSet = this.sina._createChartResultSet({
                items: chartResultSetItems,
                query: this.sina.createChartQuery({
                    filter: filter,
                    dimension: dimension,
                }),
                title: dimension.charAt(0).toUpperCase() + dimension.slice(1).toLowerCase() + "s",
            });
            chartResultSetArray.push(chartResultSet);
            /*
                 *
                 *           Publication Facet - doesn't work! confirm with holger?
                 *
                
    
                if (searchQuery.filter.dataSource.id === "Publications") {
    
                    chartResultSetItems = this.getChartResultSetItemsForPublications(resultSetItemsArray);
    
                    chartResultSet = this.sina._createChartResultSet({
                        items: chartResultSetItems,
                        query: this.sina.createChartQuery({
                            filter: filter,
                            dimension: "PUBLICATION"
                        }),
                        title: "Publications",
                        type: ''
                    });
                    chartResultSetArray.push(chartResultSet);
                }
     */
            return chartResultSetArray;
        };
        return Provider;
    }(AbstractProvider_1.AbstractProvider));
    exports.Provider = Provider;
});
})();