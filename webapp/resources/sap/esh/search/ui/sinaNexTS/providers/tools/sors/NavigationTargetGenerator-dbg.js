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
sap.ui.define(["require", "exports", "../../../core/util", "../../../core/core", "./JoinConditions", "../../../sina/SinaObject"], function (require, exports, util, core, JoinConditions_1, SinaObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NavigationTargetGenerator = void 0;
    var NavigationTargetGenerator = /** @class */ (function (_super) {
        __extends(NavigationTargetGenerator, _super);
        function NavigationTargetGenerator(properties) {
            var _this = _super.call(this, properties) || this;
            _this.active = _this.checkActive();
            _this.getPropertyMetadata = properties.getPropertyMetadata;
            _this.urlPrefix = properties.urlPrefix;
            _this.navigationTargetTemplatesInitialized = false;
            _this.navigationTargetTemplatesMap = {};
            _this.objectTypeMap = {};
            _this.ignoredSemanticObjectTypes = {
                LastChangedByUser: true,
                CreationDate: true,
                CreatedByUser: true,
            };
            return _this;
        }
        NavigationTargetGenerator.prototype.checkActive = function () {
            var sors = util.getUrlParameter("sors");
            if (sors === "true") {
                return true;
            }
            return false;
        };
        NavigationTargetGenerator.prototype.cleanup = function () {
            this.objectTypeMap = null;
        };
        NavigationTargetGenerator.prototype.registerObjectType = function (objectTypeMetadata) {
            if (!this.active) {
                return;
            }
            var metadata = {
                type: objectTypeMetadata.type,
                label: objectTypeMetadata.label,
                propertyMap: {},
            };
            this.objectTypeMap[objectTypeMetadata.type] = metadata;
            for (var i = 0; i < objectTypeMetadata.properties.length; ++i) {
                var property = objectTypeMetadata.properties[i];
                var propertyMetadata = this.getPropertyMetadata(property);
                this.filterSemanticObjectType(propertyMetadata);
                metadata.propertyMap[propertyMetadata.name] = propertyMetadata;
            }
        };
        NavigationTargetGenerator.prototype.filterSemanticObjectType = function (property) {
            if (this.ignoredSemanticObjectTypes[property.semanticObjectType]) {
                delete property.semanticObjectType;
            }
        };
        NavigationTargetGenerator.prototype.finishRegistration = function () {
            if (!this.active) {
                return;
            }
            this.calculateNavigationTargetTemplates();
        };
        NavigationTargetGenerator.prototype.calculateNavigationTargetTemplates = function () {
            if (this.navigationTargetTemplatesInitialized) {
                return;
            }
            var joinConditionsMap = this.collectJoinConditions();
            this.navigationTargetTemplatesMap =
                this.createNavTargetTemplatesFromJoinConditions(joinConditionsMap);
            this.cleanup();
            this.navigationTargetTemplatesInitialized = true;
        };
        NavigationTargetGenerator.prototype.createNavTargetTemplatesFromJoinConditions = function (joinConditionsMap) {
            var navigationTargetTemplatesMap = {};
            for (var sourceObjectType in joinConditionsMap) {
                var objectTypeJoinConditionsMap = joinConditionsMap[sourceObjectType];
                var navigationTargets = [];
                for (var targetObjectType in objectTypeJoinConditionsMap) {
                    var joinConditions = objectTypeJoinConditionsMap[targetObjectType];
                    if (!joinConditions) {
                        continue;
                    }
                    navigationTargets.push.apply(navigationTargets, joinConditions.generateNavigationTargetTemplates());
                }
                if (navigationTargets.length !== 0) {
                    navigationTargetTemplatesMap[sourceObjectType] = navigationTargets;
                }
            }
            return navigationTargetTemplatesMap;
        };
        NavigationTargetGenerator.prototype.collectJoinConditions = function () {
            var semanticObjectTypeMap = this.createIndex();
            var joinConditionsMap = {};
            for (var objectType in this.objectTypeMap) {
                var objectTypeJoinConditionsMap = this.collectJoinConditionsForObjectType(semanticObjectTypeMap, objectType);
                if (!core.isEmptyObject(objectTypeJoinConditionsMap)) {
                    joinConditionsMap[objectType] = objectTypeJoinConditionsMap;
                }
            }
            return joinConditionsMap;
        };
        NavigationTargetGenerator.prototype.collectJoinConditionsForObjectType = function (semanticObjectTypeMap, objectType) {
            var objectTypeJoinConditionsMap = {};
            var objectTypeMetadata = this.objectTypeMap[objectType];
            var getJoinConditions = function (targetObjectType) {
                var joinConditions = objectTypeJoinConditionsMap[targetObjectType];
                if (!joinConditions) {
                    joinConditions = new JoinConditions_1.JoinConditions({
                        sina: this.sina,
                        navigationTargetGenerator: this,
                        sourceObjectType: objectType,
                        targetObjectType: targetObjectType,
                    });
                    objectTypeJoinConditionsMap[targetObjectType] = joinConditions;
                }
                return joinConditions;
            }.bind(this);
            for (var propertyName in objectTypeMetadata.propertyMap) {
                var property = objectTypeMetadata.propertyMap[propertyName];
                var semanticObjectType = property.semanticObjectType;
                if (!property.response) {
                    continue;
                }
                if (!semanticObjectType) {
                    continue;
                }
                var targetObjectTypeMap = semanticObjectTypeMap[semanticObjectType];
                for (var targetObjectType in targetObjectTypeMap) {
                    if (targetObjectType === objectTypeMetadata.type) {
                        continue;
                    }
                    var targetObjectTypeMetadata = this.objectTypeMap[targetObjectType];
                    var targetPropertyNameMap = targetObjectTypeMap[targetObjectType];
                    for (var targetPropertyName in targetPropertyNameMap) {
                        var targetProperty = targetObjectTypeMetadata.propertyMap[targetPropertyName];
                        if (!targetProperty.request) {
                            continue;
                        }
                        var joinConditions = getJoinConditions(targetObjectType);
                        joinConditions.add({
                            sourcePropertyName: propertyName,
                            targetPropertyName: targetPropertyName,
                            semanticObjectType: semanticObjectType,
                        });
                    }
                }
            }
            return objectTypeJoinConditionsMap;
        };
        NavigationTargetGenerator.prototype.createIndex = function () {
            var semanticObjectTypeMap = {}; // semantic object type / business object type / property name
            for (var objectType in this.objectTypeMap) {
                this.createIndexForObjectType(semanticObjectTypeMap, objectType);
            }
            return semanticObjectTypeMap;
        };
        NavigationTargetGenerator.prototype.createIndexForObjectType = function (semanticObjectTypeMap, objectType) {
            var objectTypeMetadata = this.objectTypeMap[objectType];
            for (var propertyName in objectTypeMetadata.propertyMap) {
                var property = objectTypeMetadata.propertyMap[propertyName];
                var semanticObjectType = property.semanticObjectType;
                if (!semanticObjectType) {
                    continue;
                }
                var objectTypeMap = semanticObjectTypeMap[semanticObjectType];
                if (!objectTypeMap) {
                    objectTypeMap = {};
                    semanticObjectTypeMap[semanticObjectType] = objectTypeMap;
                }
                var propertyNameMap = objectTypeMap[objectTypeMetadata.type];
                if (!propertyNameMap) {
                    propertyNameMap = {};
                    objectTypeMap[objectTypeMetadata.type] = propertyNameMap;
                }
                var propertyFlag = propertyNameMap[propertyName];
                if (!propertyFlag) {
                    propertyFlag = true;
                    propertyNameMap[propertyName] = true;
                }
            }
        };
        NavigationTargetGenerator.prototype.formatItem = function (item) {
            var collectAttributes = function (data, attributes) {
                for (var i = 0; i < attributes.length; ++i) {
                    var attribute = attributes[i];
                    data[attribute.id] = attribute;
                }
            };
            var data = {};
            collectAttributes(data, item.detailAttributes);
            collectAttributes(data, item.titleAttributes);
            return data;
        };
        NavigationTargetGenerator.prototype.generateNavigationTargetsForItem = function (item) {
            var navigationTargetTemplates = this.navigationTargetTemplatesMap[item.dataSource.id];
            if (!navigationTargetTemplates) {
                return undefined;
            }
            var formattedItem = this.formatItem(item);
            var navigationTargets = [];
            for (var i = 0; i < navigationTargetTemplates.length; ++i) {
                var navigationTargetTemplate = navigationTargetTemplates[i];
                var navigationTarget = navigationTargetTemplate.generate(formattedItem);
                if (!navigationTarget) {
                    continue;
                }
                navigationTargets.push(navigationTarget);
            }
            return navigationTargets;
        };
        NavigationTargetGenerator.prototype.generateNavigationTargets = function (searchResultSet) {
            var _a;
            if (!this.active) {
                return;
            }
            for (var i = 0; i < searchResultSet.items.length; ++i) {
                var item = searchResultSet.items[i];
                var navigationTargets = this.generateNavigationTargetsForItem(item);
                item.navigationTargets = item.navigationTargets || [];
                (_a = item.navigationTargets).push.apply(_a, navigationTargets);
            }
        };
        return NavigationTargetGenerator;
    }(SinaObject_1.SinaObject));
    exports.NavigationTargetGenerator = NavigationTargetGenerator;
});
})();