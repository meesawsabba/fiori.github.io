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
sap.ui.define(["require", "exports", "../../core/util", "./typeConverter", "../../core/Log", "../../core/errors"], function (require, exports, util, typeConverter, Log_1, errors_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemParser = void 0;
    var ItemParser = /** @class */ (function () {
        function ItemParser(provider) {
            this.log = new Log_1.Log("hana_odata item parser");
            this.provider = provider;
            this.sina = provider.sina;
            this.intentsResolver = this.sina._createFioriIntentsResolver({
                sina: this.sina,
            });
            this.suvNavTargetResolver = this.sina._createSuvNavTargetResolver({
                sina: this.sina,
            });
        }
        ItemParser.prototype.parse = function (searchQuery, data) {
            return __awaiter(this, void 0, void 0, function () {
                var itemsData, itemProms, i, itemData, itemProm;
                return __generator(this, function (_a) {
                    if (data.error && !data.value) {
                        return [2 /*return*/, Promise.reject(new errors_1.InternalServerError(data.error.message))];
                    }
                    if (!data.value) {
                        return [2 /*return*/, Promise.resolve([])];
                    }
                    if (data.error) {
                        this.log.warn("Server-side Warning: " + data.error.message);
                    }
                    itemsData = data.value;
                    itemProms = [];
                    for (i = 0; i < itemsData.length; ++i) {
                        itemData = itemsData[i];
                        itemProm = void 0;
                        try {
                            itemProm = this.parseItem(itemData, searchQuery);
                            itemProms.push(itemProm);
                        }
                        catch (e) {
                            this.log.warn("Error occurred by parsing result item number " + i + ": " + e.message);
                        }
                    }
                    return [2 /*return*/, Promise.all(itemProms)];
                });
            });
        };
        ItemParser.prototype.parseItem = function (itemData, query) {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var attributes, titleAttributes, detailAttributes, titleDescriptionAttributes, allAttributes, semanticObjectTypeAttributes, entitySetName, posOfSeparator, dataSource, whyFounds, metadata, semanticObjectType, suvAttributes, suvAttribute, suvAttributeName, suvHighlightTerms, fallbackDefaultNavigationTarget, rankingScore, itemDataStructured, attributeName, structuredAttribute, attrValue, attrWhyFound, attributeNameWhyfound, _calIsHighlighted, valueString, valueStringHighlighted, attribute, restWhyfoundAttribute, valueTemp, valueFormattedTemp, wAttribute, searchResultSetItem, itemPostParser;
                return __generator(this, function (_b) {
                    attributes = [];
                    titleAttributes = [];
                    detailAttributes = [];
                    titleDescriptionAttributes = [];
                    allAttributes = {};
                    semanticObjectTypeAttributes = {};
                    entitySetName = itemData["@odata.context"] || "";
                    posOfSeparator = entitySetName.lastIndexOf("#");
                    if (posOfSeparator > -1) {
                        entitySetName = entitySetName.slice(posOfSeparator + 1);
                    }
                    dataSource = (_a = this.sina.getDataSource(entitySetName)) !== null && _a !== void 0 ? _a : query.getDataSource();
                    whyFounds = itemData["@com.sap.vocabularies.Search.v1.WhyFound"] || {};
                    semanticObjectType = "";
                    suvAttributes = {};
                    suvHighlightTerms = [];
                    rankingScore = itemData["@com.sap.vocabularies.Search.v1.Ranking"];
                    itemDataStructured = this.preParseItem(itemData);
                    for (attributeName in itemDataStructured) {
                        if (query.groupBy &&
                            query.groupBy.aggregateCountAlias &&
                            query.groupBy.aggregateCountAlias === attributeName) {
                            continue;
                        }
                        structuredAttribute = itemDataStructured[attributeName];
                        metadata = dataSource.getAttributeMetadata(attributeName);
                        if (typeof metadata === "undefined") {
                            throw new errors_1.DataSourceAttributeMetadataNotFoundError("unknown attribute " + attributeName);
                        }
                        if (metadata.id == "LOC_4326") {
                            // required to get maps to frontend // TODO: move to metadata parser
                            metadata.usage.Detail.displayOrder = -1;
                        }
                        attrValue = typeConverter.odata2Sina(metadata.type, structuredAttribute.value);
                        attrWhyFound = void 0;
                        attrWhyFound = undefined;
                        // processing for whyfound
                        for (attributeNameWhyfound in whyFounds) {
                            if (attributeNameWhyfound === attributeName && whyFounds[attributeNameWhyfound][0]) {
                                // replace attribue value with whyfound value
                                attrWhyFound = whyFounds[attributeNameWhyfound][0];
                                if (metadata.usage.Title || metadata.usage.TitleDescription || metadata.usage.Detail) {
                                    delete whyFounds[attributeNameWhyfound];
                                }
                            }
                        }
                        attrWhyFound = this.calculateValueHighlighted(structuredAttribute, metadata, attrWhyFound);
                        _calIsHighlighted = function (attrWhyFound) {
                            if (typeof attrWhyFound === "string" && attrWhyFound.length > 0) {
                                return true;
                            }
                            if (Array.isArray(attrWhyFound) && attrWhyFound.length > 0) {
                                return true;
                            }
                            return false;
                        };
                        valueString = "";
                        if (typeof attrValue === "string") {
                            valueString = attrValue;
                        }
                        else if (attrValue !== null && attrValue !== undefined) {
                            valueString = JSON.stringify(attrValue);
                        }
                        valueStringHighlighted = attrWhyFound;
                        attribute = this.sina._createSearchResultSetItemAttribute({
                            id: metadata.id,
                            label: metadata.label,
                            value: attrValue,
                            valueFormatted: valueString,
                            valueHighlighted: valueStringHighlighted,
                            isHighlighted: _calIsHighlighted(attrWhyFound),
                            metadata: metadata,
                            groups: [],
                        });
                        util.appendRemovingDuplicates(suvHighlightTerms, util.extractHighlightedTerms(attribute.valueHighlighted));
                        // deprecated as of 1.92 since fileviewer is also deprecated
                        // if (metadata.suvUrlAttribute && metadata.suvMimeTypeAttribute) {
                        //     suvUrlAttribute = allAttributes[metadata.suvUrlAttribute] || metadata.suvUrlAttribute.id;
                        //     suvMimeTypeAttribute =
                        //         allAttributes[metadata.suvMimeTypeAttribute] || metadata.suvMimeTypeAttribute.id;
                        //     suvAttributes[metadata.id] = {
                        //         suvThumbnailAttribute: attribute,
                        //         suvTargetUrlAttribute: suvUrlAttribute,
                        //         suvTargetMimeTypeAttribute: suvMimeTypeAttribute,
                        //     };
                        // }
                        if (metadata.usage.Title) {
                            titleAttributes.push(attribute);
                        }
                        if (metadata.usage.TitleDescription) {
                            titleDescriptionAttributes.push(attribute);
                        }
                        if (metadata.usage.Detail) {
                            detailAttributes.push(attribute);
                        }
                        attributes.push(attribute);
                        if (metadata.usage.Navigation) {
                            if (metadata.usage.Navigation.mainNavigation) {
                                fallbackDefaultNavigationTarget = this.sina._createNavigationTarget({
                                    label: attribute.value,
                                    targetUrl: attribute.value,
                                    target: "_blank",
                                });
                            }
                        }
                        allAttributes[attribute.id] = attribute;
                        semanticObjectType =
                            dataSource.attributeMetadataMap[metadata.id]._private.semanticObjectType || "";
                        if (semanticObjectType.length > 0) {
                            semanticObjectTypeAttributes[semanticObjectType] = attrValue;
                        }
                    }
                    for (suvAttributeName in suvAttributes) {
                        suvAttribute = suvAttributes[suvAttributeName];
                        if (typeof suvAttribute.suvTargetUrlAttribute === "string") {
                            suvAttribute.suvTargetUrlAttribute = allAttributes[suvAttribute.suvTargetUrlAttribute];
                        }
                        if (typeof suvAttribute.suvTargetMimeTypeAttribute === "string") {
                            suvAttribute.suvTargetMimeTypeAttribute =
                                allAttributes[suvAttribute.suvTargetMimeTypeAttribute];
                        }
                        if (!(suvAttribute.suvTargetUrlAttribute || suvAttribute.suvTargetMimeTypeAttribute)) {
                            delete suvAttributes[suvAttributeName];
                        }
                    }
                    titleAttributes.sort(function (a1, a2) {
                        return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
                    });
                    detailAttributes.sort(function (a1, a2) {
                        return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
                    });
                    // Check whether there is still whyfoundattr remaining
                    // If yes, it means hits in request attributes
                    // Convert it to attribute and concat it to detailAttributes
                    // No display order normally, candidates for the additional line for whyfounds
                    for (restWhyfoundAttribute in whyFounds) {
                        if (whyFounds[restWhyfoundAttribute][0]) {
                            metadata = dataSource.getAttributeMetadata(restWhyfoundAttribute);
                            valueTemp = whyFounds[restWhyfoundAttribute][0];
                            valueFormattedTemp = typeof valueTemp === "string" ? valueTemp : JSON.stringify(valueTemp);
                            wAttribute = this.sina._createSearchResultSetItemAttribute({
                                id: metadata.id || restWhyfoundAttribute,
                                label: metadata.label || restWhyfoundAttribute,
                                value: null,
                                valueFormatted: valueFormattedTemp,
                                valueHighlighted: valueFormattedTemp,
                                isHighlighted: true,
                                metadata: metadata,
                            });
                            detailAttributes.push(wAttribute);
                            delete whyFounds[restWhyfoundAttribute];
                        }
                    }
                    this.suvNavTargetResolver.resolveSuvNavTargets(dataSource, suvAttributes, suvHighlightTerms);
                    searchResultSetItem = this.sina._createSearchResultSetItem({
                        dataSource: dataSource,
                        attributes: attributes,
                        titleAttributes: titleAttributes,
                        titleDescriptionAttributes: titleDescriptionAttributes,
                        detailAttributes: detailAttributes,
                        defaultNavigationTarget: fallbackDefaultNavigationTarget,
                        navigationTargets: [],
                        score: rankingScore,
                    });
                    searchResultSetItem._private.allAttributesMap = allAttributes;
                    searchResultSetItem._private.semanticObjectTypeAttributes = semanticObjectTypeAttributes;
                    itemPostParser = this.sina._createItemPostParser({
                        searchResultSetItem: searchResultSetItem,
                    });
                    return [2 /*return*/, itemPostParser.postParseResultSetItem()];
                });
            });
        };
        ItemParser.prototype.preParseItem = function (itemData) {
            var itemDataStructured = {};
            for (var originalPropertyName in itemData) {
                if (originalPropertyName[0] === "@" || originalPropertyName[0] === "_") {
                    continue;
                }
                var value = itemData[originalPropertyName];
                var splitted = originalPropertyName.split("@");
                var propertyName = splitted[0];
                var substructure = itemDataStructured[propertyName];
                if (!substructure) {
                    substructure = {};
                    itemDataStructured[propertyName] = substructure;
                }
                if (splitted.length === 1) {
                    substructure.value = value;
                    continue;
                }
                if (splitted.length === 2) {
                    substructure[splitted[1]] = value;
                    continue;
                }
                throw "more than two @ in property name";
            }
            return itemDataStructured;
        };
        ItemParser.prototype._getFirstItemIfArray = function (value) {
            if (Array.isArray(value)) {
                value = value[0];
            }
            return value;
        };
        // valueHiglighted  =
        // multiline: true => input.highlighted | input.snippet | why found
        // multiline: false => input.snippet | input.highlighted | why found
        ItemParser.prototype.calculateValueHighlighted = function (structuredAttribute, metadata, attrWhyFound) {
            var identifierHighlight = "com.sap.vocabularies.Search.v1.Highlighted";
            var identifierSnippet = "com.sap.vocabularies.Search.v1.Snippets";
            var value = "";
            if (metadata.format === "MultilineText") {
                value = structuredAttribute[identifierHighlight];
                if (value) {
                    return this._getFirstItemIfArray(value);
                }
                value = structuredAttribute[identifierSnippet];
                if (value) {
                    return this._getFirstItemIfArray(value);
                }
                return attrWhyFound;
            }
            value = structuredAttribute[identifierSnippet];
            if (value) {
                return this._getFirstItemIfArray(value);
            }
            value = structuredAttribute[identifierHighlight];
            if (value) {
                return this._getFirstItemIfArray(value);
            }
            return this._getFirstItemIfArray(attrWhyFound);
        };
        return ItemParser;
    }());
    exports.ItemParser = ItemParser;
});
})();