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
sap.ui.define(["require", "exports", "../../core/errors", "../../sina/AttributeType", "../../sina/ComparisonOperator", "../../sina/ComplexCondition", "./typeConverter"], function (require, exports, errors_1, AttributeType_1, ComparisonOperator_1, ComplexCondition_1, typeConverter) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.serialize = void 0;
    var ConditionSerializer = /** @class */ (function () {
        function ConditionSerializer(dataSource) {
            this.dataSource = dataSource;
        }
        ConditionSerializer.prototype.convertSinaToInaOperator = function (sinaOperator) {
            switch (sinaOperator) {
                case ComparisonOperator_1.ComparisonOperator.Eq:
                    return "=";
                case ComparisonOperator_1.ComparisonOperator.Lt:
                    return "<";
                case ComparisonOperator_1.ComparisonOperator.Gt:
                    return ">";
                case ComparisonOperator_1.ComparisonOperator.Le:
                    return "<=";
                case ComparisonOperator_1.ComparisonOperator.Ge:
                    return ">=";
                case ComparisonOperator_1.ComparisonOperator.Co:
                    return "=";
                case ComparisonOperator_1.ComparisonOperator.Bw:
                    return "=";
                case ComparisonOperator_1.ComparisonOperator.Ew:
                    return "=";
                default:
                    throw new errors_1.UnknownComparisonOperatorError("unknow comparison operator " + sinaOperator);
            }
        };
        ConditionSerializer.prototype.serializeComplexCondition = function (condition) {
            var result = {
                Selection: {
                    Operator: {
                        Code: condition.operator,
                        SubSelections: [],
                    },
                },
            };
            var subConditions = condition.conditions;
            for (var i = 0; i < subConditions.length; ++i) {
                var subCondition = subConditions[i];
                result.Selection.Operator.SubSelections.push(this.serialize(subCondition));
            }
            return result;
        };
        ConditionSerializer.prototype.serializeSimpleCondition = function (condition) {
            if (!condition.value) {
                return undefined;
            }
            // get type of attribute in condition
            var attributeId = condition.attribute;
            var type;
            if (attributeId.slice(0, 2) === "$$") {
                type = AttributeType_1.AttributeType.String;
            }
            else {
                var metadata = this.dataSource.getAttributeMetadata(attributeId);
                type = metadata.type;
            }
            // set operand
            var operand = "MemberOperand";
            if (attributeId === "$$SuggestionTerms$$" || attributeId === "$$SearchTerms$$") {
                operand = "SearchOperand";
            }
            // assemble condition
            var result = {};
            result[operand] = {
                AttributeName: attributeId,
                Comparison: this.convertSinaToInaOperator(condition.operator),
                Value: typeConverter.sina2Ina(type, condition.value, {
                    operator: condition.operator,
                }),
            };
            return result;
        };
        ConditionSerializer.prototype.serialize = function (condition) {
            if (condition instanceof ComplexCondition_1.ComplexCondition) {
                return this.serializeComplexCondition(condition);
            }
            return this.serializeSimpleCondition(condition);
        };
        return ConditionSerializer;
    }());
    function serialize(dataSource, condition) {
        var serializer = new ConditionSerializer(dataSource);
        return serializer.serialize(condition);
    }
    exports.serialize = serialize;
});
})();