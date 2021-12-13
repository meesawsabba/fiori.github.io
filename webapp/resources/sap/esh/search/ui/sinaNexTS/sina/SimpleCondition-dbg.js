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
sap.ui.define(["require", "exports", "../core/util", "./ComparisonOperator", "./Condition", "./ConditionType"], function (require, exports, util, ComparisonOperator_1, Condition_1, ConditionType_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SimpleCondition = void 0;
    var SimpleCondition = /** @class */ (function (_super) {
        __extends(SimpleCondition, _super);
        function SimpleCondition(properties) {
            var _a, _b, _c, _d;
            var _this = _super.call(this, properties) || this;
            _this.type = ConditionType_1.ConditionType.Simple;
            _this.operator = ComparisonOperator_1.ComparisonOperator.Eq;
            _this.operator = (_a = properties.operator) !== null && _a !== void 0 ? _a : _this.operator;
            _this.attribute = (_b = properties.attribute) !== null && _b !== void 0 ? _b : _this.attribute;
            _this.userDefined = (_c = properties.userDefined) !== null && _c !== void 0 ? _c : _this.userDefined;
            _this.value = (_d = properties.value) !== null && _d !== void 0 ? _d : _this.value;
            return _this;
        }
        SimpleCondition.prototype.clone = function () {
            return new SimpleCondition({
                operator: this.operator,
                attribute: this.attribute,
                attributeLabel: this.attributeLabel,
                value: this.value,
                valueLabel: this.valueLabel,
                userDefined: this.userDefined,
            });
        };
        SimpleCondition.prototype.equals = function (other) {
            if (!(other instanceof SimpleCondition)) {
                return false;
            }
            if (this.attribute !== other.attribute || this.operator !== other.operator) {
                return false;
            }
            if (this.value instanceof Date && other.value instanceof Date) {
                return this.value.getTime() === other.value.getTime();
            }
            return this.value === other.value;
        };
        SimpleCondition.prototype.containsAttribute = function (attribute) {
            return this.attribute === attribute;
        };
        SimpleCondition.prototype._collectAttributes = function (attributeMap) {
            attributeMap[this.attribute] = true;
        };
        SimpleCondition.prototype._getAttribute = function () {
            return this.attribute;
        };
        SimpleCondition.prototype.removeAttributeConditions = function (attribute) {
            if (this.attribute === attribute) {
                throw "program error";
            }
            return {
                deleted: false,
                attribute: "",
                value: "",
            };
        };
        SimpleCondition.prototype.toJson = function () {
            var jsonValue;
            if (this.value instanceof Date) {
                jsonValue = util.dateToJson(this.value);
            }
            else {
                jsonValue = this.value;
            }
            var result = {
                type: ConditionType_1.ConditionType.Simple,
                operator: this.operator,
                attribute: this.attribute,
                value: jsonValue,
                valueLabel: this.valueLabel,
                attributeLabel: this.attributeLabel,
            };
            if (this.userDefined) {
                result.userDefined = true;
            }
            return result;
        };
        return SimpleCondition;
    }(Condition_1.Condition));
    exports.SimpleCondition = SimpleCondition;
});
})();