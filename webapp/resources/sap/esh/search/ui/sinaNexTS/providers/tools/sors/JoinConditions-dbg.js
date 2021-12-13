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
sap.ui.define(["require", "exports", "./NavigationTargetTemplate", "../../../sina/SinaObject"], function (require, exports, NavigationTargetTemplate_1, SinaObject_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.JoinConditions = void 0;
    var JoinConditions = /** @class */ (function (_super) {
        __extends(JoinConditions, _super);
        function JoinConditions(properties) {
            var _this = _super.call(this, properties) || this;
            _this.navigationTargetGenerator = properties.navigationTargetGenerator;
            _this.sourceObjectType = properties.sourceObjectType;
            _this.targetObjectType = properties.targetObjectType;
            _this.conditions = [];
            return _this;
        }
        JoinConditions.prototype.add = function (condition) {
            this.conditions.push(condition);
        };
        JoinConditions.prototype.hasDuplicateSemanticObject = function () {
            var map = {};
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                if (map[condition.semanticObjectType]) {
                    return true;
                }
                map[condition.semanticObjectType] = true;
            }
            return false;
        };
        JoinConditions.prototype.hasDistinctValue = function (semanticObjectType, property) {
            var value;
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                if (condition.semanticObjectType !== semanticObjectType) {
                    continue;
                }
                if (!value) {
                    value = condition[property];
                    continue;
                }
                if (value !== condition[property]) {
                    return false;
                }
            }
            return true;
        };
        JoinConditions.prototype.generateNavigationTargetTemplates = function () {
            if (this.hasDuplicateSemanticObject()) {
                return this.createSingleConditionsTemplates();
            }
            return this.createMultipleConditionsTemplates();
        };
        JoinConditions.prototype.createSingleConditionsTemplates = function () {
            var navigationTargetTemplates = [];
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var sourcePropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, "sourcePropertyName");
                var targetPropertyNameDistinct = this.hasDistinctValue(condition.semanticObjectType, "targetPropertyName");
                if (!sourcePropertyNameDistinct && !targetPropertyNameDistinct) {
                    continue;
                }
                var navigationTargetTemplate = new NavigationTargetTemplate_1.NavigationTargetTemplate({
                    sina: this.sina,
                    navigationTargetGenerator: this.navigationTargetGenerator,
                    label: "dummy",
                    sourceObjectType: this.sourceObjectType,
                    targetObjectType: this.targetObjectType,
                    conditions: [condition],
                });
                navigationTargetTemplate._condition = condition;
                navigationTargetTemplates.push(navigationTargetTemplate);
            }
            this.assembleSingleConditionTemplateLabels(navigationTargetTemplates);
            return navigationTargetTemplates;
        };
        JoinConditions.prototype.createMultipleConditionsTemplates = function () {
            return [
                new NavigationTargetTemplate_1.NavigationTargetTemplate({
                    sina: this.sina,
                    navigationTargetGenerator: this.navigationTargetGenerator,
                    label: this.navigationTargetGenerator.objectTypeMap[this.targetObjectType].label,
                    sourceObjectType: this.sourceObjectType,
                    targetObjectType: this.targetObjectType,
                    conditions: this.conditions,
                }),
            ];
        };
        JoinConditions.prototype.assembleSingleConditionTemplateLabels = function (navigationTargets) {
            // assemble label based on target object and target property
            // collect in navigation target in map with label key
            var targetMap = {};
            var targets, labelKey, navigationTarget, metadata;
            for (var i = 0; i < navigationTargets.length; ++i) {
                navigationTarget = navigationTargets[i];
                metadata = this.navigationTargetGenerator.objectTypeMap[this.targetObjectType];
                labelKey =
                    metadata.label +
                        " to:" +
                        metadata.propertyMap[navigationTarget._condition.targetPropertyName].label;
                navigationTarget.label = labelKey;
                targets = targetMap[labelKey];
                if (!targets) {
                    targets = [];
                    targetMap[labelKey] = targets;
                }
                targets.push(navigationTarget);
            }
            // assemble final label
            metadata = this.navigationTargetGenerator.objectTypeMap[this.sourceObjectType];
            for (labelKey in targetMap) {
                targets = targetMap[labelKey];
                if (targets.length > 1) {
                    for (var j = 0; j < targets.length; ++j) {
                        navigationTarget = targets[j];
                        navigationTarget.label +=
                            " from:" + metadata.propertyMap[navigationTarget._condition.sourcePropertyName].label;
                    }
                }
            }
        };
        return JoinConditions;
    }(SinaObject_1.SinaObject));
    exports.JoinConditions = JoinConditions;
});
})();