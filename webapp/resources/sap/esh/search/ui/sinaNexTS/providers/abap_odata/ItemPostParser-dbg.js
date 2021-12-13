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
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
sap.ui.define(["require", "exports", "../../sina/SinaObject", "../../sina/AttributeType", "./Provider"], function (require, exports, SinaObject_1, AttributeType_1, Provider_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ItemPostParser = void 0;
    var ItemPostParser = /** @class */ (function (_super) {
        __extends(ItemPostParser, _super);
        function ItemPostParser(properties) {
            var _this = _super.call(this, properties) || this;
            _this._searchResultSetItem = properties.searchResultSetItem;
            _this._dataSource = properties.searchResultSetItem.dataSource;
            _this._allAttributesMap = properties.searchResultSetItem._private.allAttributesMap;
            _this._intentsResolver = _this.sina._createFioriIntentsResolver({
                sina: properties.sina,
            });
            return _this;
        }
        ItemPostParser.prototype.postParseResultSetItem = function () {
            return __awaiter(this, void 0, void 0, function () {
                var prom;
                return __generator(this, function (_a) {
                    prom = this.enhanceResultSetItemWithNavigationTargets();
                    // TODO: what about exceptions?
                    this.enhanceResultSetItemWithGroups(); // can be done in parallel, if parallelization is possible
                    return [2 /*return*/, prom];
                });
            });
        };
        ItemPostParser.prototype.enhanceResultSetItemWithNavigationTargets = function () {
            return __awaiter(this, void 0, void 0, function () {
                var that, semanticObjectType, semanticObjectTypeAttributes, systemId, client, intents, defaultNavigationTarget, navigationTargets, navigationTargetForEnhancement, i;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            that = this;
                            semanticObjectType = that._dataSource._private.semanticObjectType;
                            semanticObjectTypeAttributes = that._searchResultSetItem._private.semanticObjectTypeAttributes;
                            systemId = that._dataSource._private.system;
                            client = that._dataSource._private.client;
                            return [4 /*yield*/, that._intentsResolver.resolveIntents({
                                    semanticObjectType: semanticObjectType,
                                    semanticObjectTypeAttributes: semanticObjectTypeAttributes,
                                    systemId: systemId,
                                    client: client,
                                    fallbackDefaultNavigationTarget: that._searchResultSetItem.defaultNavigationTarget,
                                })];
                        case 1:
                            intents = _a.sent();
                            defaultNavigationTarget = intents && intents.defaultNavigationTarget;
                            navigationTargets = intents && intents.navigationTargets;
                            navigationTargetForEnhancement = [];
                            if (defaultNavigationTarget) {
                                navigationTargetForEnhancement.push(defaultNavigationTarget);
                                that._searchResultSetItem.defaultNavigationTarget = defaultNavigationTarget;
                                defaultNavigationTarget.parent = that._searchResultSetItem;
                            }
                            if (navigationTargets) {
                                that._searchResultSetItem.navigationTargets = navigationTargets;
                                navigationTargetForEnhancement = __spreadArray(__spreadArray([], navigationTargetForEnhancement), navigationTargets);
                                for (i = 0; i < navigationTargets.length; i++) {
                                    navigationTargets[i].parent = that._searchResultSetItem;
                                }
                            }
                            this.enhanceNavigationTargetsWithContentProviderId(navigationTargetForEnhancement);
                            return [2 /*return*/, that._searchResultSetItem];
                    }
                });
            });
        };
        ItemPostParser.prototype.enhanceNavigationTargetsWithContentProviderId = function (navigationTargets) {
            if (!(this.sina.provider instanceof Provider_1.Provider)) {
                return;
            }
            if (!this.sina.provider.contentProviderId) {
                return;
            }
            for (var _i = 0, navigationTargets_1 = navigationTargets; _i < navigationTargets_1.length; _i++) {
                var navigationTarget = navigationTargets_1[_i];
                navigationTarget.targetUrl +=
                    "&sap-app-origin-hint=" + this.sina.provider.contentProviderId;
            }
        };
        ItemPostParser.prototype.enhanceResultSetItemWithGroups = function () {
            var attributesMetadata = this._searchResultSetItem.dataSource.attributesMetadata;
            for (var i = 0; i < attributesMetadata.length; i++) {
                var attributeMetadata = attributesMetadata[i];
                if (attributeMetadata.type === AttributeType_1.AttributeType.Group) {
                    var group = this._addAttributeGroup(attributeMetadata);
                    if (attributeMetadata.usage.Detail) {
                        this._searchResultSetItem.detailAttributes.push(group);
                    }
                    if (attributeMetadata.usage.Title) {
                        this._searchResultSetItem.titleAttributes.push(group);
                    }
                    if (attributeMetadata.usage.TitleDescription) {
                        this._searchResultSetItem.titleDescriptionAttributes.push(group);
                    }
                }
            }
            this.sortAttributes();
        };
        ItemPostParser.prototype.sortAttributes = function () {
            var createSortFunction = function (attributeName) {
                return function (a1, a2) {
                    // be careful to handle displayOrder === 0 correctly!
                    var displayOrder1 = a1.metadata.usage && a1.metadata.usage[attributeName]
                        ? a1.metadata.usage[attributeName].displayOrder
                        : undefined;
                    var displayOrder2 = a2.metadata.usage && a2.metadata.usage[attributeName]
                        ? a2.metadata.usage[attributeName].displayOrder
                        : undefined;
                    if (displayOrder1 === undefined || displayOrder2 === undefined) {
                        if (displayOrder2 !== undefined) {
                            return 1;
                        }
                        return -1;
                    }
                    return displayOrder1 - displayOrder2;
                };
            };
            this._searchResultSetItem.titleAttributes.sort(createSortFunction("Title"));
            this._searchResultSetItem.titleDescriptionAttributes.sort(createSortFunction("TitleDescription"));
            this._searchResultSetItem.detailAttributes.sort(createSortFunction("Detail"));
        };
        ItemPostParser.prototype._addAttributeGroup = function (attributeGroupMetadata) {
            var group = this.sina._createSearchResultSetItemAttributeGroup({
                id: attributeGroupMetadata.id,
                metadata: attributeGroupMetadata,
                label: attributeGroupMetadata.label,
                template: attributeGroupMetadata.template,
                attributes: [],
                groups: [],
            });
            var parentAttributeMetadata, childAttributeMetadata;
            if (attributeGroupMetadata._private) {
                parentAttributeMetadata = attributeGroupMetadata._private.parentAttribute;
                childAttributeMetadata = attributeGroupMetadata._private.childAttribute;
            }
            for (var k = 0; k < attributeGroupMetadata.attributes.length; k++) {
                var attributeMembershipMetadata = attributeGroupMetadata.attributes[k];
                var attributeMetadata = attributeMembershipMetadata.attribute;
                var attributeOrGroup = void 0;
                if (attributeMetadata.type === AttributeType_1.AttributeType.Group) {
                    // attributeOrGroup = this._addAttributeGroup(attributeMetadata, this._allAttributesMap);
                    attributeOrGroup = this._addAttributeGroup(attributeMetadata);
                }
                else {
                    attributeOrGroup = this._allAttributesMap[attributeMetadata.id];
                }
                if (attributeOrGroup) {
                    var attributeGroupMembership = this.sina._createSearchResultSetItemAttributeGroupMembership({
                        group: group,
                        attribute: attributeOrGroup,
                        metadata: attributeMembershipMetadata,
                    });
                    group.attributes.push(attributeGroupMembership);
                    attributeOrGroup.groups.push(attributeGroupMembership);
                }
                if (attributeMetadata == parentAttributeMetadata) {
                    group._private.parentAttribute = attributeOrGroup;
                }
                else if (attributeMetadata == childAttributeMetadata) {
                    group._private.childAttribute = attributeOrGroup;
                }
            }
            return group;
        };
        return ItemPostParser;
    }(SinaObject_1.SinaObject));
    exports.ItemPostParser = ItemPostParser;
});
})();