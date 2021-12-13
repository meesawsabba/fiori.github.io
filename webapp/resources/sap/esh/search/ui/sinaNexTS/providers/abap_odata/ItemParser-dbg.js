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
sap.ui.define(["require", "exports", "../../sina/SinaObject", "../../core/util", "./typeConverter"], function (require, exports, SinaObject_1, util, typeConverter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemParser = void 0;
    var ItemParser = /** @class */ (function (_super) {
        __extends(ItemParser, _super);
        function ItemParser(provider) {
            var _this = _super.call(this) || this;
            _this.provider = provider;
            _this.sina = provider.sina;
            _this.intentsResolver = _this.sina._createFioriIntentsResolver();
            _this.suvNavTargetResolver = _this.sina._createSuvNavTargetResolver();
            return _this;
        }
        ItemParser.prototype.parse = function (searchQuery, data) {
            if (data.ResultList.SearchResults === null) {
                return Promise.resolve([]);
            }
            var itemsData = data.ResultList.SearchResults.results;
            return this.parseItems(itemsData);
        };
        ItemParser.prototype.parseItems = function (itemsData) {
            var itemProms = [];
            for (var i = 0; i < itemsData.length; ++i) {
                var itemData = itemsData[i];
                var itemProm = this.parseItem(itemData);
                itemProms.push(itemProm);
            }
            return Promise.all(itemProms);
        };
        ItemParser.prototype.parseItem = function (itemData) {
            var j;
            var allAttributes = {};
            var titleAttributes = [];
            var titleDescriptionAttributes = [];
            var attributes = [];
            var detailAttributes = [];
            var suvAttribute, suvAttributeName, suvUrlAttribute, suvMimeTypeAttribute;
            var suvAttributes = {};
            var whyFoundAttributes = [];
            var semanticObjectTypeAttributes = [];
            var fallbackDefaultNavigationTarget;
            var dataSource = this.sina.getDataSource(itemData.DataSourceId);
            var attributeData, metadata, attribute, semanticObjectType;
            var suvHighlightTerms = [];
            var score = itemData.Score / 100;
            // var group;
            for (j = 0; j < itemData.Attributes.results.length; j++) {
                attributeData = itemData.Attributes.results[j];
                metadata = dataSource.getAttributeMetadata(attributeData.Id);
                attribute = this.sina._createSearchResultSetItemAttribute({
                    id: attributeData.Id,
                    label: metadata.label,
                    value: typeConverter.odata2Sina(metadata.type, attributeData.Value),
                    valueFormatted: attributeData.ValueFormatted !== undefined
                        ? attributeData.ValueFormatted
                        : attributeData.Value,
                    // replace: attributeData.ValueFormatted || attributeData.Value
                    // "" || "0000-00-00" -> "0000-00-00" is meaningless value
                    valueHighlighted: attributeData.Snippet || "",
                    // replace: ... || attributeData.ValueFormatted || attributeData.Value
                    // "" || "0000-00-00" -> "0000-00-00" is meaningless value
                    isHighlighted: attributeData.Snippet.indexOf("<b>") > -1 && attributeData.Snippet.indexOf("</b>") > -1,
                    metadata: metadata,
                    groups: [],
                });
                // envalue valueFormatted in ResultValueFormatter.js
                //attribute.valueFormatted = attributeData.ValueFormatted;
                //attribute.valueHighlighted = attributeData.Snippet || attributeData.ValueFormatted;
                attribute.valueHighlighted = attributeData.Snippet;
                allAttributes[attribute.id] = attribute;
                // collect highlight terms needed for creation of suv viewer link
                util.appendRemovingDuplicates(suvHighlightTerms, util.extractHighlightedTerms(attribute.valueHighlighted));
                if (metadata.suvUrlAttribute && metadata.suvMimeTypeAttribute) {
                    suvUrlAttribute = allAttributes[metadata.suvUrlAttribute] || metadata.suvUrlAttribute.id;
                    suvMimeTypeAttribute =
                        allAttributes[metadata.suvMimeTypeAttribute] || metadata.suvMimeTypeAttribute.id;
                    suvAttributes[attributeData.Id] = {
                        suvThumbnailAttribute: attribute,
                        suvTargetUrlAttribute: suvUrlAttribute,
                        suvTargetMimeTypeAttribute: suvMimeTypeAttribute,
                    };
                }
                //attribute = util.addPotentialNavTargetsToAttribute(this.sina, attribute); //find emails phone nrs etc and augment attribute if required
                if (metadata.usage.Navigation) {
                    if (metadata.usage.Navigation.mainNavigation) {
                        fallbackDefaultNavigationTarget = this.sina._createNavigationTarget({
                            label: attribute.value,
                            targetUrl: attribute.value,
                            target: "_blank",
                        });
                    }
                }
                attributes.push(attribute);
                if (metadata.usage.Detail) {
                    detailAttributes.push(attribute);
                }
                if (!metadata.usage.Title &&
                    !metadata.usage.Detail &&
                    !metadata.isDescription &&
                    (attribute.isHighlighted ||
                        (attribute.descriptionAttribute && attribute.descriptionAttribute.isHighlighted)) &&
                    !this._parentHasUsage(metadata, ["Detail", "Title"])) {
                    whyFoundAttributes.push(attribute);
                }
                if (metadata.usage.Title) {
                    titleAttributes.push(attribute);
                }
                if (metadata.usage.TitleDescription) {
                    titleDescriptionAttributes.push(attribute);
                }
                semanticObjectType = dataSource.attributeMetadataMap[attribute.id]._private.semanticObjectType;
                if (semanticObjectType && semanticObjectType.length > 0) {
                    semanticObjectTypeAttributes.push({
                        name: semanticObjectType,
                        value: attribute.value,
                        type: attribute.metadata.type,
                    });
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
            // sort attributes
            titleAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Title.displayOrder - a2.metadata.usage.Title.displayOrder;
            });
            detailAttributes.sort(function (a1, a2) {
                return a1.metadata.usage.Detail.displayOrder - a2.metadata.usage.Detail.displayOrder;
            });
            // parse HitAttributes
            var hitAttributes = this._parseHitAttributes(itemData, dataSource, suvHighlightTerms);
            whyFoundAttributes = whyFoundAttributes.concat(hitAttributes);
            // concatinate whyFound attributes to detail attributes
            detailAttributes = detailAttributes.concat(whyFoundAttributes);
            this.suvNavTargetResolver.resolveSuvNavTargets(dataSource, suvAttributes, suvHighlightTerms);
            var searchResultSetItem = this.sina._createSearchResultSetItem({
                dataSource: dataSource,
                attributes: attributes,
                titleAttributes: titleAttributes,
                titleDescriptionAttributes: titleDescriptionAttributes,
                detailAttributes: detailAttributes,
                defaultNavigationTarget: fallbackDefaultNavigationTarget,
                navigationTargets: [],
                score: score,
            });
            searchResultSetItem._private.allAttributesMap = allAttributes;
            searchResultSetItem._private.semanticObjectTypeAttributes = semanticObjectTypeAttributes;
            var itemPostParser = this.sina._createItemPostParser({
                searchResultSetItem: searchResultSetItem,
            });
            return itemPostParser.postParseResultSetItem();
        };
        ItemParser.prototype._parentHasUsage = function (metadata, usageNames) {
            for (var i = 0; i < metadata.groups.length; i++) {
                var group = metadata.groups[i].group;
                var hasUsage = false;
                for (var j = 0; j < usageNames.length; j++) {
                    if (group.usage[usageNames[j]] !== undefined) {
                        hasUsage = true;
                        break;
                    }
                }
                if (hasUsage || this._parentHasUsage(group, usageNames)) {
                    return true;
                }
            }
            return false;
        };
        ItemParser.prototype._parseHitAttributes = function (itemData, dataSource, suvHighlightTerms) {
            var hitAttributes = [];
            if (itemData.HitAttributes !== null) {
                for (var i = 0; i < itemData.HitAttributes.results.length; i++) {
                    var attributeData = itemData.HitAttributes.results[i];
                    var metadata = dataSource.getAttributeMetadata(attributeData.Id);
                    var value = typeConverter.odata2Sina(metadata.type, util.filterString(attributeData.Snippet, ["<b>", "</b>"]));
                    var attribute = this.sina._createSearchResultSetItemAttribute({
                        id: attributeData.Id,
                        label: metadata.label,
                        //TO DO: abap_odata2Sina
                        value: value,
                        valueFormatted: value,
                        valueHighlighted: attributeData.Snippet,
                        isHighlighted: attributeData.Snippet.indexOf("<b>") > -1 &&
                            attributeData.Snippet.indexOf("</b>") > -1,
                        metadata: metadata,
                    });
                    util.appendRemovingDuplicates(suvHighlightTerms, util.extractHighlightedTerms(attribute.valueHighlighted));
                    hitAttributes.push(attribute);
                }
            }
            return hitAttributes;
        };
        return ItemParser;
    }(SinaObject_1.SinaObject));
    exports.ItemParser = ItemParser;
});
})();