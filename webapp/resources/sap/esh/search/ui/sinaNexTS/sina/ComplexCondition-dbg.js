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
sap.ui.define(["require", "exports", "./Condition", "./ConditionType", "./LogicalOperator", "./SimpleCondition"], function (require, exports, Condition_1, ConditionType_1, LogicalOperator_1, SimpleCondition_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ComplexCondition = void 0;
    var ComplexCondition = /** @class */ (function (_super) {
        __extends(ComplexCondition, _super);
        function ComplexCondition(properties) {
            var _a, _b;
            var _this = _super.call(this, properties) || this;
            // _meta: {
            //     properties: {
            //         operator: {
            //             required: false,
            //             default: function () {
            //                 return this.sina.LogicalOperator.And;
            //             }
            //         },
            //         conditions: {
            //             required: false,
            //             default: function () {
            //                 return [];
            //             }
            //         }
            //     }
            // },
            _this.type = ConditionType_1.ConditionType.Complex;
            _this.operator = LogicalOperator_1.LogicalOperator.And;
            _this.conditions = [];
            _this.operator = (_a = properties.operator) !== null && _a !== void 0 ? _a : _this.operator;
            _this.conditions = (_b = properties.conditions) !== null && _b !== void 0 ? _b : _this.conditions;
            return _this;
        }
        ComplexCondition.prototype.clone = function () {
            var clonedConditions = [];
            for (var i = 0; i < this.conditions.length; ++i) {
                clonedConditions.push(this.conditions[i].clone());
            }
            return new ComplexCondition({
                sina: this.sina,
                operator: this.operator,
                conditions: clonedConditions,
                valueLabel: this.valueLabel,
                attributeLabel: this.attributeLabel,
            });
        };
        ComplexCondition.prototype.equals = function (other) {
            if (!(other instanceof ComplexCondition)) {
                return false;
            }
            if (this.operator !== other.operator) {
                return false;
            }
            if (this.conditions.length !== other.conditions.length) {
                return false;
            }
            var matchedOtherConditions = {};
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                var match = false;
                for (var j = 0; j < other.conditions.length; ++j) {
                    if (matchedOtherConditions[j]) {
                        continue;
                    }
                    var otherCondition = other.conditions[j];
                    if (condition.equals(otherCondition)) {
                        match = true;
                        matchedOtherConditions[j] = true;
                        break;
                    }
                }
                if (!match) {
                    return false;
                }
            }
            return true;
        };
        ComplexCondition.prototype.containsAttribute = function (attribute) {
            for (var _i = 0, _a = this.conditions; _i < _a.length; _i++) {
                var condition = _a[_i];
                if (condition.containsAttribute(attribute)) {
                    return true;
                }
            }
            return false;
        };
        ComplexCondition.prototype._collectAttributes = function (attributeMap) {
            for (var _i = 0, _a = this.conditions; _i < _a.length; _i++) {
                var condition = _a[_i];
                condition._collectAttributes(attributeMap);
            }
        };
        ComplexCondition.prototype.addCondition = function (condition) {
            if (!(condition instanceof Condition_1.Condition)) {
                condition = this.sina.createSimpleCondition(condition);
            }
            this.conditions.push(condition);
        };
        ComplexCondition.prototype.removeConditionAt = function (index) {
            this.conditions.splice(index, 1);
        };
        ComplexCondition.prototype.hasFilters = function () {
            return this.conditions.length >= 1;
        };
        ComplexCondition.prototype.removeAttributeConditions = function (attribute) {
            var result = {
                deleted: false,
                attribute: "",
                value: "",
            };
            for (var i = 0; i < this.conditions.length; ++i) {
                var subCondition = this.conditions[i];
                switch (subCondition.type) {
                    case ConditionType_1.ConditionType.Complex:
                        result = subCondition.removeAttributeConditions(attribute);
                        break;
                    case ConditionType_1.ConditionType.Simple:
                        if (subCondition.attribute === attribute) {
                            result = {
                                deleted: true,
                                attribute: subCondition.attribute,
                                value: subCondition.value,
                            };
                            this.removeConditionAt(i);
                            i--;
                        }
                        break;
                }
            }
            this.cleanup();
            return result;
        };
        ComplexCondition.prototype.getAttributeConditions = function (attribute) {
            var results = [];
            var doGetAttributeConditions = function (condition, attributeName) {
                switch (condition.type) {
                    case ConditionType_1.ConditionType.Complex:
                        for (var i = 0; i < condition.conditions.length; i++) {
                            doGetAttributeConditions(condition.conditions[i], attributeName);
                        }
                        break;
                    case ConditionType_1.ConditionType.Simple:
                        if (condition.attribute === attributeName) {
                            results.push(condition);
                        }
                        break;
                }
            };
            doGetAttributeConditions(this, attribute);
            return results;
        };
        ComplexCondition.prototype.cleanup = function () {
            var removed = false;
            var doCleanup = function (condition) {
                for (var i = 0; i < condition.conditions.length; ++i) {
                    var subCondition = condition.conditions[i];
                    switch (subCondition.type) {
                        case ConditionType_1.ConditionType.Complex:
                            doCleanup(subCondition);
                            if (subCondition.conditions.length === 0) {
                                removed = true;
                                condition.removeConditionAt(i);
                                i--;
                            }
                            break;
                        case ConditionType_1.ConditionType.Simple:
                            break;
                    }
                }
            };
            do {
                removed = false;
                doCleanup(this);
            } while (removed);
        };
        ComplexCondition.prototype.resetConditions = function () {
            this.conditions.splice(0, this.conditions.length);
        };
        ComplexCondition.prototype._getAttribute = function () {
            if (this.conditions.length === 0) {
                return null;
            }
            // just use first condition
            if (this.conditions[0] instanceof ComplexCondition) {
                return this.conditions[0]._getAttribute();
            }
            if (this.conditions[0] instanceof SimpleCondition_1.SimpleCondition) {
                return this.conditions[0]._getAttribute();
            }
            throw new Error("Condition is neither simple nor complex");
        };
        ComplexCondition.prototype.toJson = function () {
            var result = {
                type: ConditionType_1.ConditionType.Complex,
                operator: this.operator,
                conditions: [],
                valueLabel: this.valueLabel,
                attributeLabel: this.attributeLabel,
            };
            for (var i = 0; i < this.conditions.length; ++i) {
                var condition = this.conditions[i];
                if (condition instanceof ComplexCondition) {
                    result.conditions.push(condition.toJson());
                }
                if (condition instanceof SimpleCondition_1.SimpleCondition) {
                    result.conditions.push(condition.toJson());
                }
            }
            if (this.userDefined) {
                result.userDefined = true;
            }
            return result;
        };
        return ComplexCondition;
    }(Condition_1.Condition));
    exports.ComplexCondition = ComplexCondition;
});
})();